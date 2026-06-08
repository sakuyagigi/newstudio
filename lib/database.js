// PostgreSQL 数据库封装
// 使用 pg 库连接火山引擎云数据库

import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

// 测试连接
export async function testConnection() {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW()')
    client.release()
    return { success: true, time: result.rows[0].now }
  } catch (error) {
    console.error('[DB] 连接失败:', error.message)
    return { success: false, error: error.message }
  }
}

// 通用查询
export async function query(text, params = []) {
  const start = Date.now()
  try {
    const result = await pool.query(text, params)
    const duration = Date.now() - start
    console.log(`[DB] 查询完成，耗时 ${duration}ms，返回 ${result.rowCount} 行`)
    return result
  } catch (error) {
    console.error('[DB] 查询失败:', error.message)
    throw error
  }
}

// ========== 项目相关 ==========

// 创建项目表（如果不存在）
export async function initTables() {
  const sql = `
    -- 项目表
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) DEFAULT 'draft',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 剧本表
    CREATE TABLE IF NOT EXISTS scripts (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      title VARCHAR(255),
      content TEXT NOT NULL,
      analysis JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 角色表
    CREATE TABLE IF NOT EXISTS characters (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      character_data JSONB,
      avatar_url VARCHAR(512),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 分镜表
    CREATE TABLE IF NOT EXISTS storyboards (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      script_id INTEGER REFERENCES scripts(id) ON DELETE SET NULL,
      shots JSONB,
      total_duration INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 图像资源表
    CREATE TABLE IF NOT EXISTS images (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      character_id INTEGER REFERENCES characters(id) ON DELETE SET NULL,
      storyboard_id INTEGER REFERENCES storyboards(id) ON DELETE SET NULL,
      prompt TEXT,
      image_url VARCHAR(512),
      model VARCHAR(100),
      cost DECIMAL(10,4),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- API调用记录表
    CREATE TABLE IF NOT EXISTS api_logs (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
      director VARCHAR(50),
      model VARCHAR(255),
      input_tokens INTEGER,
      output_tokens INTEGER,
      cost DECIMAL(10,4),
      success BOOLEAN DEFAULT true,
      error_message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    await query(sql)
    console.log('[DB] 数据表初始化完成')
    return { success: true }
  } catch (error) {
    console.error('[DB] 数据表初始化失败:', error.message)
    return { success: false, error: error.message }
  }
}

// 获取所有项目
export async function getProjects() {
  const result = await query(
    'SELECT * FROM projects ORDER BY updated_at DESC'
  )
  return result.rows
}

// 创建项目
export async function createProject({ name, description }) {
  const result = await query(
    'INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  )
  return result.rows[0]
}

// 更新项目
export async function updateProject(id, { name, description, status }) {
  const result = await query(
    `UPDATE projects 
     SET name = COALESCE($1, name), 
         description = COALESCE($2, description),
         status = COALESCE($3, status),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4 
     RETURNING *`,
    [name, description, status, id]
  )
  return result.rows[0]
}

// 删除项目
export async function deleteProject(id) {
  await query('DELETE FROM projects WHERE id = $1', [id])
  return { success: true }
}

// 保存角色
export async function saveCharacter(projectId, characterData) {
  const { name, description, character_data, avatar_url } = characterData
  
  const result = await query(
    `INSERT INTO characters (project_id, name, description, character_data, avatar_url)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       description = EXCLUDED.description,
       character_data = EXCLUDED.character_data,
       avatar_url = EXCLUDED.avatar_url,
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [projectId, name, description, character_data, avatar_url]
  )
  return result.rows[0]
}

// 获取项目角色
export async function getCharacters(projectId) {
  const result = await query(
    'SELECT * FROM characters WHERE project_id = $1 ORDER BY created_at DESC',
    [projectId]
  )
  return result.rows
}

// 记录API调用
export async function logApiCall({ projectId, director, model, inputTokens, outputTokens, cost, success, errorMessage }) {
  await query(
    `INSERT INTO api_logs (project_id, director, model, input_tokens, output_tokens, cost, success, error_message)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [projectId, director, model, inputTokens, outputTokens, cost, success, errorMessage]
  )
}

export default {
  testConnection,
  query,
  initTables,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  saveCharacter,
  getCharacters,
  logApiCall,
}
