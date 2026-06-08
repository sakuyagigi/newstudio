#!/usr/bin/env python3
import json
import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from pathlib import Path

# 配置
PORT = int(os.environ.get('PORT', 3000))
PUBLIC_DIR = Path(__file__).parent / 'public'

class DirectorStudioHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)
    
    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        
        # API 路由
        if path.startswith('/api/'):
            self.handle_api('GET', path, parsed)
            return
        
        # 静态文件
        super().do_GET()
    
    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        
        # API 路由
        if path.startswith('/api/'):
            content_length = int(self.headers.get('Content-Length', 0))
            body = {}
            if content_length > 0:
                try:
                    body = json.loads(self.rfile.read(content_length))
                except:
                    pass
            
            self.handle_api('POST', path, parsed, body)
            return
        
        self.send_error(405)
    
    def handle_api(self, method, path, parsed, body=None):
        # 健康检查
        if path == '/api/health':
            self.json_response({
                'status': 'ok',
                'timestamp': __import__('datetime').datetime.now().isoformat()
            })
            return
        
        # 导演相关 API
        if path.startswith('/api/directors/'):
            self.handle_directors_api(method, path, body)
            return
        
        # 图像生成 API
        if path.startswith('/api/image/'):
            self.handle_image_api(method, path, body)
            return
        
        # 媒体处理 API
        if path.startswith('/api/media/'):
            self.handle_media_api(method, path, body)
            return
        
        # 监控 API
        if path.startswith('/api/monitor'):
            self.handle_monitor_api(method, path, body)
            return
        
        self.send_error(404)
    
    def handle_directors_api(self, method, path, body):
        # 模拟五导演分析 - 返回示例数据
        if path == '/api/directors/analyze':
            self.json_response({
                'success': True,
                'data': {
                    'characters': [
                        {'name': '主角', 'role': '男一号', 'description': '25岁左右，坚毅果敢'},
                        {'name': '女主角', 'role': '女一号', 'description': '23岁左右，聪慧善良'},
                    ],
                    'scenes': [
                        {'name': '开场场景', 'location': '城市街道', 'time': '日', 'description': '主角匆匆走在上班路上'},
                        {'name': '相遇场景', 'location': '咖啡馆', 'time': '日', 'description': '主角与女主角意外相遇'},
                    ],
                    'estimatedShots': 24,
                    'estimatedDuration': '3分钟',
                    'themes': ['成长', '爱情', '都市'],
                }
            })
            return
        
        # ALPHA 剧本分析
        if path == '/api/directors/alpha':
            script = body.get('script', '')
            self.json_response({
                'success': True,
                'data': {
                    'director': 'ALPHA',
                    'content': {
                        'characters': [
                            {'name': '小明', 'role': '男主角', 'description': '20多岁，普通上班族'},
                            {'name': '小红', 'role': '女主角', 'description': '20多岁，活泼开朗'},
                        ],
                        'scenes': [
                            {'name': '场景一', 'location': '咖啡店', 'time': '日', 'description': '两人在咖啡店相遇'},
                            {'name': '场景二', 'location': '公园', 'time': '黄昏', 'description': '两人在公园散步聊天'},
                        ],
                        'estimatedShots': 16,
                        'estimatedDuration': '2-3分钟',
                        'themes': ['爱情', '都市', '日常'],
                        'plotStructure': ['开端', '发展', '高潮', '结局'],
                    }
                }
            })
            return
        
        # BETA 视觉设计
        if path == '/api/directors/beta':
            self.json_response({
                'success': True,
                'data': {
                    'director': 'BETA',
                    'content': {
                        'colorPalette': ['#2C3E50', '#E74C3C', '#F39C12', '#ECF0F1'],
                        'visualStyle': '电影质感',
                        'cameraStyle': '手持跟拍，真实感强',
                        'lightingStyle': '自然光为主，柔和侧光',
                    }
                }
            })
            return
        
        # GAMMA 分镜生成
        if path == '/api/directors/gamma':
            scene_content = body.get('sceneContent', '')
            options = body.get('options', {})
            shot_count = int(options.get('shotCount', 6))
            
            shots = []
            for i in range(shot_count):
                shots.append({
                    'shotNumber': i + 1,
                    'description': f'镜头{i+1}：{scene_content[:20]}...的第{i+1}个镜头',
                    'movement': '固定镜头' if i % 2 == 0 else '缓慢推进',
                    'angle': '平视' if i % 3 == 0 else '仰拍',
                    'duration': f'{3 + i}秒',
                })
            
            self.json_response({
                'success': True,
                'data': {
                    'director': 'GAMMA',
                    'content': {
                        'shots': shots,
                        'totalDuration': f'{sum(3+i for i in range(shot_count))}秒',
                        'aspectRatio': options.get('aspectRatio', '16:9'),
                        'style': options.get('style', 'cinematic'),
                    }
                }
            })
            return
        
        # KAPPA 角色定妆
        if path == '/api/directors/kappa':
            char_desc = body.get('characterDescription', '')
            self.json_response({
                'success': True,
                'data': {
                    'director': 'KAPPA',
                    'content': {
                        'name': char_desc[:10] if char_desc else '角色',
                        'appearance': {
                            'age': '25岁左右',
                            'hair': '黑色短发',
                            'eyes': '深棕色',
                            'build': '中等身材',
                        },
                        'costume': ['日常休闲装', '职业装'],
                        'expressions': ['微笑', '严肃', '惊讶'],
                        'referenceImages': [],
                    }
                }
            })
            return
        
        # EPSILON 制片计划
        if path == '/api/directors/epsilon':
            self.json_response({
                'success': True,
                'data': {
                    'director': 'EPSILON',
                    'content': {
                        'shootingDays': 3,
                        'locations': ['咖啡店', '公园', '街道'],
                        'crew': ['导演', '摄影', '灯光', '录音'],
                        'budget': '¥50,000 - ¥80,000',
                        'schedule': [
                            {'day': 'Day 1', 'scenes': ['场景一', '场景二']},
                            {'day': 'Day 2', 'scenes': ['场景三', '场景四']},
                            {'day': 'Day 3', 'scenes': ['补拍', '空镜']},
                        ],
                    }
                }
            })
            return
        
        self.send_error(404)
    
    def handle_image_api(self, method, path, body):
        if path == '/api/image/generate':
            prompt = body.get('prompt', '')
            model = body.get('model', 'nanobanana')
            
            self.json_response({
                'success': True,
                'data': {
                    'model': model,
                    'prompt': prompt,
                    'images': [
                        {'url': f'/placeholder-{i}.jpg', 'seed': 12345 + i}
                        for i in range(4)
                    ],
                    'taskId': 'img_' + __import__('uuid').uuid4().hex[:8],
                }
            })
            return
        
        if path.startswith('/api/image/status/'):
            task_id = path.split('/')[-1]
            self.json_response({
                'success': True,
                'data': {
                    'taskId': task_id,
                    'status': 'completed',
                    'progress': 100,
                    'images': [{'url': '/placeholder.jpg'}],
                }
            })
            return
        
        self.send_error(404)
    
    def handle_media_api(self, method, path, body):
        if path == '/api/media/process':
            action = body.get('action', '')
            video_url = body.get('videoUrl', '')
            
            self.json_response({
                'success': True,
                'data': {
                    'taskId': 'media_' + __import__('uuid').uuid4().hex[:8],
                    'action': action,
                    'videoUrl': video_url,
                    'status': 'processing',
                    'estimatedTime': '30秒',
                }
            })
            return
        
        if path.startswith('/api/media/task/'):
            task_id = path.split('/')[-1]
            self.json_response({
                'success': True,
                'data': {
                    'taskId': task_id,
                    'status': 'completed',
                    'progress': 100,
                    'resultUrl': '/output.mp4',
                }
            })
            return
        
        self.send_error(404)
    
    def handle_monitor_api(self, method, path, body):
        if path == '/api/monitor' or path == '/api/monitor/':
            self.json_response({
                'success': True,
                'data': {
                    'health': {
                        'status': 'ok',
                        'uptime': '1小时23分',
                        'version': '1.0.0',
                    },
                    'errors': {
                        'total': 0,
                        'today': 0,
                    },
                    'apiStats': {
                        'totalCalls': 156,
                        'todayCalls': 23,
                        'avgResponseTime': '450ms',
                    },
                    'costStats': {
                        'todayCost': 128.50,
                        'monthlyCost': 1280.00,
                        'balance': 8720.00,
                    },
                }
            })
            return
        
        if path == '/api/monitor/health':
            self.json_response({
                'success': True,
                'data': {'status': 'ok', 'uptime': '1小时23分'}
            })
            return
        
        if path == '/api/monitor/cost':
            self.json_response({
                'success': True,
                'data': {
                    'today': 128.50,
                    'monthly': 1280.00,
                    'balance': 8720.00,
                    'byModel': {
                        'NB Pro': 458.00,
                        '千问 Plus': 230.50,
                        'GPT Image 2': 180.00,
                        '豆包 Seed': 156.00,
                        'DeepSeek': 98.50,
                    }
                }
            })
            return
        
        if path == '/api/monitor/errors':
            self.json_response({
                'success': True,
                'data': {'total': 0, 'today': 0, 'list': []}
            })
            return
        
        self.send_error(404)
    
    def json_response(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def end_headers(self):
        # SPA 路由支持 - 404 时返回 index.html
        super().end_headers()
    
    def send_error(self, code, message=None):
        if code == 404 and not self.path.startswith('/api/'):
            # SPA fallback
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            try:
                with open(PUBLIC_DIR / 'index.html', 'rb') as f:
                    self.wfile.write(f.read())
            except:
                super().send_error(404, message)
        else:
            super().send_error(code, message)
    
    def log_message(self, format, *args):
        # 静默模式，不输出日志
        pass

def main():
    server = HTTPServer(('0.0.0.0', PORT), DirectorStudioHandler)
    print(f'🚀 墨枢光影导演台已启动')
    print(f'📍 本地访问: http://localhost:{PORT}')
    print(f'📅 启动时间: {__import__("datetime").datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    print()
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n👋 服务器已停止')
        server.server_close()

if __name__ == '__main__':
    main()
