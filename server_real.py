#!/usr/bin/env python3
import json
from project_manager import *
import os
import sys
import time
import uuid
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs
from pathlib import Path
import requests
from datetime import datetime
import io
from email import message_from_bytes
from email.policy import default

# 文件解析依赖
try:
    import docx
    HAS_DOCX = True
except ImportError:
    HAS_DOCX = False

try:
    import pdfplumber
    HAS_PDF = True
except ImportError:
    HAS_PDF = False

# ========== 配置 ==========
PORT = int(os.environ.get('PORT', 3000))
PUBLIC_DIR = Path(__file__).parent / 'public'

# API密钥配置
CONFIG = {
    'dashscope': {
        'base_url': 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        'api_key': 'sk-a3a2e0511590483b85e7db57797c2689',
    },
    'volcengine': {
        'base_url': 'https://ark.cn-beijing.volces.com/api/v3',
        'api_key': 'ece30231-a9c6-4172-bb72-28c558363fda',
    },
    'deepseek': {
        'base_url': 'https://api.deepseek.com/v1',
        'api_key': 'sk-348b82f2bf244a69af04ca9b215f61df',
    },
    'moonshot': {
        'base_url': 'https://api.moonshot.cn/v1',
        'api_key': 'sk-jiCcy24cCXiRqn4wjzglqDSka6nJHUUEe7KZ9A8YN8mELGtV',
    },
    'zhipu': {
        'base_url': 'https://open.bigmodel.cn/api/paas/v4',
        'api_key': '2361c8291504498ab008520e5ce9a6dd.b8r9bhOYTVXLqir3',
    },
    'nano_banana': {
        'base_url': 'https://api.suchuang.vip',
        'api_key': 'sk-TWvFeiRj8f9o4fV3q3ieDvEA6NW007UaaShcs9KDNKD1x1iw',
    },
    'suchuang': {
        'base_url': 'https://api.wuyinkeji.com',
        'api_key': 'oUf3KqfG4wIHyaWhfuxY3TT4t6',
    },
}

# 五导演模型配置
DIRECTOR_MODELS = {
    'alpha': {
        'name': 'ALPHA',
        'role': '叙事导演',
        'provider': 'dashscope',
        'model': 'qwen3.7-plus',
        'temperature': 0.6,
        'max_tokens': 4000,
        'description': '剧本分析、人物拆解、叙事结构、合规审查',
    },
    'beta': {
        'name': 'BETA',
        'role': '视觉导演',
        'provider': 'volcengine',
        'model': 'doubao-seed-2-0-pro-260215',
        'temperature': 0.8,
        'max_tokens': 3000,
        'description': '视觉风格、场景设计、色彩体系、道具链',
    },
    'gamma': {
        'name': 'GAMMA',
        'role': '节奏导演',
        'provider': 'deepseek',
        'model': 'deepseek-chat',
        'temperature': 0.5,
        'max_tokens': 4000,
        'description': '分镜拆解、节奏设计、空间链、转场方案',
    },
    'kappa': {
        'name': 'KAPPA',
        'role': '角色导演',
        'provider': 'moonshot',
        'model': 'kimi-k2.6',
        'temperature': 0.6,
        'max_tokens': 3500,
        'description': '角色定妆、表演设计、OOC禁令、视觉DNA',
        'special_params': {'thinking': {'type': 'disabled'}},
    },
    'epsilon': {
        'name': 'EPSILON',
        'role': 'AI制片',
        'provider': 'dashscope',
        'model': 'qwen-plus',
        'temperature': 0.4,
        'max_tokens': 3000,
        'description': '生产调度、风险评估、成本估算、交付节奏',
    },
}

# 成本统计
COST_STATS = {
    'today': 0.0,
    'total': 0.0,
    'by_model': {},
    'calls_today': 0,
    'start_time': time.time(),
}
cost_lock = threading.Lock()

# 模型定价（元/千token）
MODEL_PRICING = {
    'qwen3.7-plus': {'input': 0.012, 'output': 0.048},
    'qwen-plus': {'input': 0.008, 'output': 0.008},
    'doubao-seed-2-0-pro-260215': {'input': 0.02, 'output': 0.06},
    'deepseek-chat': {'input': 0.002, 'output': 0.008},
    'kimi-k2.6': {'input': 0.015, 'output': 0.06},
    'glm-4.7-flash': {'input': 0.001, 'output': 0.002},
}

# 生图任务存储（异步任务）
image_tasks = {}
task_lock = threading.Lock()

# ========== 生图模型优先级配置 ==========
# 角色生图：主力 NB PRO，备用 NB2
CHARACTER_IMAGE_PRIORITY = ['sc_nbPro', 'sc_nb2']
# 场景生图：主力 GPT，备用 NB2 + 即梦5.0
SCENE_IMAGE_PRIORITY = ['sc_gpt', 'sc_nb2', 'seedream']

# ========== 风格池体系 ==========
# 赛道定义
STYLE_TRACKS = {
    'live_action': {
        'name': '真人写实',
        'description': '真人实拍电影质感，光影真实自然',
        'icon': '🎬',
    },
    'anime': {
        'name': '二次元动漫',
        'description': '日式/国风动漫风格，画面精美',
        'icon': '🎨',
    },
    '3d_animation': {
        'name': '3D动画',
        'description': '三维动画质感，立体空间感强',
        'icon': '🎮',
    },
    'chinese_style': {
        'name': '国风国潮',
        'description': '中国传统美学与现代视觉结合',
        'icon': '🏮',
    },
}

# 完整风格池（按赛道分类）
STYLE_POOL = {
    # ===== 真人写实赛道 =====
    'nolan_cold': {
        'track': 'live_action',
        'name': '诺兰式冷峻',
        'professional_name': '新黑色电影 · 高对比度冷调',
        'description': '高对比度光影、冷蓝色调、IMAX画幅质感，严肃悬疑感',
        'tags': ['悬疑', '科幻', '犯罪', '冷峻', '严肃', '高概念', '未来', '黑暗'],
        'color_palette': '冷蓝+深灰+暗金',
        'reference': '《星际穿越》《盗梦空间》视觉风格',
        'character_suffix': 'cinematic lighting, movie still, photorealistic, high contrast, cool blue tones, IMAX quality, sharp focus, professional film photography, dramatic lighting, moody atmosphere',
        'scene_suffix': 'cinematic composition, movie still, photorealistic, high contrast, cold blue color grading, atmospheric, IMAX frame, dramatic lighting, epic scale, detailed environment',
    },
    'wes_anderson': {
        'track': 'live_action',
        'name': '韦斯·安德森',
        'professional_name': '对称构图 · 马卡龙色系',
        'description': '极致对称构图、柔和马卡龙配色、复古精致，童话感',
        'tags': ['童话', '治愈', '温馨', '喜剧', '复古', '文艺', '奇幻', '可爱'],
        'color_palette': '马卡龙粉+薄荷绿+奶油黄',
        'reference': '《布达佩斯大饭店》《月升王国》视觉风格',
        'character_suffix': 'cinematic, wes anderson style, symmetrical composition, pastel colors, vintage aesthetic, movie still, photorealistic, soft lighting, whimsical, highly detailed',
        'scene_suffix': 'wes anderson aesthetic, symmetrical composition, pastel color palette, vintage film, cinematic, movie still, highly detailed interior, soft lighting, whimsical atmosphere',
    },
    'old_money': {
        'track': 'live_action',
        'name': '老钱质感',
        'professional_name': '低饱和暖棕 · 优雅低调',
        'description': '低饱和暖棕色调、柔和侧光、高级质感，低调奢华',
        'tags': ['都市', '职场', '豪门', '精英', '现代', '高端', '商战', '成熟'],
        'color_palette': '暖棕+米白+深灰+藏青',
        'reference': '《继承之战》《广告狂人》质感',
        'character_suffix': 'cinematic lighting, movie still, photorealistic, old money aesthetic, low saturation, warm brown tones, soft side lighting, elegant, high-end fashion, professional photography',
        'scene_suffix': 'cinematic composition, movie still, photorealistic, old money interior, warm neutral tones, soft natural light, elegant minimalist, high-end design, detailed environment',
    },
    'hong_kong_90s': {
        'track': 'live_action',
        'name': '港片黄金年代',
        'professional_name': '霓虹夜影 · 胶片颗粒感',
        'description': '霓虹夜色、胶片颗粒、90年代港风，江湖气质',
        'tags': ['江湖', '警匪', '都市', '复古', '90年代', '香港', '黑帮', '夜戏'],
        'color_palette': '霓虹彩+暗金+胶片黄',
        'reference': '王家卫+杜琪峰港片质感',
        'character_suffix': 'cinematic, hong kong 90s film style, neon lighting, film grain, moody atmosphere, movie still, photorealistic, dramatic shadows, vibrant neon colors, retro aesthetic',
        'scene_suffix': 'hong kong 90s cinema, neon lit street, film grain, moody atmosphere, cinematic composition, movie still, photorealistic, night scene, rain reflections, urban atmosphere',
    },
    
    # ===== 二次元动漫赛道 =====
    'shinkai': {
        'track': 'anime',
        'name': '新海诚式',
        'professional_name': '光线唯美 · 写实背景',
        'description': '唯美光线、写实背景、细腻情感，治愈系美学',
        'tags': ['治愈', '青春', '校园', '奇幻', '唯美', '爱情', '夏天', '日常'],
        'color_palette': '天空蓝+夕阳橙+云白',
        'reference': '《你的名字》《言叶之庭》视觉风格',
        'character_suffix': 'anime style, makoto shinkai style, beautiful lighting, detailed background, vibrant colors, anime key visual, cinematic lighting, emotional atmosphere, high quality animation',
        'scene_suffix': 'makoto shinkai aesthetic, anime scenery, beautiful lighting, realistic background, vibrant colors, scenic view, cinematic composition, high quality animation, atmospheric',
    },
    'ghibli': {
        'track': 'anime',
        'name': '吉卜力风',
        'professional_name': '手绘质感 · 奇幻治愈',
        'description': '手绘水彩质感、奇幻世界、温暖治愈，童话幻想',
        'tags': ['奇幻', '治愈', '童话', '冒险', '自然', '魔法', '温馨', '童年'],
        'color_palette': '森林绿+天空蓝+米白+暖黄',
        'reference': '宫崎骏吉卜力工作室风格',
        'character_suffix': 'studio ghibli style, anime, hand drawn aesthetic, watercolor texture, warm lighting, whimsical, fantasy character, detailed design, beautiful colors, hayao miyazaki art style',
        'scene_suffix': 'studio ghibli aesthetic, anime scenery, hand drawn style, watercolor texture, fantasy world, beautiful nature, warm lighting, whimsical atmosphere, detailed environment',
    },
    'cel_retro': {
        'track': 'anime',
        'name': '赛璐璐复古',
        'professional_name': '90年代动画 · 鲜明轮廓',
        'description': '90年代赛璐璐动画、鲜明轮廓线、怀旧色彩，复古感',
        'tags': ['复古', '90年代', '怀旧', '校园', '热血', '机甲', '魔法', '经典'],
        'color_palette': '高饱和原色+深色轮廓',
        'reference': '90年代日本TV动画质感',
        'character_suffix': '90s anime style, cel shading, retro aesthetic, bold outlines, vibrant colors, classic anime design, cel animation style, film grain, nostalgic, detailed character design',
        'scene_suffix': '90s anime scenery, cel shading, retro aesthetic, bold outlines, vibrant colors, classic anime background, cel animation style, nostalgic atmosphere, detailed environment',
    },
    'kyoani': {
        'track': 'anime',
        'name': '京阿尼风',
        'professional_name': '细腻表演 · 柔和光影',
        'description': '细腻表情表演、柔和光影、日常美感，温暖细腻',
        'tags': ['日常', '校园', '青春', '治愈', '温馨', '情感', '细腻', '生活'],
        'color_palette': '柔和粉+薄荷蓝+暖白',
        'reference': '京都动画京阿尼风格',
        'character_suffix': 'kyoto animation style, anime, soft lighting, detailed facial expression, beautiful character design, high quality animation, warm tones, moe aesthetic, detailed hair and eyes',
        'scene_suffix': 'kyoto animation aesthetic, anime scenery, soft lighting, detailed environment, warm atmosphere, everyday life scene, beautiful background, high quality animation',
    },
    
    # ===== 3D动画赛道 =====
    'pixar_style': {
        'track': '3d_animation',
        'name': '皮克斯质感',
        'professional_name': '卡通渲染 · 丰富材质',
        'description': '卡通风格3D渲染、丰富材质纹理、温暖家庭向光影',
        'tags': ['家庭', '冒险', '喜剧', '童话', '奇幻', '儿童', '温馨', '成长'],
        'color_palette': '丰富饱和+柔和光影',
        'reference': '皮克斯动画电影质感',
        'character_suffix': '3d render, pixar style, cartoon character, detailed textures, warm lighting, cgi animation, high quality 3d, expressive character, colorful, stylized realism',
        'scene_suffix': '3d render, pixar style environment, detailed textures, warm lighting, cgi animation, high quality 3d, colorful scene, stylized, cinematic composition',
    },
    'toon_3d': {
        'track': '3d_animation',
        'name': '二渲三风格',
        'professional_name': '2D笔触+3D空间',
        'description': '2D手绘笔触结合3D空间感，独特美学风格',
        'tags': ['奇幻', '冒险', '艺术', '独特', '实验', '童话', '创新', '视觉系'],
        'color_palette': '手绘质感+立体光影',
        'reference': '《蜘蛛侠：平行宇宙》风格',
        'character_suffix': '3d render with 2d cel shading, toon shader, comic book style, graphic illustration, bold outlines, vibrant colors, stylized 3d, unique art style, detailed character',
        'scene_suffix': '3d render with 2d aesthetic, toon shader, comic book style, graphic illustration, bold lines, vibrant colors, stylized environment, cinematic, unique art direction',
    },
    'realistic_3d': {
        'track': '3d_animation',
        'name': '写实3D',
        'professional_name': '次世代游戏质感',
        'description': '次世代写实3D、真实材质、电影级实时渲染',
        'tags': ['科幻', '奇幻', '游戏', '史诗', '写实', '未来', '魔幻', '战争'],
        'color_palette': '真实材质色+全局光照',
        'reference': '3A游戏CG/最终幻想质感',
        'character_suffix': '3d render, realistic, cinematic, high detail textures, unreal engine 5, realistic materials, cinematic lighting, photorealistic 3d character, detailed face and hair, movie quality',
        'scene_suffix': '3d render, realistic environment, cinematic lighting, unreal engine 5 quality, highly detailed, photorealistic, atmospheric, epic scale, movie quality environment',
    },
    
    # ===== 国风国潮赛道 =====
    'dunhuang': {
        'track': 'chinese_style',
        'name': '敦煌飞天',
        'professional_name': '岩彩质感 · 丝路遗风',
        'description': '敦煌壁画岩彩质感、飘带飞扬、金色点缀，东方神韵',
        'tags': ['玄幻', '仙侠', '古风', '敦煌', '神话', '飞天', '西域', '宗教'],
        'color_palette': '石青+朱砂+土黄+金箔',
        'reference': '敦煌壁画+中国传统重彩',
        'character_suffix': 'dunhuang style, chinese traditional art, mural painting texture, rock colors, flowing silk ribbons, gold accents, elegant pose, oriental aesthetic, mythical character, detailed patterns',
        'scene_suffix': 'dunhuang aesthetic, chinese traditional painting, mural style, rock color texture, flowing fabric, gold details, oriental architecture, atmospheric, mythical atmosphere',
    },
    'ink_wash': {
        'track': 'chinese_style',
        'name': '水墨写意',
        'professional_name': '水墨画 · 留白意境',
        'description': '中国水墨画风格、留白意境、禅意悠远，东方美学',
        'tags': ['武侠', '仙侠', '古风', '水墨', '禅意', '江湖', '山水', '诗意'],
        'color_palette': '墨黑+宣纸白+淡彩点缀',
        'reference': '中国传统水墨山水画',
        'character_suffix': 'chinese ink wash painting style, sumi-e, minimalist, elegant, ink texture, wuxia character, traditional chinese art, atmospheric, poetic, flowing robes, monochrome with subtle color',
        'scene_suffix': 'chinese ink wash painting, sumi-e style, landscape, minimalist, atmospheric, misty mountains, traditional chinese art, poetic, zen aesthetic, ink texture, white space composition',
    },
    'tang_dynasty': {
        'track': 'chinese_style',
        'name': '盛唐气象',
        'professional_name': '雍容华贵 · 金碧辉煌',
        'description': '盛唐雍容华贵、金色朱红、大气磅礴，盛世华章',
        'tags': ['古装', '宫廷', '盛唐', '古风', '历史', '贵族', '朝堂', '宴会'],
        'color_palette': '朱砂红+赤金+石青+明黄',
        'reference': '唐代壁画+宫廷剧质感',
        'character_suffix': 'tang dynasty style, chinese ancient costume, luxurious, gold and red colors, elegant silk robes, traditional chinese architecture background, regal, ornate details, cinematic lighting',
        'scene_suffix': 'tang dynasty palace, chinese ancient architecture, luxurious, gold and red colors, grand hall, ornate details, cinematic composition, historical drama style, atmospheric',
    },
}

# 旧版兼容映射（向后兼容）
STYLE_PRESETS = {k: {
    'name': v['name'],
    'description': v['description'],
    'character_suffix': v['character_suffix'],
    'scene_suffix': v['scene_suffix'],
} for k, v in STYLE_POOL.items()}

# 所有赛道的风格key列表
TRACK_STYLES = {
    track: [k for k, v in STYLE_POOL.items() if v['track'] == track]
    for track in STYLE_TRACKS
}

# 所有风格key列表
ALL_STYLE_KEYS = list(STYLE_POOL.keys())

# 速创模型配置
SUCHUANG_MODELS = {
    'sc_nb2': {
        'endpoint': '/api/async/image_nanoBanana2',
        'model_code': 'nanoBanana2',
        'price': 0.1,
        'size_param': 'size',
        'aspect_param': 'aspectRatio',
        'reference_param': 'urls',
    },
    'sc_nbPro': {
        'endpoint': '/api/async/image_nanoBanana_pro',
        'model_code': 'nanoBananaPro',
        'price': 0.3,
        'size_param': 'size',
        'aspect_param': 'aspectRatio',
        'reference_param': 'urls',
    },
    'sc_gpt': {
        'endpoint': '/api/async/image_gpt',
        'model_code': 'gptImage2',
        'price': 0.1,
        'size_param': 'size',
        'aspect_param': 'size',
        'reference_param': 'urls',
    },
}

# ========== 工具函数 ==========
def add_cost(model, input_tokens, output_tokens):
    pricing = MODEL_PRICING.get(model, {})
    cost = (pricing.get('input', 0) * input_tokens + pricing.get('output', 0) * output_tokens) / 1000
    with cost_lock:
        COST_STATS['today'] += cost
        COST_STATS['total'] += cost
        COST_STATS['by_model'][model] = COST_STATS['by_model'].get(model, 0) + cost
        COST_STATS['calls_today'] += 1
    return cost

def add_image_cost(model_key, price, count=1):
    cost = price * count
    with cost_lock:
        COST_STATS['today'] += cost
        COST_STATS['total'] += cost
        COST_STATS['by_model'][model_key] = COST_STATS['by_model'].get(model_key, 0) + cost
    return cost

def call_llm(provider, model, messages, temperature=0.7, max_tokens=2000, special_params=None, max_retries=2):
    """调用LLM，支持自动重试
    
    Args:
        max_retries: 最大重试次数（默认2次，总共尝试3次）
    """
    config = CONFIG.get(provider)
    if not config:
        raise ValueError(f'未知提供商: {provider}')
    
    body = {
        'model': model,
        'messages': messages,
        'temperature': temperature,
        'max_tokens': max_tokens,
    }
    
    if special_params:
        body.update(special_params)
    
    headers = {
        'Authorization': f'Bearer {config["api_key"]}',
        'Content-Type': 'application/json',
    }
    
    last_error = None
    # 指数退避：第1次重试等2s，第2次等5s
    backoff_times = [2, 5, 8]
    
    for attempt in range(max_retries + 1):
        try:
            response = requests.post(
                f'{config["base_url"]}/chat/completions',
                headers=headers,
                json=body,
                timeout=120,
            )
            
            # 5xx错误重试
            if response.status_code >= 500:
                last_error = f'服务器错误 {response.status_code}'
                if attempt < max_retries:
                    time.sleep(backoff_times[attempt])
                    continue
            
            response.raise_for_status()
            data = response.json()
            
            usage = data.get('usage', {})
            input_tokens = usage.get('prompt_tokens', 0)
            output_tokens = usage.get('completion_tokens', 0)
            
            cost = add_cost(model, input_tokens, output_tokens)
            
            content = data['choices'][0]['message']['content']
            
            result = {
                'success': True,
                'content': content,
                'usage': {
                    'inputTokens': input_tokens,
                    'outputTokens': output_tokens,
                    'totalTokens': input_tokens + output_tokens,
                },
                'cost': cost,
                'model': data.get('model', model),
            }
            
            if attempt > 0:
                result['retries'] = attempt
            
            return result
            
        except requests.exceptions.Timeout as e:
            last_error = f'请求超时: {str(e)}'
            if attempt < max_retries:
                time.sleep(backoff_times[attempt])
                continue
        except requests.exceptions.ConnectionError as e:
            last_error = f'连接错误: {str(e)}'
            if attempt < max_retries:
                time.sleep(backoff_times[attempt])
                continue
        except requests.exceptions.RequestException as e:
            # 4xx错误不重试
            last_error = f'API调用失败: {str(e)}'
            break
        except Exception as e:
            last_error = f'未知错误: {str(e)}'
            if attempt < max_retries:
                time.sleep(backoff_times[attempt])
                continue
    
    return {
        'success': False,
        'error': last_error or '调用失败',
    }

def parse_json_content(content):
    """智能解析JSON内容，支持多种格式容错
    
    解析策略优先级：
    1. 直接解析
    2. 提取 ```json 代码块
    3. 提取 ``` 代码块
    4. 提取首个 { 到最后一个 } 之间的内容
    5. 修复常见格式问题后重试
    """
    if not content:
        return {}
    
    # 策略1：直接解析
    try:
        return json.loads(content)
    except:
        pass
    
    # 策略2：提取 ```json 代码块
    if '```json' in content:
        start = content.find('```json') + 7
        end = content.find('```', start)
        if end > start:
            json_str = content[start:end].strip()
            try:
                return json.loads(json_str)
            except:
                # 尝试修复后再解析
                fixed = _fix_json_string(json_str)
                if fixed:
                    try:
                        return json.loads(fixed)
                    except:
                        pass
    
    # 策略3：提取 ``` 代码块（可能是js/ts等）
    if '```' in content:
        start = content.find('```') + 3
        # 跳过第一行语言标记
        first_newline = content.find('\n', start)
        if first_newline > 0:
            start = first_newline + 1
        end = content.find('```', start)
        if end > start:
            json_str = content[start:end].strip()
            try:
                return json.loads(json_str)
            except:
                fixed = _fix_json_string(json_str)
                if fixed:
                    try:
                        return json.loads(fixed)
                    except:
                        pass
    
    # 策略4：提取首个 { 到最后一个 }
    first_brace = content.find('{')
    last_brace = content.rfind('}')
    if first_brace >= 0 and last_brace > first_brace:
        json_str = content[first_brace:last_brace + 1]
        try:
            return json.loads(json_str)
        except:
            fixed = _fix_json_string(json_str)
            if fixed:
                try:
                    return json.loads(fixed)
                except:
                    pass
    
    # 策略5：提取首个 [ 到最后一个 ]（数组）
    first_bracket = content.find('[')
    last_bracket = content.rfind(']')
    if first_bracket >= 0 and last_bracket > first_bracket:
        json_str = content[first_bracket:last_bracket + 1]
        try:
            return json.loads(json_str)
        except:
            pass
    
    # 全部失败，返回原始内容
    return {'raw': content}


def _fix_json_string(json_str):
    """尝试修复常见的JSON格式问题"""
    if not json_str:
        return None
    
    import re
    
    # 移除尾随逗号（对象最后一个属性后）
    json_str = re.sub(r',\s*}', '}', json_str)
    # 移除尾随逗号（数组最后一个元素后）
    json_str = re.sub(r',\s*]', ']', json_str)
    
    # 尝试修复未转义的双引号（在字符串值内部）
    # 这是一个简化处理，不一定能处理所有情况
    lines = json_str.split('\n')
    fixed_lines = []
    for line in lines:
        # 简单处理：如果一行有奇数个引号且不是key-value行，可能有问题
        # 这里只做最保守的修复
        fixed_lines.append(line)
    
    return '\n'.join(fixed_lines)

# ========== 五导演方法 ==========
def alpha_analyze_script(script_content):
    director = DIRECTOR_MODELS['alpha']
    messages = [
        {
            'role': 'system',
            'content': '你是ALPHA，墨枢光影导演台的叙事导演。你的专长：剧本深度分析、人物关系梳理、叙事结构设计、合规风险审查。输出要求：严格JSON格式，不要任何多余文字。',
        },
        {
            'role': 'user',
            'content': f'''深度分析以下剧本，输出结构化JSON：

{script_content}

需要包含：
1. characters: 角色列表（name, description, arc, motivation）
2. scenes: 场景拆解（id, location, time, keyEvent, emotionalBeat）
3. structure: 叙事结构（act1, act2, act3的转折点）
4. compliance: 合规审查（rating: safe/caution/risk, notes）
5. themes: 主题关键词（数组）
6. logline: 一句话梗概
7. estimatedShots: 预估镜头数
8. estimatedDuration: 预估时长（分钟）''',
        },
    ]
    
    result = call_llm(
        director['provider'],
        director['model'],
        messages,
        temperature=director['temperature'],
        max_tokens=director['max_tokens'],
    )
    
    if result['success']:
        parsed = parse_json_content(result['content'])
        return {
            'success': True,
            'data': {
                'director': 'ALPHA',
                'content': parsed,
                'usage': result['usage'],
                'cost': result['cost'],
            }
        }
    return result

def beta_design_visual(scene_description):
    director = DIRECTOR_MODELS['beta']
    messages = [
        {
            'role': 'system',
            'content': '你是BETA，墨枢光影导演台的视觉导演。你的专长：场景视觉设计、色彩体系、光影方案、道具链设计。输出要求：严格JSON格式，不要任何多余文字。',
        },
        {
            'role': 'user',
            'content': f'''为以下场景设计完整视觉方案：

{scene_description}

需要包含：
1. visualStyle: 整体视觉风格描述
2. colorPalette: 色彩体系（primary, secondary, accent, mood）
3. lighting: 光影方案（type, direction, intensity, mood）
4. keyProps: 核心道具列表（name, description, visualWeight）
5. composition: 构图建议（shotTypes, cameraMovement, rhythm）
6. referenceKeywords: AI生图关键词（数组，中英文混合，至少10个关键词）''',
        },
    ]
    
    result = call_llm(
        director['provider'],
        director['model'],
        messages,
        temperature=director['temperature'],
        max_tokens=director['max_tokens'],
    )
    
    if result['success']:
        parsed = parse_json_content(result['content'])
        return {
            'success': True,
            'data': {
                'director': 'BETA',
                'content': parsed,
                'usage': result['usage'],
                'cost': result['cost'],
            }
        }
    return result

def gamma_generate_storyboard(scene_content, shot_count=6):
    director = DIRECTOR_MODELS['gamma']
    messages = [
        {
            'role': 'system',
            'content': '你是GAMMA，墨枢光影导演台的节奏导演。你的专长：分镜拆解、节奏设计、空间轴线、镜头运动。输出要求：严格JSON格式，不要任何多余文字。',
        },
        {
            'role': 'user',
            'content': f'''将以下内容拆解为详细分镜，约{shot_count}个镜头：

{scene_content}

要求：
- 每个镜头包含：shotNumber, shotType（景别）, angle（角度）, movement（运动）, duration（秒数）, description（画面描述）, dialogue（台词，如有）
- 注意180度轴线规则
- 标注关键转场方式
- 每个镜头的description要足够详细，可直接用于AI生图
- 输出JSON格式：{{ "shots": [...], "transitions": [...], "totalDuration": 总秒数, "aspectRatio": "16:9" }}''',
        },
    ]
    
    result = call_llm(
        director['provider'],
        director['model'],
        messages,
        temperature=director['temperature'],
        max_tokens=director['max_tokens'],
    )
    
    if result['success']:
        parsed = parse_json_content(result['content'])
        return {
            'success': True,
            'data': {
                'director': 'GAMMA',
                'content': parsed,
                'usage': result['usage'],
                'cost': result['cost'],
            }
        }
    return result

def kappa_design_character(character_description):
    director = DIRECTOR_MODELS['kappa']
    messages = [
        {
            'role': 'system',
            'content': '你是KAPPA，墨枢光影导演台的角色导演。你的专长：角色定妆设计、表演风格设定、OOC规则、视觉DNA锚定。输出要求：严格JSON格式，不要任何多余文字。',
        },
        {
            'role': 'user',
            'content': f'''为以下角色设计完整定妆方案：

{character_description}

需要包含：
1. basicInfo: 基本信息（name, age, gender, occupation）
2. appearance: 外貌特征（face, hair, eyes, build, distinguishingFeatures）
3. costume: 服装造型（mainOutfit, accessories, footwear, styleKeywords）
4. props: 随身道具（name, description, significance）
5. performance: 表演风格（posture, gestures, voice, expressions, mannerisms）
6. oocRules: OOC禁令（绝对不能做的事，数组）
7. visualDNA: 视觉DNA锚点（3-5个核心识别特征，确保AI出图一致性）
8. promptKeywords: 生图关键词（数组，中英文混合，至少15个关键词，可直接用于生图）''',
        },
    ]
    
    result = call_llm(
        director['provider'],
        director['model'],
        messages,
        temperature=director['temperature'],
        max_tokens=director['max_tokens'],
        special_params=director.get('special_params'),
    )
    
    if result['success']:
        parsed = parse_json_content(result['content'])
        return {
            'success': True,
            'data': {
                'director': 'KAPPA',
                'content': parsed,
                'usage': result['usage'],
                'cost': result['cost'],
            }
        }
    return result

def epsilon_create_schedule(project_data):
    director = DIRECTOR_MODELS['epsilon']
    messages = [
        {
            'role': 'system',
            'content': '你是EPSILON，墨枢光影导演台的AI制片。你的专长：生产调度、风险评估、成本估算、交付节奏。输出要求：严格JSON格式，不要任何多余文字。',
        },
        {
            'role': 'user',
            'content': f'''为以下项目制定制片生产计划：

{json.dumps(project_data, ensure_ascii=False, indent=2)}

需要包含：
1. schedule: 生产排期（phases数组，含name, duration, tasks）
2. shotBatches: 镜头批次（batches数组，含batchId, count, priority, estimatedTime）
3. risks: 风险评估（risks数组，含risk, probability, impact, mitigation）
4. costEstimate: 成本估算（total, breakdown明细）
5. milestones: 里程碑节点（数组，含name, deliverable, deadline）
6. parallelism: 并行度建议（maxParallelJobs, reasoning）''',
        },
    ]
    
    result = call_llm(
        director['provider'],
        director['model'],
        messages,
        temperature=director['temperature'],
        max_tokens=director['max_tokens'],
    )
    
    if result['success']:
        parsed = parse_json_content(result['content'])
        return {
            'success': True,
            'data': {
                'director': 'EPSILON',
                'content': parsed,
                'usage': result['usage'],
                'cost': result['cost'],
            }
        }
    return result

def run_director_pipeline(script_content, task=None, directors=None):
    """五导演流水线 - 依次调用
    Args:
        script_content: 剧本内容
        task: 异步任务对象
        directors: 指定要运行的导演列表，如 ['alpha', 'beta']，None表示全部
    Returns:
        流水线结果，含每个导演的状态（success/failed/skipped）和成本
    """
    results = {}
    start_time = time.time()
    
    # 默认全部导演
    all_directors = ['alpha', 'beta', 'gamma', 'kappa', 'epsilon']
    if directors is None:
        directors = all_directors
    
    # 导演进度映射
    progress_map = {'alpha': 20, 'beta': 40, 'gamma': 60, 'kappa': 80, 'epsilon': 95}
    
    # 用于传递的中间数据
    alpha_content = {}
    chars = []
    shots = []
    
    # ALPHA - 剧本分析
    if 'alpha' in directors:
        print('[导演流水线] ALPHA 开始剧本分析...')
        if task: task['currentDirector'] = 'alpha'
        try:
            results['alpha'] = alpha_analyze_script(script_content)
            if results['alpha'].get('success'):
                alpha_content = results['alpha'].get('data', {}).get('content', {})
                chars = alpha_content.get('characters', [])
                print(f'[导演流水线] ALPHA 完成，成本: ¥{results["alpha"]["data"]["cost"]:.4f}')
            else:
                print(f'[导演流水线] ALPHA 失败: {results["alpha"].get("error", "未知错误")}')
        except Exception as e:
            results['alpha'] = {'success': False, 'error': f'执行异常: {str(e)}'}
            print(f'[导演流水线] ALPHA 异常: {str(e)}')
        if task: task['progress'] = progress_map['alpha']
    else:
        results['alpha'] = {'success': False, 'skipped': True, 'error': '未选择此档位'}
    
    # BETA - 视觉设计（依赖ALPHA）
    if 'beta' in directors:
        print('[导演流水线] BETA 开始视觉设计...')
        if task: task['currentDirector'] = 'beta'
        try:
            if results.get('alpha', {}).get('success'):
                scenes_text = '\n'.join([s.get('keyEvent', '') for s in alpha_content.get('scenes', [])]) or script_content
            else:
                scenes_text = script_content
            results['beta'] = beta_design_visual(scenes_text)
            if results['beta'].get('success'):
                print(f'[导演流水线] BETA 完成，成本: ¥{results["beta"]["data"]["cost"]:.4f}')
            else:
                print(f'[导演流水线] BETA 失败: {results["beta"].get("error", "未知错误")}')
        except Exception as e:
            results['beta'] = {'success': False, 'error': f'执行异常: {str(e)}'}
            print(f'[导演流水线] BETA 异常: {str(e)}')
        if task: task['progress'] = progress_map['beta']
    else:
        results['beta'] = {'success': False, 'skipped': True, 'error': '未选择此档位'}
    
    # GAMMA - 分镜生成（不依赖前序，直接用剧本）
    if 'gamma' in directors:
        print('[导演流水线] GAMMA 开始分镜生成...')
        if task: task['currentDirector'] = 'gamma'
        try:
            results['gamma'] = gamma_generate_storyboard(script_content, shot_count=12)
            if results['gamma'].get('success'):
                shots = results['gamma'].get('data', {}).get('content', {}).get('shots', [])
                print(f'[导演流水线] GAMMA 完成，成本: ¥{results["gamma"]["data"]["cost"]:.4f}')
            else:
                print(f'[导演流水线] GAMMA 失败: {results["gamma"].get("error", "未知错误")}')
        except Exception as e:
            results['gamma'] = {'success': False, 'error': f'执行异常: {str(e)}'}
            print(f'[导演流水线] GAMMA 异常: {str(e)}')
        if task: task['progress'] = progress_map['gamma']
    else:
        results['gamma'] = {'success': False, 'skipped': True, 'error': '未选择此档位'}
    
    # KAPPA - 角色设计（依赖ALPHA）
    if 'kappa' in directors:
        print('[导演流水线] KAPPA 开始角色设计...')
        if task: task['currentDirector'] = 'kappa'
        try:
            if results.get('alpha', {}).get('success'):
                chars_text = '\n'.join([f'{c.get("name", "")}: {c.get("description", "")}' for c in chars]) or script_content
            else:
                chars_text = script_content
            results['kappa'] = kappa_design_character(chars_text)
            if results['kappa'].get('success'):
                print(f'[导演流水线] KAPPA 完成，成本: ¥{results["kappa"]["data"]["cost"]:.4f}')
            else:
                print(f'[导演流水线] KAPPA 失败: {results["kappa"].get("error", "未知错误")}')
        except Exception as e:
            results['kappa'] = {'success': False, 'error': f'执行异常: {str(e)}'}
            print(f'[导演流水线] KAPPA 异常: {str(e)}')
        if task: task['progress'] = progress_map['kappa']
    else:
        results['kappa'] = {'success': False, 'skipped': True, 'error': '未选择此档位'}
    
    # EPSILON - 制片计划（依赖ALPHA和GAMMA）
    if 'epsilon' in directors:
        print('[导演流水线] EPSILON 开始制片计划...')
        if task: task['currentDirector'] = 'epsilon'
        try:
            project_data = {
                'scriptLength': len(script_content),
                'scenesCount': len(alpha_content.get('scenes', [])),
                'charactersCount': len(chars),
                'shotsCount': len(shots),
            }
            results['epsilon'] = epsilon_create_schedule(project_data)
            if results['epsilon'].get('success'):
                print(f'[导演流水线] EPSILON 完成，成本: ¥{results["epsilon"]["data"]["cost"]:.4f}')
            else:
                print(f'[导演流水线] EPSILON 失败: {results["epsilon"].get("error", "未知错误")}')
        except Exception as e:
            results['epsilon'] = {'success': False, 'error': f'执行异常: {str(e)}'}
            print(f'[导演流水线] EPSILON 异常: {str(e)}')
        if task: task['progress'] = progress_map['epsilon']
    else:
        results['epsilon'] = {'success': False, 'skipped': True, 'error': '未选择此档位'}
    
    duration = round(time.time() - start_time, 1)
    total_cost = sum(r.get('data', {}).get('cost', 0) for r in results.values() if r.get('success'))
    success_count = sum(1 for r in results.values() if r.get('success'))
    failed_count = sum(1 for r in results.values() if not r.get('success') and not r.get('skipped'))
    
    # 统计成功导演列表
    successful_directors = [d for d in all_directors if results.get(d, {}).get('success')]
    
    return {
        'success': success_count > 0,  # 只要有一个成功就算部分成功
        'partialSuccess': success_count > 0 and failed_count > 0,
        'allSuccess': failed_count == 0 and success_count == len(directors),
        'totalDirectors': len(directors),
        'successCount': success_count,
        'failedCount': failed_count,
        'successfulDirectors': successful_directors,
        'duration': f'{duration}s',
        'totalCost': total_cost,
        'results': results,
    }

def run_director_pipeline_with_progress(script_content, task, directors=None):
    """带进度更新的五导演流水线
    Args:
        script_content: 剧本内容
        task: 异步任务对象
        directors: 指定要运行的导演列表，None表示全部
    """
    return run_director_pipeline(script_content, task, directors=directors)

# ========== 生图核心方法 ==========
def generate_image_suchuang(prompt, model_key='sc_nb2', size='1K', aspect_ratio='auto', n=1, reference_urls=None):
    """使用速创平台生图（异步模式）"""
    config = CONFIG['suchuang']
    model_config = SUCHUANG_MODELS.get(model_key)
    if not model_config:
        return {'success': False, 'error': f'未知模型: {model_key}'}
    
    headers = {
        'Authorization': config['api_key'],
        'Content-Type': 'application/json',
    }
    
    body = {'prompt': prompt}
    
    if model_key == 'sc_gpt':
        body['size'] = aspect_ratio if aspect_ratio != 'auto' else 'auto'
        if reference_urls:
            body['urls'] = reference_urls
    else:
        body['size'] = size
        body['aspectRatio'] = aspect_ratio
        if reference_urls:
            body['urls'] = reference_urls
    
    try:
        endpoint = model_config['endpoint']
        response = requests.post(
            f'{config["base_url"]}{endpoint}?key={config["api_key"]}',
            headers=headers,
            json=body,
            timeout=30,
        )
        response.raise_for_status()
        data = response.json()
        
        if data.get('code') != 200:
            return {'success': False, 'error': f'提交失败: {data.get("msg", "未知错误")}'}
        
        task_id = data['data']['id']
        
        max_wait = 120
        start_time = time.time()
        images = []
        
        while time.time() - start_time < max_wait:
            time.sleep(3)
            
            result_resp = requests.get(
                f'{config["base_url"]}/api/async/detail?key={config["api_key"]}&id={task_id}',
                headers={'Authorization': config['api_key']},
                timeout=10,
            )
            result_data = result_resp.json()
            
            if result_data.get('code') != 200:
                continue
            
            status = result_data['data'].get('status', 0)
            
            if status == 2:
                result_urls = result_data['data'].get('result', [])
                for i, url in enumerate(result_urls):
                    images.append({
                        'id': f'img_{int(time.time())}_{i}',
                        'url': url,
                        'b64_json': '',
                    })
                break
            elif status == 3:
                return {'success': False, 'error': f'生成失败: {result_data["data"].get("message", "未知错误")}'}
        
        if not images:
            return {'success': False, 'error': '生成超时'}
        
        cost = add_image_cost(model_key, model_config['price'], len(images))
        
        return {
            'success': True,
            'images': images,
            'model': model_key,
            'model_name': model_config['model_code'],
            'provider': 'suchuang',
            'cost': cost,
            'unit_price': model_config['price'],
            'count': len(images),
            'duration': round(time.time() - start_time, 1),
        }
    except requests.exceptions.RequestException as e:
        return {'success': False, 'error': f'速创生图失败: {str(e)}'}

def generate_image_seedream(prompt, size='1024x1024', n=1):
    """使用火山引擎即梦生图"""
    config = CONFIG['volcengine']
    headers = {
        'Authorization': f'Bearer {config["api_key"]}',
        'Content-Type': 'application/json',
    }
    
    body = {
        'model': 'doubao-seedream-4-0-250828',
        'prompt': prompt,
        'n': n,
        'size': size,
        'response_format': 'url',
    }
    
    try:
        response = requests.post(
            f'{config["base_url"]}/images/generations',
            headers=headers,
            json=body,
            timeout=120,
        )
        response.raise_for_status()
        data = response.json()
        
        images = []
        for i, item in enumerate(data.get('data', [])):
            images.append({
                'id': f'img_{int(time.time())}_{i}',
                'url': item.get('url', ''),
                'b64_json': item.get('b64_json', ''),
            })
        
        cost = add_image_cost('seedream', 0.08, len(images))
        
        return {
            'success': True,
            'images': images,
            'model': 'seedream',
            'model_name': 'seedream-4.0',
            'provider': 'volcengine',
            'cost': cost,
            'unit_price': 0.08,
            'count': len(images),
        }
    except requests.exceptions.RequestException as e:
        return {'success': False, 'error': f'即梦生图失败: {str(e)}'}

def parse_script_file(file_content, filename):
    """解析不同格式的剧本文件，返回纯文本"""
    ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else 'txt'
    
    try:
        if ext in ['txt', 'fountain', 'md', 'markdown']:
            # 纯文本类格式直接解码
            if isinstance(file_content, bytes):
                text = file_content.decode('utf-8', errors='replace')
            else:
                text = file_content
            return {'success': True, 'text': text, 'format': ext}
        
        elif ext == 'docx' and HAS_DOCX:
            # Word 文档
            doc = docx.Document(io.BytesIO(file_content))
            paragraphs = [p.text for p in doc.paragraphs]
            text = '\n'.join(paragraphs)
            return {'success': True, 'text': text, 'format': 'docx'}
        
        elif ext == 'pdf' and HAS_PDF:
            # PDF 文档
            text = ''
            with pdfplumber.open(io.BytesIO(file_content)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + '\n'
            return {'success': True, 'text': text.strip(), 'format': 'pdf'}
        
        else:
            # 不支持的格式，尝试当文本处理
            if isinstance(file_content, bytes):
                text = file_content.decode('utf-8', errors='replace')
            else:
                text = file_content
            return {'success': True, 'text': text, 'format': ext, 'warning': '格式不支持，已按纯文本尝试解析'}
    
    except Exception as e:
        return {'success': False, 'error': f'文件解析失败: {str(e)}'}


def generate_image_with_priority(prompt, priority_list, size='1K', aspect_ratio='1:1', n=1, reference_urls=None, model=None):
    # 如果指定了模型，直接使用该模型（覆盖优先级列表）
    if model:
        priority_list = [model]
    """按优先级尝试生图，失败自动降级"""
    errors = []
    
    for model_key in priority_list:
        if model_key == 'seedream':
            size_map = {'1K': '1024x1024', '2K': '2048x2048'}
            sd_size = size_map.get(size, '1024x1024')
            if aspect_ratio == '16:9':
                sd_size = '1024x576' if size == '1K' else '2048x1152'
            elif aspect_ratio == '9:16':
                sd_size = '576x1024' if size == '1K' else '1152x2048'
            
            result = generate_image_seedream(prompt, size=sd_size, n=n)
        else:
            result = generate_image_suchuang(
                prompt, 
                model_key=model_key, 
                size=size, 
                aspect_ratio=aspect_ratio,
                n=n,
                reference_urls=reference_urls
            )
        
        if result['success']:
            return result
        errors.append({'model': model_key, 'error': result.get('error', '未知错误')})
    
    return {'success': False, 'error': '所有生图模型均失败', 'errors': errors}

# ========== 风格智能匹配 ==========
def calculate_style_match_score(style_key, script_analysis, pipeline_data):
    """计算某个风格与剧本的匹配度分数"""
    style = STYLE_POOL.get(style_key)
    if not style:
        return 0
    
    score = 0
    style_tags = set(style['tags'])
    
    # 从剧本分析中提取关键词
    analysis_text = json.dumps(script_analysis, ensure_ascii=False) if isinstance(script_analysis, dict) else str(script_analysis)
    
    # 从pipeline数据中提取题材、基调、时代背景
    genre = pipeline_data.get('genre', '')
    tone = pipeline_data.get('tone', '')
    setting = pipeline_data.get('setting', '')
    
    # 关键词匹配
    analysis_keywords = set()
    for keyword in style_tags:
        if keyword in analysis_text or keyword in genre or keyword in tone or keyword in setting:
            analysis_keywords.add(keyword)
            score += 10
    
    # 根据题材推断赛道偏好
    track = style['track']
    genre_track_map = {
        '仙侠': ['chinese_style'],
        '武侠': ['chinese_style'],
        '古风': ['chinese_style'],
        '宫廷': ['chinese_style'],
        '玄幻': ['chinese_style', 'anime'],
        '科幻': ['live_action', '3d_animation'],
        '都市': ['live_action', 'anime'],
        '校园': ['anime'],
        '青春': ['anime', 'live_action'],
        '游戏': ['3d_animation', 'anime'],
        '动画': ['anime', '3d_animation'],
        '漫画': ['anime'],
    }
    
    for g, tracks in genre_track_map.items():
        if g in genre or g in setting:
            if track in tracks:
                score += 15
            break
    
    # 时代背景匹配
    era_keywords = {
        '古代': ['chinese_style'],
        '唐朝': ['chinese_style'],
        '盛唐': ['chinese_style'],
        '民国': ['live_action'],
        '现代': ['live_action', 'anime'],
        '未来': ['live_action', '3d_animation'],
        '90年代': ['live_action'],
        '八十年代': ['live_action'],
    }
    
    for era, tracks in era_keywords.items():
        if era in setting or era in analysis_text:
            if track in tracks:
                score += 10
            break
    
    # 情感基调匹配
    tone_style_map = {
        '冷峻': ['nolan_cold'],
        '严肃': ['nolan_cold', 'realistic_3d'],
        '压抑': ['nolan_cold', 'ink_wash'],
        '温馨': ['ghibli', 'wes_anderson', 'kyoani'],
        '治愈': ['ghibli', 'shinkai', 'kyoani'],
        '热血': ['cel_retro', 'realistic_3d', 'pixar_style'],
        '搞笑': ['wes_anderson', 'pixar_style'],
        '浪漫': ['shinkai', 'ghibli'],
        '黑暗': ['nolan_cold', 'hong_kong_90s'],
        '优雅': ['old_money', 'tang_dynasty'],
        '奢华': ['old_money', 'tang_dynasty'],
        '诗意': ['ink_wash', 'shinkai'],
        '禅意': ['ink_wash'],
        '江湖': ['ink_wash', 'hong_kong_90s'],
        '神话': ['dunhuang', 'pixar_style'],
    }
    
    for t, styles in tone_style_map.items():
        if t in tone or t in analysis_text:
            if style_key in styles:
                score += 12
            break
    
    return score

def select_diverse_styles(style_scores, num_select=3, min_score=5):
    """从高分风格中选出差异最大的N个（跨赛道优先）"""
    # 过滤掉分数过低的
    valid_scores = {k: v for k, v in style_scores.items() if v >= min_score}
    
    # 按分数降序排列
    sorted_styles = sorted(valid_scores.items(), key=lambda x: x[1], reverse=True)
    
    # 如果有效风格不够，降低阈值
    if len(sorted_styles) < num_select:
        sorted_styles = sorted(style_scores.items(), key=lambda x: x[1], reverse=True)
    
    # 取前10名作为候选池
    candidates = sorted_styles[:10]
    if not candidates:
        # 如果没有匹配，返回默认组合
        return ['nolan_cold', 'shinkai', 'pixar_style']
    
    selected = []
    used_tracks = set()
    
    # 优先从不同赛道选最高分
    for style_key, score in candidates:
        style = STYLE_POOL.get(style_key)
        if not style:
            continue
        track = style['track']
        if track not in used_tracks:
            selected.append(style_key)
            used_tracks.add(track)
            if len(selected) >= num_select:
                break
    
    # 如果还不够，从高分补充（同赛道也可以）
    if len(selected) < num_select:
        for style_key, score in candidates:
            if style_key not in selected:
                selected.append(style_key)
                if len(selected) >= num_select:
                    break
    
    return selected

def recommend_styles_for_script(script_analysis, pipeline_data, num_styles=3, excluded_styles=None):
    """根据剧本分析推荐风格
    excluded_styles: 需要排除的风格key列表（用于换一组）
    """
    if excluded_styles is None:
        excluded_styles = []
    
    # 计算所有风格的匹配分
    style_scores = {}
    for style_key in ALL_STYLE_KEYS:
        if style_key in excluded_styles:
            continue
        score = calculate_style_match_score(style_key, script_analysis, pipeline_data)
        style_scores[style_key] = score
    
    # 选择差异最大化的风格组合
    selected = select_diverse_styles(style_scores, num_styles)
    
    # 返回详细信息
    result = []
    for style_key in selected:
        style = STYLE_POOL[style_key]
        result.append({
            'key': style_key,
            'name': style['name'],
            'professional_name': style['professional_name'],
            'description': style['description'],
            'track': style['track'],
            'track_name': STYLE_TRACKS[style['track']]['name'],
            'color_palette': style['color_palette'],
            'reference': style['reference'],
            'match_score': style_scores.get(style_key, 0),
        })
    
    return result

# ========== 角色一致性链条 ==========
def generate_character_chain(character_data, num_variants=4, model=None, style=None):
    """生成角色一致性链条：先出多角度定妆照，返回最佳一张 + 所有变体
    style: 风格预设key（cinematic/anime/vintage），或自定义风格后缀字符串
    """
    keywords = character_data.get('promptKeywords', [])
    if not keywords:
        appearance = character_data.get('appearance', {})
        costume = character_data.get('costume', {})
        keywords = [
            appearance.get('face', ''),
            appearance.get('hair', ''),
            costume.get('mainOutfit', ''),
        ]
        keywords = [k for k in keywords if k]
    
    base_prompt = ', '.join(keywords) if isinstance(keywords, list) else keywords
    
    # 处理风格后缀
    style_suffix = ''
    style_name = 'default'
    if style:
        if style in STYLE_PRESETS:
            style_suffix = STYLE_PRESETS[style]['character_suffix']
            style_name = STYLE_PRESETS[style]['name']
        else:
            style_suffix = style
            style_name = 'custom'
    
    angle_variants = [
        'front view, full body portrait, standing straight',
        'side view, profile portrait, full body',
        'three quarter view, upper body portrait',
        'close-up portrait, detailed face',
    ]
    
    variants_to_generate = min(num_variants, len(angle_variants))
    
    all_images = []
    total_cost = 0
    used_model = None
    errors = []
    reference_urls = None
    
    for i in range(variants_to_generate):
        angle_prompt = f'{base_prompt}, {angle_variants[i]}'
        if style_suffix:
            angle_prompt = f'{angle_prompt}, {style_suffix}'
        else:
            angle_prompt = f'{angle_prompt}, detailed, high quality, photorealistic'
        
        result = generate_image_with_priority(
            angle_prompt,
            CHARACTER_IMAGE_PRIORITY,
            size='2K',
            aspect_ratio='2:3',
            n=1,
            reference_urls=reference_urls,
            model=model
        )
        
        if result['success']:
            all_images.extend(result['images'])
            total_cost += result['cost']
            used_model = result['model']
            if reference_urls is None and result['images']:
                reference_urls = [result['images'][0]['url']]
        else:
            errors.append(result.get('error', '生成失败'))
    
    if not all_images:
        return {
            'success': False,
            'error': '角色一致性链条生成失败',
            'errors': errors,
        }
    
    return {
        'success': True,
        'primary_image': all_images[0],
        'all_variants': all_images,
        'variant_count': len(all_images),
        'model': used_model,
        'total_cost': round(total_cost, 2),
        'unit_price': SUCHUANG_MODELS.get(used_model, {}).get('price', 0.3),
        'breakdown': {
            'generated_count': len(all_images),
            'unit_price': SUCHUANG_MODELS.get(used_model, {}).get('price', 0.3),
            'total': round(total_cost, 2),
        },
        'character_info': {
            'name': character_data.get('basicInfo', {}).get('name', '未知角色'),
            'visualDNA': character_data.get('visualDNA', []),
        },
        'style': style_name,
        'style_key': style,
    }

# ========== 场景一致性链条 ==========
def generate_scene_chain(scene_data, num_variants=3, model=None, style=None):
    """生成场景一致性链条：同一场景的不同角度/光线/时间"""
    keywords = scene_data.get('referenceKeywords', [])
    if not keywords:
        desc = scene_data.get('visualStyle', '')
        keywords = [desc] if desc else ['scene']
    
    base_prompt = ', '.join(keywords) if isinstance(keywords, list) else keywords
    
    # 处理风格后缀
    style_suffix = ''
    style_name = 'default'
    if style:
        if style in STYLE_PRESETS:
            style_suffix = STYLE_PRESETS[style]['scene_suffix']
            style_name = STYLE_PRESETS[style]['name']
        else:
            style_suffix = style
            style_name = 'custom'
    
    scene_variants = [
        'wide shot, establishing shot, full scene',
        'medium shot, eye level view, detailed environment',
        'close-up, detailed texture',
    ]
    
    variants_to_generate = min(num_variants, len(scene_variants))
    
    all_images = []
    total_cost = 0
    used_model = None
    errors = []
    reference_urls = None
    
    for i in range(variants_to_generate):
        scene_prompt = f'{base_prompt}, {scene_variants[i]}'
        if style_suffix:
            scene_prompt = f'{scene_prompt}, {style_suffix}'
        else:
            scene_prompt = f'{scene_prompt}, cinematic lighting, highly detailed, movie still'
        
        result = generate_image_with_priority(
            scene_prompt,
            SCENE_IMAGE_PRIORITY,
            size='2K',
            aspect_ratio='16:9',
            n=1,
            reference_urls=reference_urls,
            model=model
        )
        
        if result['success']:
            all_images.extend(result['images'])
            total_cost += result['cost']
            used_model = result['model']
            if reference_urls is None and result['images']:
                reference_urls = [result['images'][0]['url']]
        else:
            errors.append(result.get('error', '生成失败'))
    
    if not all_images:
        return {
            'success': False,
            'error': '场景一致性链条生成失败',
            'errors': errors,
        }
    
    unit_price = 0.1
    if used_model == 'seedream':
        unit_price = 0.08
    elif used_model in SUCHUANG_MODELS:
        unit_price = SUCHUANG_MODELS[used_model]['price']
    
    return {
        'success': True,
        'primary_image': all_images[0],
        'all_variants': all_images,
        'variant_count': len(all_images),
        'model': used_model,
        'total_cost': round(total_cost, 2),
        'unit_price': unit_price,
        'breakdown': {
            'generated_count': len(all_images),
            'unit_price': unit_price,
            'total': round(total_cost, 2),
        },
        'scene_info': {
            'style': scene_data.get('visualStyle', ''),
            'color_palette': scene_data.get('colorPalette', {}),
        },
        'style': style_name,
        'style_key': style,
    }

# ========== 分镜生图 ==========
def generate_storyboard_images(shots, character_reference_urls=None, scene_reference_urls=None, model=None):
    """批量生成分镜图，复用角色和场景参考图保持一致性"""
    results = []
    total_cost = 0
    
    for shot in shots:
        description = shot.get('description', '')
        shot_type = shot.get('shotType', '')
        movement = shot.get('movement', '')
        
        prompt = f'{description}, {shot_type}, {movement}, cinematic, movie still'
        
        # 合并角色和场景参考图
        reference_urls = []
        if character_reference_urls:
            reference_urls.extend(character_reference_urls)
        if scene_reference_urls:
            reference_urls.extend(scene_reference_urls)
        
        if not reference_urls:
            reference_urls = None
        
        result = generate_image_with_priority(
            prompt,
            SCENE_IMAGE_PRIORITY,
            size='2K',
            aspect_ratio='16:9',
            n=1,
            reference_urls=reference_urls,
            model=model
        )
        
        if result['success']:
            results.append({
                'shotNumber': shot.get('shotNumber'),
                'image': result['images'][0] if result['images'] else None,
                'cost': result['cost'],
                'model': result['model'],
            })
            total_cost += result['cost']
        else:
            results.append({
                'shotNumber': shot.get('shotNumber'),
                'image': None,
                'error': result.get('error', '生成失败'),
            })
    
    return {
        'success': True,
        'shots': results,
        'total_cost': round(total_cost, 2),
        'success_count': sum(1 for r in results if r.get('image')),
        'total_count': len(results),
    }

# ========== 异步任务管理 ==========
def create_async_task(task_type, params):
    task_id = f'task_{uuid.uuid4().hex[:12]}'
    
    with task_lock:
        image_tasks[task_id] = {
            'taskId': task_id,
            'type': task_type,
            'status': 'pending',
            'progress': 0,
            'params': params,
            'result': None,
            'error': None,
            'createdAt': time.time(),
        }
    
    thread = threading.Thread(target=execute_async_task, args=(task_id,))
    thread.daemon = True
    thread.start()
    
    return task_id

def execute_async_task(task_id):
    task = image_tasks.get(task_id)
    if not task:
        return
    
    task['status'] = 'processing'
    task['startedAt'] = time.time()
    
    try:
        task_type = task['type']
        params = task['params']
        
        if task_type == 'image_generate':
            result = generate_image_with_priority(
                params.get('prompt', ''),
                params.get('priority', ['sc_gpt', 'sc_nb2', 'seedream']),
                size=params.get('size', '1K'),
                aspect_ratio=params.get('aspect_ratio', '1:1'),
                n=params.get('n', 1),
                reference_urls=params.get('reference_urls'),
            )
            task['progress'] = 100
            task['result'] = result
            task['status'] = 'completed' if result.get('success') else 'failed'
            if not result.get('success'):
                task['error'] = result.get('error', '生成失败')
        
        elif task_type == 'character_chain':
            char_data = params.get('character_data', {})
            num_variants = params.get('num_variants', 4)
            model = params.get('model', None)
            style = params.get('style', None)
            task['progress'] = 10
            result = generate_character_chain(char_data, num_variants, model=model, style=style)
            task['progress'] = 100
            task['result'] = result
            task['status'] = 'completed' if result.get('success') else 'failed'
            if not result.get('success'):
                task['error'] = result.get('error', '生成失败')
        
        elif task_type == 'scene_chain':
            scene_data = params.get('scene_data', {})
            num_variants = params.get('num_variants', 3)
            model = params.get('model', None)
            style = params.get('style', None)
            task['progress'] = 10
            result = generate_scene_chain(scene_data, num_variants, model=model, style=style)
            task['progress'] = 100
            task['result'] = result
            task['status'] = 'completed' if result.get('success') else 'failed'
            if not result.get('success'):
                task['error'] = result.get('error', '生成失败')
        
        elif task_type == 'storyboard_generate':
            shots = params.get('shots', [])
            char_refs = params.get('character_reference_urls')
            scene_refs = params.get('scene_reference_urls')
            model = params.get('model', None)
            task['progress'] = 5
            
            # 逐张生成，更新进度
            total = len(shots)
            completed = []
            for i, shot in enumerate(shots):
                result = generate_storyboard_images([shot], char_refs, scene_refs, model=model)
                if result.get('success') and result['shots']:
                    completed.extend(result['shots'])
                task['progress'] = int((i + 1) / total * 100)
            
            task['progress'] = 100
            task['result'] = {
                'success': True,
                'shots': completed,
                'total_cost': round(sum(s.get('cost', 0) for s in completed), 2),
                'success_count': len(completed),
                'total_count': total,
            }
            task['status'] = 'completed'
        
        elif task_type == 'director_pipeline':
            # 五导演分析流水线
            script = params.get('script', '')
            directors = params.get('directors', None)
            tier = params.get('tier', 'full')
            task['progress'] = 5
            task['tier'] = tier
            
            result = run_director_pipeline_with_progress(script, task, directors=directors)
            task['progress'] = 100
            task['result'] = result
            task['status'] = 'completed' if result.get('success') else 'failed'
            if not result.get('success'):
                task['error'] = result.get('error', '分析失败')
        
        elif task_type == 'full_pipeline':
            # 完整流水线：根据 tier 参数执行不同档位
            # standard: 仅五导演文字分析
            # pro: 五导演 + 角色链 + 场景链 + 分镜生图
            # flagship: 五导演 + 3种风格角色链 + 3种风格场景链（无分镜）
            script = params.get('script', '')
            tier = params.get('tier', 'pro')
            character_model = params.get('characterModel', None)
            scene_model = params.get('sceneModel', None)
            
            task['progress'] = 5
            task['tier'] = tier
            
            # 1. 五导演分析（所有档位都有）
            pipeline_result = run_director_pipeline(script)
            task['progress'] = 30
            
            if not pipeline_result.get('success'):
                task['status'] = 'failed'
                task['error'] = '五导演分析失败'
                return
            
            results = pipeline_result.get('results', {})
            total_cost = pipeline_result.get('totalCost', 0)
            
            # 标准档：只有文字分析
            if tier == 'standard':
                task['progress'] = 100
                task['result'] = {
                    'success': True,
                    'tier': 'standard',
                    'pipeline': pipeline_result,
                    'total_cost': round(total_cost, 2),
                }
                task['status'] = 'completed'
                return
            
            kappa_data = results.get('kappa', {}).get('data', {}).get('content', {})
            beta_data = results.get('beta', {}).get('data', {}).get('content', {})
            
            # 专业档：1种风格角色链 + 1种风格场景链 + 分镜生图
            if tier == 'pro':
                # 角色链
                char_chain_result = generate_character_chain(
                    kappa_data, num_variants=4, model=character_model, style='cinematic'
                )
                task['progress'] = 55
                if char_chain_result.get('success'):
                    total_cost += char_chain_result.get('total_cost', 0)
                
                # 场景链
                scene_chain_result = generate_scene_chain(
                    beta_data, num_variants=3, model=scene_model, style='cinematic'
                )
                task['progress'] = 75
                if scene_chain_result.get('success'):
                    total_cost += scene_chain_result.get('total_cost', 0)
                
                # 分镜生图
                gamma_data = results.get('gamma', {}).get('data', {}).get('content', {})
                shots = gamma_data.get('shots', [])[:6]
                
                char_refs = None
                scene_refs = None
                if char_chain_result.get('success'):
                    char_refs = [img['url'] for img in char_chain_result['all_variants'][:2]]
                if scene_chain_result.get('success'):
                    scene_refs = [img['url'] for img in scene_chain_result['all_variants'][:1]]
                
                storyboard_result = generate_storyboard_images(shots, char_refs, scene_refs, model=scene_model)
                total_cost += storyboard_result.get('total_cost', 0)
                task['progress'] = 100
                
                task['result'] = {
                    'success': True,
                    'tier': 'pro',
                    'pipeline': pipeline_result,
                    'character_chain': char_chain_result,
                    'scene_chain': scene_chain_result,
                    'storyboard': storyboard_result,
                    'total_cost': round(total_cost, 2),
                }
                task['status'] = 'completed'
                return
            
            # 旗舰档：3种风格角色链 + 3种风格场景链（无分镜）
            if tier == 'flagship':
                # 支持用户指定风格，或智能匹配
                custom_style_keys = params.get('style_keys', [])
                custom_style_suffixes = params.get('custom_styles', {})  # {style_key: suffix}
                
                if custom_style_keys and len(custom_style_keys) > 0:
                    style_keys = custom_style_keys
                else:
                    # 智能匹配：根据剧本分析推荐风格
                    pipeline_data = pipeline_result.get('data', {}) if pipeline_result.get('success') else {}
                    script_analysis = params.get('script_content', '')
                    recommended = recommend_styles_for_script(script_analysis, pipeline_data, num_styles=3)
                    style_keys = [s['key'] for s in recommended]
                
                # 确保风格数量不超过3个（成本控制）
                style_keys = style_keys[:3]
                
                character_chains = {}
                scene_chains = {}
                style_details = {}
                
                # 生成多种风格角色链
                for idx, style_key in enumerate(style_keys):
                    # 检查是否为自定义风格
                    if style_key in custom_style_suffixes:
                        style_param = custom_style_suffixes[style_key]
                        style_name = style_key
                        style_pro_name = '自定义风格'
                    else:
                        style_param = style_key
                        style_info = STYLE_POOL.get(style_key, {})
                        style_name = style_info.get('name', style_key)
                        style_pro_name = style_info.get('professional_name', '')
                    
                    char_result = generate_character_chain(
                        kappa_data, num_variants=3, model=character_model, style=style_param
                    )
                    character_chains[style_key] = char_result
                    style_details[style_key] = {
                        'name': style_name,
                        'professional_name': style_pro_name,
                        'track': STYLE_POOL.get(style_key, {}).get('track', 'custom'),
                        'track_name': STYLE_TRACKS.get(STYLE_POOL.get(style_key, {}).get('track', ''), {}).get('name', '自定义'),
                    }
                    if char_result.get('success'):
                        total_cost += char_result.get('total_cost', 0)
                    task['progress'] = 35 + (idx + 1) * 15  # 50, 65, 80
                
                # 生成多种风格场景链
                for idx, style_key in enumerate(style_keys):
                    if style_key in custom_style_suffixes:
                        style_param = custom_style_suffixes[style_key]
                    else:
                        style_param = style_key
                    
                    scene_result = generate_scene_chain(
                        beta_data, num_variants=3, model=scene_model, style=style_param
                    )
                    scene_chains[style_key] = scene_result
                    if scene_result.get('success'):
                        total_cost += scene_result.get('total_cost', 0)
                    task['progress'] = 80 + (idx + 1) * 6  # 86, 92, 98
                
                task['progress'] = 100
                task['result'] = {
                    'success': True,
                    'tier': 'flagship',
                    'pipeline': pipeline_result,
                    'character_chains': character_chains,
                    'scene_chains': scene_chains,
                    'styles': style_keys,
                    'style_details': style_details,
                    'total_cost': round(total_cost, 2),
                }
                task['status'] = 'completed'
                return
            
            # 默认回退到 pro 档逻辑
            task['status'] = 'failed'
            task['error'] = f'未知档位: {tier}'
        
        else:
            task['status'] = 'failed'
            task['error'] = f'未知任务类型: {task_type}'
    
    except Exception as e:
        task['status'] = 'failed'
        task['error'] = str(e)
    
    task['completedAt'] = time.time()

def get_task_status(task_id):
    with task_lock:
        task = image_tasks.get(task_id)
        if not task:
            return {'success': False, 'error': '任务不存在'}
        
        if task['status'] == 'processing':
            elapsed = time.time() - task.get('startedAt', time.time())
            progress = task.get('progress', 0)
            if progress > 0:
                total_estimate = elapsed / progress * 100
                remaining = total_estimate - elapsed
            else:
                remaining = 60
            task['estimatedRemaining'] = round(remaining, 1)
        
        return {
            'success': True,
            'data': {
                'taskId': task['taskId'],
                'type': task['type'],
                'status': task['status'],
                'progress': task.get('progress', 0),
                'currentDirector': task.get('currentDirector'),
                'result': task.get('result'),
                'error': task.get('error'),
                'createdAt': task.get('createdAt'),
                'completedAt': task.get('completedAt'),
                'estimatedRemaining': task.get('estimatedRemaining'),
            }
        }

# ========== HTTP 处理器 ==========
class DirectorStudioHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)
    
    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        
        if path.startswith('/api/'):
            self.handle_api('GET', path, parsed)
            return
        
        super().do_GET()
    
    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        
        if path.startswith('/api/'):
            # 文件上传走特殊处理
            if path == '/api/script/upload':
                self.handle_script_upload()
                return
            
            # 普通 JSON 请求
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
        if path == '/api/health':
            self.json_response({
                'status': 'ok',
                'timestamp': datetime.now().isoformat(),
                'version': '2.1.0-chain',
            })
            return
        
        if path.startswith('/api/directors/'):
            self.handle_directors_api(method, path, body)
            return
        
        if path.startswith('/api/image/'):
            self.handle_image_api(method, path, body)
            return
        
        if path.startswith('/api/media/'):
            self.handle_media_api(method, path, body)
            return
        
        if path.startswith('/api/monitor'):
            self.handle_monitor_api(method, path, body)
            return
        
        if path.startswith('/api/style/'):
            self.handle_style_api(method, path, body)
            return
        
        if path.startswith('/api/projects'):
            self.handle_project_api(method, path, body)
            return
        
        if path.startswith('/api/share'):
            self.handle_share_api(method, path, body)
            return
        
        self.send_error(404)
    
    def handle_directors_api(self, method, path, body):
        if path == '/api/directors/analyze' or path == '/api/directors/pipeline':
            script = body.get('script', '') if body else ''
            if not script:
                self.json_response({'success': False, 'error': '缺少script参数'})
                return
            
            # 档位映射到导演列表
            tier = body.get('tier', 'full') if body else 'full'
            tier_directors = {
                'standard': ['alpha', 'beta'],           # 标准版：剧本分析 + 视觉设计
                'pro': ['alpha', 'beta', 'gamma', 'kappa'],  # 深入版：加角色 + 分镜
                'full': None,                              # 完整版：全部5导演
                'flagship': None,                          # 旗舰版：全部 + 风格池
            }
            directors = tier_directors.get(tier, None)
            
            # 也支持直接指定导演列表
            if body and body.get('directors'):
                directors = body['directors']
            
            # 支持异步模式
            use_async = body.get('async', False) if body else False
            if use_async:
                task_id = create_async_task('director_pipeline', {
                    'script': script,
                    'directors': directors,
                    'tier': tier,
                })
                self.json_response({'success': True, 'taskId': task_id, 'tier': tier})
                return
            
            result = run_director_pipeline(script, directors=directors)
            self.json_response(result)
            return
        
        if path == '/api/directors/alpha':
            script = body.get('script', '') if body else ''
            result = alpha_analyze_script(script)
            self.json_response(result)
            return
        
        if path == '/api/directors/beta':
            scene = body.get('sceneDescription', '') if body else ''
            result = beta_design_visual(scene)
            self.json_response(result)
            return
        
        if path == '/api/directors/gamma':
            scene_content = body.get('sceneContent', '') if body else ''
            options = body.get('options', {}) if body else {}
            shot_count = int(options.get('shotCount', 6))
            result = gamma_generate_storyboard(scene_content, shot_count)
            self.json_response(result)
            return
        
        if path == '/api/directors/kappa':
            char_desc = body.get('characterDescription', '') if body else ''
            result = kappa_design_character(char_desc)
            self.json_response(result)
            return
        
        if path == '/api/directors/epsilon':
            project_data = body or {}
            result = epsilon_create_schedule(project_data)
            self.json_response(result)
            return
        
        self.send_error(404)
    
    def handle_image_api(self, method, path, body):
        if path == '/api/image/generate':
            prompt = body.get('prompt', '') if body else ''
            image_type = body.get('type', 'scene')
            size = body.get('size', '1K')
            aspect_ratio = body.get('aspect_ratio', '1:1')
            n = int(body.get('n', 1))
            reference_urls = body.get('reference_urls', None)
            
            if not prompt:
                self.json_response({'success': False, 'error': '缺少prompt参数'})
                return
            
            if image_type == 'character':
                priority = CHARACTER_IMAGE_PRIORITY
            else:
                priority = SCENE_IMAGE_PRIORITY
            
            params = {
                'prompt': prompt,
                'priority': priority,
                'size': size,
                'aspect_ratio': aspect_ratio,
                'n': n,
                'reference_urls': reference_urls,
                'type': image_type,
            }
            
            task_id = create_async_task('image_generate', params)
            
            self.json_response({
                'success': True,
                'taskId': task_id,
                'status': 'pending',
                'message': '任务已提交，正在排队处理',
            })
            return
        
        if path == '/api/image/character-chain':
            character_data = body.get('characterData', {}) if body else {}
            num_variants = int(body.get('numVariants', 4)) if body else 4
            model = body.get('model') if body else None
            
            # 兼容 name + description 的简单格式
            if not character_data:
                name = body.get('name', '') if body else ''
                description = body.get('description', '') if body else ''
                if name or description:
                    character_data = {
                        'name': name,
                        'description': description,
                        'appearance': {
                            'face': description,
                            'hair': '',
                        },
                        'costume': {
                            'mainOutfit': '',
                        },
                        'promptKeywords': [name, description] if name and description else [name or description],
                    }
            
            if not character_data:
                self.json_response({'success': False, 'error': '缺少角色信息参数'})
                return
            
            # 模型名称映射
            if model and model in MODEL_NAME_MAP:
                model = MODEL_NAME_MAP[model]
            
            params = {
                'character_data': character_data,
                'num_variants': num_variants,
                'model': model,
            }
            
            task_id = create_async_task('character_chain', params)
            
            self.json_response({
                'success': True,
                'taskId': task_id,
                'status': 'pending',
                'message': '角色一致性链条任务已提交',
                'estimatedTime': f'约{num_variants * 50}秒',
            })
            return
        
        if path == '/api/image/scene-chain':
            scene_data = body.get('sceneData', {}) if body else {}
            num_variants = int(body.get('numVariants', 3)) if body else 3
            model = body.get('model') if body else None
            
            # 兼容 location + description 的简单格式
            if not scene_data:
                location = body.get('location', '') if body else ''
                description = body.get('description', '') if body else ''
                if location or description:
                    scene_data = {
                        'location': location,
                        'description': description,
                        'atmosphere': description,
                        'promptKeywords': [location, description] if location and description else [location or description],
                    }
            
            if not scene_data:
                self.json_response({'success': False, 'error': '缺少场景信息参数'})
                return
            
            # 模型名称映射
            if model and model in MODEL_NAME_MAP:
                model = MODEL_NAME_MAP[model]
            
            params = {
                'scene_data': scene_data,
                'num_variants': num_variants,
                'model': model,
            }
            
            task_id = create_async_task('scene_chain', params)
            
            self.json_response({
                'success': True,
                'taskId': task_id,
                'status': 'pending',
                'message': '场景一致性链条任务已提交',
                'estimatedTime': f'约{num_variants * 50}秒',
            })
            return
        
        if path == '/api/image/storyboard':
            shots = body.get('shots', []) if body else []
            character_refs = body.get('characterReferenceUrls')
            scene_refs = body.get('sceneReferenceUrls')
            model = body.get('model') if body else None
            
            if not shots:
                self.json_response({'success': False, 'error': '缺少shots参数'})
                return
            
            # 模型名称映射
            if model and model in MODEL_NAME_MAP:
                model = MODEL_NAME_MAP[model]
            
            params = {
                'shots': shots,
                'character_reference_urls': character_refs,
                'scene_reference_urls': scene_refs,
                'model': model,
            }
            
            task_id = create_async_task('storyboard_generate', params)
            
            self.json_response({
                'success': True,
                'taskId': task_id,
                'status': 'pending',
                'message': '分镜生图任务已提交',
                'estimatedTime': f'约{len(shots) * 50}秒',
            })
            return
        
        # 完整一键流水线
        if path == '/api/image/full-pipeline':
            script = body.get('script', '') if body else ''
            if not script:
                self.json_response({'success': False, 'error': '缺少script参数'})
                return
            
            tier = body.get('tier', 'pro')
            character_model = body.get('characterModel', None)
            scene_model = body.get('sceneModel', None)
            
            params = {
                'script': script,
                'tier': tier,
                'characterModel': character_model,
                'sceneModel': scene_model,
            }
            task_id = create_async_task('full_pipeline', params)
            
            # 根据档位返回不同描述
            if tier == 'standard':
                msg = '五导演分析任务已提交'
                eta = '约1-2分钟'
            elif tier == 'flagship':
                msg = '旗舰档风格探索任务已提交，包含五导演分析+3种风格角色链+3种风格场景链'
                eta = '约5-8分钟'
            else:
                msg = '专业档任务已提交，包含五导演分析+角色链+场景链+分镜生图'
                eta = '约3-5分钟'
            
            self.json_response({
                'success': True,
                'taskId': task_id,
                'status': 'pending',
                'message': msg,
                'estimatedTime': eta,
            })
            return
        
        if path.startswith('/api/image/status/'):
            task_id = path.split('/')[-1]
            status = get_task_status(task_id)
            self.json_response(status)
            return
        
        if path == '/api/image/models':
            self.json_response({
                'success': True,
                'data': {
                    'character': {
                        'primary': {'key': 'sc_nbPro', 'name': 'NanoBanana Pro', 'price': 0.3},
                        'backup': [
                            {'key': 'sc_nb2', 'name': 'NanoBanana 2', 'price': 0.1},
                        ],
                        'description': '角色生图使用NB Pro确保一致性，支持最多14张参考图',
                    },
                    'scene': {
                        'primary': {'key': 'sc_gpt', 'name': 'GPT-Image-2', 'price': 0.1},
                        'backup': [
                            {'key': 'sc_nb2', 'name': 'NanoBanana 2', 'price': 0.1},
                            {'key': 'seedream', 'name': '即梦 5.0', 'price': 0.08},
                        ],
                        'description': '场景生图优先使用GPT-Image-2确保画面质量',
                    },
                }
            })
            return
        
        self.send_error(404)
    
    def handle_style_api(self, method, path, body):
        # 风格赛道列表
        if path == '/api/style/tracks':
            self.json_response({
                'success': True,
                'data': {
                    track: {
                        'name': info['name'],
                        'description': info['description'],
                        'icon': info['icon'],
                        'styles': TRACK_STYLES[track],
                    }
                    for track, info in STYLE_TRACKS.items()
                }
            })
            return
        
        # 风格池（支持按赛道筛选）
        if path == '/api/style/pool':
            query = parse_qs(urlparse(self.path).query)
            track_filter = query.get('track', [None])[0]
            
            filtered_styles = {}
            for key, style in STYLE_POOL.items():
                if track_filter and style['track'] != track_filter:
                    continue
                filtered_styles[key] = {
                    'name': style['name'],
                    'professional_name': style['professional_name'],
                    'description': style['description'],
                    'track': style['track'],
                    'track_name': STYLE_TRACKS[style['track']]['name'],
                    'tags': style['tags'],
                    'color_palette': style['color_palette'],
                    'reference': style['reference'],
                }
            
            self.json_response({
                'success': True,
                'data': filtered_styles,
                'total': len(filtered_styles),
            })
            return
        
        # 风格推荐（根据剧本智能匹配）
        if path == '/api/style/recommend':
            script_content = body.get('script_content', '') if body else ''
            pipeline_data = body.get('pipeline_data', {}) if body else {}
            num_styles = body.get('num', 3) if body else 3
            excluded = body.get('excluded', []) if body else []
            
            recommended = recommend_styles_for_script(
                script_content, pipeline_data, 
                num_styles=num_styles, 
                excluded_styles=excluded
            )
            
            self.json_response({
                'success': True,
                'data': recommended,
            })
            return
        
        self.send_error(404)
    
    def handle_media_api(self, method, path, body):
        if path == '/api/media/process':
            action = body.get('action', '') if body else ''
            video_url = body.get('videoUrl', '') if body else ''
            
            task_id = 'media_' + uuid.uuid4().hex[:8]
            image_tasks[task_id] = {
                'taskId': task_id,
                'action': action,
                'videoUrl': video_url,
                'status': 'processing',
                'progress': 0,
                'estimatedTime': '30秒',
            }
            
            self.json_response({
                'success': True,
                'data': image_tasks[task_id],
            })
            return
        
        if path.startswith('/api/media/task/'):
            task_id = path.split('/')[-1]
            task = image_tasks.get(task_id, {'taskId': task_id, 'status': 'not_found'})
            self.json_response({'success': True, 'data': task})
            return
        
        self.send_error(404)
    
    def handle_script_upload(self):
        """处理剧本文件上传，支持 .txt/.docx/.pdf/.fountain/.md"""
        content_type = self.headers.get('Content-Type', '')
        
        if 'multipart/form-data' not in content_type:
            self.json_response({'success': False, 'error': '请使用 multipart/form-data 格式上传文件'})
            return
        
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            
            # 用 email 模块解析 multipart
            msg = message_from_bytes(
                b'Content-Type: ' + content_type.encode() + b'\r\n\r\n' + body,
                policy=default
            )
            
            file_content = None
            filename = None
            
            for part in msg.iter_parts():
                disposition = part.get('Content-Disposition', '')
                if 'form-data' in disposition:
                    name = part.get_param('name', header='Content-Disposition')
                    if name == 'file':
                        filename = part.get_filename()
                        file_content = part.get_payload(decode=True)
                        break
            
            if not file_content or not filename:
                self.json_response({'success': False, 'error': '未找到上传的文件'})
                return
            
            # 解析文件内容
            result = parse_script_file(file_content, filename)
            
            if result['success']:
                response = {
                    'success': True,
                    'data': {
                        'filename': filename,
                        'format': result['format'],
                        'content': result['text'],
                        'char_count': len(result['text']),
                        'word_count': len(result['text'].split()),
                    }
                }
                if 'warning' in result:
                    response['data']['warning'] = result['warning']
                self.json_response(response)
            else:
                self.json_response({'success': False, 'error': result['error']})
            
        except Exception as e:
            self.json_response({'success': False, 'error': f'上传处理失败: {str(e)}'})
    
    def handle_monitor_api(self, method, path, body):
        if path == '/api/monitor' or path == '/api/monitor/':
            uptime_seconds = int(time.time() - COST_STATS['start_time'])
            hours = uptime_seconds // 3600
            minutes = (uptime_seconds % 3600) // 60
            
            self.json_response({
                'success': True,
                'data': {
                    'health': {
                        'status': 'ok',
                        'uptime': f'{hours}小时{minutes}分',
                        'version': '2.1.0-chain',
                    },
                    'errors': {
                        'total': 0,
                        'today': 0,
                    },
                    'apiStats': {
                        'totalCalls': COST_STATS['calls_today'],
                        'todayCalls': COST_STATS['calls_today'],
                    },
                    'costStats': {
                        'todayCost': round(COST_STATS['today'], 2),
                        'totalCost': round(COST_STATS['total'], 2),
                        'byModel': {k: round(v, 2) for k, v in COST_STATS['by_model'].items()},
                    },
                }
            })
            return
        
        if path == '/api/monitor/cost':
            self.json_response({
                'success': True,
                'data': {
                    'today': round(COST_STATS['today'], 2),
                    'total': round(COST_STATS['total'], 2),
                    'byModel': {k: round(v, 2) for k, v in COST_STATS['by_model'].items()},
                }
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
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_PUT(self):
        parsed = urlparse(self.path)
        path = parsed.path
        
        if path.startswith('/api/'):
            content_length = int(self.headers.get('Content-Length', 0))
            body = {}
            if content_length > 0:
                try:
                    body = json.loads(self.rfile.read(content_length))
                except:
                    pass
            
            self.handle_api('PUT', path, parsed, body)
            return
        
        self.send_error(405)
    
    def do_DELETE(self):
        parsed = urlparse(self.path)
        path = parsed.path
        
        if path.startswith('/api/'):
            self.handle_api('DELETE', path, parsed)
            return
        
        self.send_error(405)
    
    def send_error(self, code, message=None):
        if code == 404 and not self.path.startswith('/api/'):
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
        pass


# ========== 项目管理 API ==========
        def handle_project_api(self, method, path, body=None):
            path_parts = [p for p in path.split('/') if p]

            if method == 'GET' and len(path_parts) == 2:
                # GET /api/projects - 项目列表
                projects = list_projects()
                self.json_response({'success': True, 'projects': projects})
                return

            if method == 'POST' and len(path_parts) == 2:
                # POST /api/projects - 新建项目
                name = body.get('name', '未命名项目')
                description = body.get('description', '')
                project = create_project(name, description)
                self.json_response({'success': True, 'project': project})
                return

            if method == 'GET' and len(path_parts) == 3:
                # GET /api/projects/{id} - 项目详情
                project_id = path_parts[2]
                project = get_project(project_id)
                if project:
                    self.json_response({'success': True, 'project': project})
                else:
                    self.json_response({'success': False, 'error': '项目不存在'}, 404)
                return

            if method == 'PUT' and len(path_parts) == 3:
                # PUT /api/projects/{id} - 更新项目
                project_id = path_parts[2]
                project = update_project(project_id, **(body or {}))
                if project:
                    self.json_response({'success': True, 'project': project})
                else:
                    self.json_response({'success': False, 'error': '项目不存在'}, 404)
                return

            if method == 'DELETE' and len(path_parts) == 3:
                # DELETE /api/projects/{id} - 删除项目
                project_id = path_parts[2]
                if delete_project(project_id):
                    self.json_response({'success': True})
                else:
                    self.json_response({'success': False, 'error': '项目不存在'}, 404)
                return

            # 分集相关
            if len(path_parts) >= 4 and path_parts[3] == 'episodes':
                project_id = path_parts[2]

                if method == 'GET' and len(path_parts) == 4:
                    # GET /api/projects/{id}/episodes - 分集列表
                    episodes = list_episodes(project_id)
                    self.json_response({'success': True, 'episodes': episodes})
                    return

                if method == 'POST' and len(path_parts) == 4:
                    # POST /api/projects/{id}/episodes - 新建分集
                    title = body.get('title', f'第{len(list_episodes(project_id)) + 1}集')
                    episode_number = body.get('episode_number')
                    episode = create_episode(project_id, title, episode_number)
                    self.json_response({'success': True, 'episode': episode})
                    return

                if method == 'GET' and len(path_parts) == 5:
                    # GET /api/projects/{id}/episodes/{ep_id} - 分集详情
                    ep_id = path_parts[4]
                    episode = get_episode(project_id, ep_id)
                    if episode:
                        self.json_response({'success': True, 'episode': episode})
                    else:
                        self.json_response({'success': False, 'error': '分集不存在'}, 404)
                    return

                if method == 'PUT' and len(path_parts) == 5:
                    # PUT /api/projects/{id}/episodes/{ep_id} - 更新分集
                    ep_id = path_parts[4]
                    episode = update_episode(project_id, ep_id, **(body or {}))
                    if episode:
                        self.json_response({'success': True, 'episode': episode})
                    else:
                        self.json_response({'success': False, 'error': '分集不存在'}, 404)
                    return

                if method == 'DELETE' and len(path_parts) == 5:
                    # DELETE /api/projects/{id}/episodes/{ep_id} - 删除分集
                    ep_id = path_parts[4]
                    if delete_episode(project_id, ep_id):
                        self.json_response({'success': True})
                    else:
                        self.json_response({'success': False, 'error': '分集不存在'}, 404)
                    return

                if method == 'POST' and len(path_parts) == 6 and path_parts[5] == 'split':
                    # POST /api/projects/{id}/episodes/{ep_id}/split - 自动拆分分集
                    ep_id = path_parts[4]
                    episode = get_episode(project_id, ep_id)
                    if episode:
                        new_eps = auto_split_episodes(project_id, ep_id, episode.get('script', ''))
                        self.json_response({'success': True, 'episodes': new_eps})
                    else:
                        self.json_response({'success': False, 'error': '分集不存在'}, 404)
                    return

            # 分享相关
            if len(path_parts) >= 4 and path_parts[3] == 'shares':
                project_id = path_parts[2]

                if method == 'GET':
                    # GET /api/projects/{id}/shares - 分享列表
                    shares = list_shares(project_id)
                    self.json_response({'success': True, 'shares': shares})
                    return

                if method == 'POST':
                    # POST /api/projects/{id}/shares - 创建分享
                    password = body.get('password')
                    expire_days = body.get('expire_days', 7)
                    share = create_share(project_id, password, expire_days)
                    self.json_response({'success': True, 'share': share})
                    return

            self.send_error(404)

        # ========== 分享 API ==========
        def handle_share_api(self, method, path, body=None):
            path_parts = [p for p in path.split('/') if p]

            if method == 'GET' and len(path_parts) >= 2:
                # GET /api/share/{token} - 获取分享内容
                token = path_parts[1]
                share = get_share(token)
                if not share:
                    self.json_response({'success': False, 'error': '分享不存在或已过期'}, 404)
                    return

                # 获取项目数据（只读，去除敏感信息）
                project = get_project(share['project_id'])
                if project:
                    # 只返回公开信息
                    public_project = {
                        'id': project['id'],
                        'name': project['name'],
                        'description': project.get('description', ''),
                        'episodes': project.get('episodes', []),
                    }
                    self.json_response({
                        'success': True,
                        'project': public_project,
                        'share': {
                            'token': share['token'],
                            'view_count': share['view_count'],
                            'created_at': share['created_at'],
                            'expire_at': share['expire_at'],
                            'comments': share.get('comments', []),
                        }
                    })
                else:
                    self.json_response({'success': False, 'error': '项目不存在'}, 404)
                return

            if method == 'POST' and len(path_parts) >= 3 and path_parts[2] == 'comment':
                # POST /api/share/{token}/comment - 添加评论
                token = path_parts[1]
                content = body.get('content', '')
                author = body.get('author', '访客')

                if not content.strip():
                    self.json_response({'success': False, 'error': '评论内容不能为空'}, 400)
                    return

                comment = add_share_comment(token, content, author)
                if comment:
                    self.json_response({'success': True, 'comment': comment})
                else:
                    self.json_response({'success': False, 'error': '分享不存在或已过期'}, 404)
                return

            self.send_error(404)



    # ========== 项目管理 API ==========
    def handle_project_api(self, method, path, body=None):
        path_parts = [p for p in path.split('/') if p]
        
        if method == 'GET' and len(path_parts) == 2:
            projects = list_projects()
            self.json_response({'success': True, 'projects': projects})
            return
        
        if method == 'POST' and len(path_parts) == 2:
            name = body.get('name', '未命名项目') if body else '未命名项目'
            description = body.get('description', '') if body else ''
            project = create_project(name, description)
            self.json_response({'success': True, 'project': project})
            return
        
        if method == 'GET' and len(path_parts) == 3:
            project_id = path_parts[2]
            project = get_project(project_id)
            if project:
                self.json_response({'success': True, 'project': project})
            else:
                self.json_response({'success': False, 'error': '项目不存在'}, 404)
            return
        
        if method == 'PUT' and len(path_parts) == 3:
            project_id = path_parts[2]
            project = update_project(project_id, **(body or {}))
            if project:
                self.json_response({'success': True, 'project': project})
            else:
                self.json_response({'success': False, 'error': '项目不存在'}, 404)
            return
        
        if method == 'DELETE' and len(path_parts) == 3:
            project_id = path_parts[2]
            if delete_project(project_id):
                self.json_response({'success': True})
            else:
                self.json_response({'success': False, 'error': '项目不存在'}, 404)
            return
        
        # 分集相关
        if len(path_parts) >= 4 and path_parts[3] == 'episodes':
            project_id = path_parts[2]
            
            if method == 'GET' and len(path_parts) == 4:
                episodes = list_episodes(project_id)
                self.json_response({'success': True, 'episodes': episodes})
                return
            
            if method == 'POST' and len(path_parts) == 4:
                title = body.get('title', '新分集') if body else '新分集'
                episode_number = body.get('episode_number') if body else None
                episode = create_episode(project_id, title, episode_number)
                self.json_response({'success': True, 'episode': episode})
                return
            
            if method == 'GET' and len(path_parts) == 5:
                ep_id = path_parts[4]
                episode = get_episode(project_id, ep_id)
                if episode:
                    self.json_response({'success': True, 'episode': episode})
                else:
                    self.json_response({'success': False, 'error': '分集不存在'}, 404)
                return
            
            if method == 'PUT' and len(path_parts) == 5:
                ep_id = path_parts[4]
                episode = update_episode(project_id, ep_id, **(body or {}))
                if episode:
                    self.json_response({'success': True, 'episode': episode})
                else:
                    self.json_response({'success': False, 'error': '分集不存在'}, 404)
                return
            
            if method == 'DELETE' and len(path_parts) == 5:
                ep_id = path_parts[4]
                if delete_episode(project_id, ep_id):
                    self.json_response({'success': True})
                else:
                    self.json_response({'success': False, 'error': '分集不存在'}, 404)
                return
            
            if method == 'POST' and len(path_parts) == 6 and path_parts[5] == 'split':
                ep_id = path_parts[4]
                episode = get_episode(project_id, ep_id)
                if episode:
                    new_eps = auto_split_episodes(project_id, ep_id, episode.get('script', ''))
                    self.json_response({'success': True, 'episodes': new_eps})
                else:
                    self.json_response({'success': False, 'error': '分集不存在'}, 404)
                return
        
        # 分享相关
        if len(path_parts) >= 4 and path_parts[3] == 'shares':
            project_id = path_parts[2]
            
            if method == 'GET':
                shares = list_shares(project_id)
                self.json_response({'success': True, 'shares': shares})
                return
            
            if method == 'POST':
                password = body.get('password') if body else None
                expire_days = body.get('expire_days', 7) if body else 7
                share = create_share(project_id, password, expire_days)
                self.json_response({'success': True, 'share': share})
                return
        
        self.send_error(404)

    # ========== 分享 API ==========
    def handle_share_api(self, method, path, body=None):
        path_parts = [p for p in path.split('/') if p]
        
        if method == 'GET' and len(path_parts) >= 2:
            token = path_parts[1]
            share = get_share(token)
            if not share:
                self.json_response({'success': False, 'error': '分享不存在或已过期'}, 404)
                return
            
            project = get_project(share['project_id'])
            if project:
                public_project = {
                    'id': project['id'],
                    'name': project['name'],
                    'description': project.get('description', ''),
                    'episodes': project.get('episodes', []),
                }
                self.json_response({
                    'success': True,
                    'project': public_project,
                    'share': {
                        'token': share['token'],
                        'view_count': share['view_count'],
                        'created_at': share['created_at'],
                        'expire_at': share['expire_at'],
                        'comments': share.get('comments', []),
                    }
                })
            else:
                self.json_response({'success': False, 'error': '项目不存在'}, 404)
            return
        
        if method == 'POST' and len(path_parts) >= 3 and path_parts[2] == 'comment':
            token = path_parts[1]
            content = body.get('content', '') if body else ''
            author = body.get('author', '访客') if body else '访客'
            
            if not content.strip():
                self.json_response({'success': False, 'error': '评论内容不能为空'}, 400)
                return
            
            comment = add_share_comment(token, content, author)
            if comment:
                self.json_response({'success': True, 'comment': comment})
            else:
                self.json_response({'success': False, 'error': '分享不存在或已过期'}, 404)
            return
        
        self.send_error(404)

def main():
    server = ThreadingHTTPServer(('0.0.0.0', PORT), DirectorStudioHandler)
    print(f'🚀 墨枢光影导演台 v2.1 (一致性链条版)')
    print(f'📍 本地访问: http://localhost:{PORT}')
    print(f'📅 启动时间: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    print(f'🎬 五导演: ALPHA(千问3.7+) / BETA(豆包Seed2.0Pro) / GAMMA(DeepSeek) / KAPPA(Kimi K2.6) / EPSILON(智谱)')
    print(f'🖼️  角色生图: NB Pro (主力¥0.3) / NB2 (备用¥0.1)')
    print(f'🖼️  场景生图: GPT-Image-2 (主力¥0.1) / NB2 / 即梦5.0 (备用)')
    print(f'🔗 一致性链条: 角色链(4张变体) + 场景链(3张变体) + 分镜生图(参考传递)')
    print()
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n👋 服务器已停止')
        server.server_close()



if __name__ == '__main__':
    main()
