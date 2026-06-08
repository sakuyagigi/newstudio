#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
项目/分集/分享数据管理模块
"""

import json
import os
import uuid
import time
import re
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
PROJECTS_DIR = os.path.join(DATA_DIR, 'projects')
SHARES_DIR = os.path.join(DATA_DIR, 'shares')

def _ensure_dirs():
    os.makedirs(PROJECTS_DIR, exist_ok=True)
    os.makedirs(SHARES_DIR, exist_ok=True)

_ensure_dirs()

# ============= 项目管理 =============

def list_projects():
    projects = []
    if not os.path.exists(PROJECTS_DIR):
        return projects
    for fname in os.listdir(PROJECTS_DIR):
        proj_dir = os.path.join(PROJECTS_DIR, fname)
        meta_file = os.path.join(proj_dir, 'meta.json')
        if os.path.isdir(proj_dir) and os.path.exists(meta_file):
            with open(meta_file, 'r', encoding='utf-8') as f:
                meta = json.load(f)
                projects.append(meta)
    projects.sort(key=lambda x: x.get('updated_at', ''), reverse=True)
    return projects

def get_project(project_id):
    proj_dir = os.path.join(PROJECTS_DIR, project_id)
    meta_file = os.path.join(proj_dir, 'meta.json')
    if not os.path.exists(meta_file):
        return None
    with open(meta_file, 'r', encoding='utf-8') as f:
        meta = json.load(f)
    meta['episodes'] = list_episodes(project_id)
    return meta

def create_project(name, description=''):
    project_id = str(uuid.uuid4())[:8]
    proj_dir = os.path.join(PROJECTS_DIR, project_id)
    os.makedirs(proj_dir, exist_ok=True)
    
    now = datetime.now().isoformat()
    meta = {
        'id': project_id,
        'name': name,
        'description': description,
        'created_at': now,
        'updated_at': now,
        'total_cost': 0,
    }
    
    with open(os.path.join(proj_dir, 'meta.json'), 'w', encoding='utf-8') as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    
    create_episode(project_id, '第1集', 1)
    return meta

def update_project(project_id, **kwargs):
    proj_dir = os.path.join(PROJECTS_DIR, project_id)
    meta_file = os.path.join(proj_dir, 'meta.json')
    if not os.path.exists(meta_file):
        return None
    with open(meta_file, 'r', encoding='utf-8') as f:
        meta = json.load(f)
    for k, v in kwargs.items():
        if k in ['name', 'description', 'total_cost']:
            meta[k] = v
    meta['updated_at'] = datetime.now().isoformat()
    with open(meta_file, 'w', encoding='utf-8') as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    return meta

def delete_project(project_id):
    import shutil
    proj_dir = os.path.join(PROJECTS_DIR, project_id)
    if os.path.exists(proj_dir):
        shutil.rmtree(proj_dir)
        return True
    return False

# ============= 分集管理 =============

def list_episodes(project_id):
    episodes_dir = os.path.join(PROJECTS_DIR, project_id, 'episodes')
    episodes = []
    if not os.path.exists(episodes_dir):
        return episodes
    for fname in os.listdir(episodes_dir):
        if fname.endswith('.json'):
            with open(os.path.join(episodes_dir, fname), 'r', encoding='utf-8') as f:
                episodes.append(json.load(f))
    episodes.sort(key=lambda x: x.get('episode_number', 0))
    return episodes

def get_episode(project_id, episode_id):
    ep_file = os.path.join(PROJECTS_DIR, project_id, 'episodes', f'{episode_id}.json')
    if not os.path.exists(ep_file):
        return None
    with open(ep_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def create_episode(project_id, title, episode_number=None):
    episodes_dir = os.path.join(PROJECTS_DIR, project_id, 'episodes')
    os.makedirs(episodes_dir, exist_ok=True)
    
    episode_id = str(uuid.uuid4())[:8]
    
    if episode_number is None:
        eps = list_episodes(project_id)
        episode_number = len(eps) + 1
    
    now = datetime.now().isoformat()
    episode = {
        'id': episode_id,
        'project_id': project_id,
        'title': title,
        'episode_number': episode_number,
        'script': '',
        'script_filename': '',
        'created_at': now,
        'updated_at': now,
        'pipeline_result': None,
        'character_chain_result': None,
        'scene_chain_result': None,
        'storyboard_result': None,
        'cost': 0,
    }
    
    with open(os.path.join(episodes_dir, f'{episode_id}.json'), 'w', encoding='utf-8') as f:
        json.dump(episode, f, ensure_ascii=False, indent=2)
    
    update_project(project_id)
    return episode

def update_episode(project_id, episode_id, **kwargs):
    ep_file = os.path.join(PROJECTS_DIR, project_id, 'episodes', f'{episode_id}.json')
    if not os.path.exists(ep_file):
        return None
    with open(ep_file, 'r', encoding='utf-8') as f:
        ep = json.load(f)
    
    for k, v in kwargs.items():
        ep[k] = v
    
    ep['updated_at'] = datetime.now().isoformat()
    
    with open(ep_file, 'w', encoding='utf-8') as f:
        json.dump(ep, f, ensure_ascii=False, indent=2)
    
    update_project(project_id)
    return ep

def delete_episode(project_id, episode_id):
    ep_file = os.path.join(PROJECTS_DIR, project_id, 'episodes', f'{episode_id}.json')
    if os.path.exists(ep_file):
        os.remove(ep_file)
        update_project(project_id)
        return True
    return False

def auto_split_episodes(project_id, episode_id, script_content):
    patterns = [
        r'第\s*(\d+)\s*集',
        r'Episode\s*(\d+)',
        r'EP\s*(\d+)',
        r'第\s*(\d+)\s*话',
    ]
    
    split_points = []
    for pattern in patterns:
        for match in re.finditer(pattern, script_content):
            split_points.append((match.start(), match.group()))
    
    if len(split_points) < 2:
        return []
    
    split_points.sort(key=lambda x: x[0])
    
    new_episodes = []
    for i, (pos, label) in enumerate(split_points):
        num_match = re.search(r'\d+', label)
        ep_num = int(num_match.group()) if num_match else i + 1
        
        start_pos = pos
        end_pos = split_points[i + 1][0] if i + 1 < len(split_points) else len(script_content)
        ep_script = script_content[start_pos:end_pos].strip()
        
        if i == 0:
            update_episode(project_id, episode_id, script=ep_script, title=label)
            new_episodes.append({'id': episode_id, 'title': label, 'episode_number': ep_num})
        else:
            new_ep = create_episode(project_id, label, ep_num)
            new_episodes.append(new_ep)
    
    return new_episodes

# ============= 分享管理 =============

def create_share(project_id, password=None, expire_days=7):
    share_token = str(uuid.uuid4())
    now = time.time()
    expire_at = now + expire_days * 86400 if expire_days else None
    
    share_data = {
        'token': share_token,
        'project_id': project_id,
        'password': password,
        'created_at': datetime.fromtimestamp(now).isoformat(),
        'expire_at': datetime.fromtimestamp(expire_at).isoformat() if expire_at else None,
        'comments': [],
        'view_count': 0,
    }
    
    share_file = os.path.join(SHARES_DIR, f'{share_token}.json')
    with open(share_file, 'w', encoding='utf-8') as f:
        json.dump(share_data, f, ensure_ascii=False, indent=2)
    
    return share_data

def get_share(share_token):
    share_file = os.path.join(SHARES_DIR, f'{share_token}.json')
    if not os.path.exists(share_file):
        return None
    with open(share_file, 'r', encoding='utf-8') as f:
        share = json.load(f)
    
    if share.get('expire_at'):
        expire_time = datetime.fromisoformat(share['expire_at'])
        if datetime.now() > expire_time:
            return None
    
    share['view_count'] += 1
    with open(share_file, 'w', encoding='utf-8') as f:
        json.dump(share, f, ensure_ascii=False, indent=2)
    
    return share

def add_share_comment(share_token, content, author='访客'):
    share_file = os.path.join(SHARES_DIR, f'{share_token}.json')
    if not os.path.exists(share_file):
        return None
    with open(share_file, 'r', encoding='utf-8') as f:
        share = json.load(f)
    
    comment = {
        'id': str(uuid.uuid4())[:8],
        'author': author,
        'content': content,
        'created_at': datetime.now().isoformat(),
    }
    
    share['comments'].append(comment)
    
    with open(share_file, 'w', encoding='utf-8') as f:
        json.dump(share, f, ensure_ascii=False, indent=2)
    
    return comment

def list_shares(project_id):
    shares = []
    if not os.path.exists(SHARES_DIR):
        return shares
    for fname in os.listdir(SHARES_DIR):
        if fname.endswith('.json'):
            share_file = os.path.join(SHARES_DIR, fname)
            with open(share_file, 'r', encoding='utf-8') as f:
                share = json.load(f)
            if share.get('project_id') == project_id:
                shares.append(share)
    shares.sort(key=lambda x: x.get('created_at', ''), reverse=True)
    return shares

# ============= 成本统计 =============

def update_project_cost(project_id):
    episodes = list_episodes(project_id)
    total = sum(ep.get('cost', 0) for ep in episodes)
    update_project(project_id, total_cost=total)
    return total
