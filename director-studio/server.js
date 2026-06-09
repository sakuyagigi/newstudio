#!/usr/bin/env node
// 简单的API代理服务器 - 保护API Key，前端永不接触密钥
// 无需npm安装，直接运行：node server.js

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// 配置 - 生产环境请使用环境变量
const CONFIG = {
  port: process.env.PORT || 3000,
  apiBaseUrl: process.env.API_BASE_URL || 'https://api.516platform.com',
  apiKey: process.env.STRAPP_API_KEY || '',
};

// MIME类型
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// 安全头
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

function serveStaticFile(filePath, res) {
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 
      'Content-Type': contentType,
      ...SECURITY_HEADERS,
    });
    res.end(data);
  });
}

function proxyAPIRequest(apiPath, req, res) {
  const apiUrl = new URL(apiPath, CONFIG.apiBaseUrl);
  
  const options = {
    hostname: apiUrl.hostname,
    port: apiUrl.port || 443,
    path: apiUrl.pathname + apiUrl.search,
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.apiKey}`,
      ...req.headers,
      host: apiUrl.hostname,
    },
  };
  
  // 移除不安全的头
  delete options.headers.cookie;
  delete options.headers.authorization;
  
  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, {
      'Content-Type': 'application/json',
      ...SECURITY_HEADERS,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    proxyRes.pipe(res);
  });
  
  proxyReq.on('error', (e) => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'API请求失败', message: e.message }));
  });
  
  if (req.method === 'POST' || req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      proxyReq.write(body);
      proxyReq.end();
    });
  } else {
    proxyReq.end();
  }
}

const server = http.createServer((req, res) => {
  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }
  
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  
  // API路由
  if (pathname.startsWith('/api/')) {
    if (!CONFIG.apiKey) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'API Key 未配置，请设置 STRAPP_API_KEY 环境变量' }));
      return;
    }
    const apiPath = pathname.replace('/api/', '');
    proxyAPIRequest(apiPath, req, res);
    return;
  }
  
  // 静态文件路由
  let filePath;
  if (pathname === '/' || pathname === '/index.html') {
    filePath = path.join(__dirname, 'public', 'index.html');
  } else if (pathname.startsWith('/public/') || pathname.startsWith('/assets/')) {
    filePath = path.join(__dirname, pathname);
  } else {
    // SPA路由 - 都返回index.html
    filePath = path.join(__dirname, 'public', 'index.html');
  }
  
  serveStaticFile(filePath, res);
});

server.listen(CONFIG.port, () => {
  console.log(`🚀 墨枢光影导演台已启动`);
  console.log(`📍 地址: http://localhost:${CONFIG.port}`);
  console.log(`🔒 API Key 安全模式: ${CONFIG.apiKey ? '已配置' : '未配置'}`);
  console.log(`   所有外部API调用通过服务端转发，前端永不接触密钥`);
});
