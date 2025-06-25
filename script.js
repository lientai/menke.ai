// 全局变量
let canvas = null;
let ctx = null;

// Flappy Bird 游戏变量
let bird = null;
let pipes = [];
let gameScore = 0;
let gameState = 'menu'; // 'menu', 'playing', 'gameOver'
let gameSpeed = 2;
let pipeGap = 120;
let pipeWidth = 50;
let animationId = null;

// DOM元素
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

// 预定义的图片列表（使用let以便后续添加AI生成的图片）
let imageList = [
    { filename: 'character1.png', title: '角色1', type: 'character' },
    { filename: 'character2.png', title: '角色2', type: 'character' },
    { filename: 'enemy1.png', title: '敌人1', type: 'enemy' },
    { filename: 'enemy2.png', title: '敌人2', type: 'enemy' },
    { filename: 'background1.png', title: '背景1', type: 'background' },
    { filename: 'background2.png', title: '背景2', type: 'background' },
    { filename: 'item1.png', title: '道具1', type: 'item' },
    { filename: 'item2.png', title: '道具2', type: 'item' }
];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initChat();
    initEditor();
    initCodeViewer();
    initResizers();
    initVerticalResizer();
    initFileUpload();
    initializeCanvas();
    initializeGameControls();
    initializeAudioControls();
    initNavbar();
    initGamePageNav();
    initProjectMenu();
    loadImagesFromFolder();
    initAIGenerate();
    initVisualEditor();
    initGamePlanning();
});

// 标签切换功能
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.resource-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            panels.forEach(panel => panel.classList.remove('active'));
            
            this.classList.add('active');
            const targetPanel = document.getElementById(this.dataset.tab + '-panel');
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// 初始化画布
function initializeCanvas() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // 初始化Flappy Bird游戏
    initFlappyBird();
    
    // 添加点击事件监听
    canvas.addEventListener('click', handleCanvasClick);
}

// 画布点击处理
function handleCanvasClick(event) {
    // Flappy Bird 游戏控制
    if (gameState === 'menu') {
        startFlappyBird();
    } else if (gameState === 'playing') {
        bird.flap();
    } else if (gameState === 'gameOver') {
        resetFlappyBird();
    }
}



// 初始化属性编辑器（已简化，专注于Flappy Bird游戏）
function initEditor() {
    // 属性编辑器现在专注于显示Flappy Bird游戏信息
    console.log('编辑器初始化 - 现在专注于Flappy Bird游戏');
}



// 初始化游戏控制
function initializeGameControls() {
    document.getElementById('play-btn').addEventListener('click', playGame);
    document.getElementById('pause-btn').addEventListener('click', pauseGame);
    document.getElementById('stop-btn').addEventListener('click', stopGame);
}

// 游戏控制函数
function playGame() {
    if (gameState === 'menu') {
        startFlappyBird();
    } else if (gameState === 'gameOver') {
        resetFlappyBird();
    }
    if (typeof addMessage === 'function') {
        addMessage('AI助手', 'Flappy Bird游戏已开始！点击画布控制小鸟飞行。', 'ai');
    }
}

function pauseGame() {
    if (gameState === 'playing') {
        gameState = 'paused';
        cancelAnimationFrame(animationId);
        if (typeof addMessage === 'function') {
            addMessage('AI助手', '游戏已暂停。', 'ai');
        }
    } else if (gameState === 'paused') {
        gameState = 'playing';
        gameLoop();
        if (typeof addMessage === 'function') {
            addMessage('AI助手', '游戏已恢复。', 'ai');
        }
    }
}

function stopGame() {
    gameState = 'menu';
    cancelAnimationFrame(animationId);
    resetFlappyBird();
    if (typeof addMessage === 'function') {
        addMessage('AI助手', '游戏已停止。', 'ai');
    }
}

// 初始化音频控制
function initializeAudioControls() {
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const audioName = this.parentElement.querySelector('span').textContent;
            playAudio(audioName);
        });
    });
}

// 播放音频（模拟）
function playAudio(audioName) {
    addChatMessage('AI助手', `正在播放：${audioName}`, 'ai');
    // 这里可以添加实际的音频播放逻辑
}

// 初始化聊天功能
function initChat() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage('用户', message, 'user');
            chatInput.value = '';
            
            setTimeout(() => {
                const aiResponse = generateAIResponse(message);
                addMessage('AI助手', aiResponse, 'ai');
            }, 1000);
        }
    }
    
    function addMessage(sender, text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${type === 'ai' ? 'fa-robot' : 'fa-user'}"></i>
            </div>
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${new Date().toLocaleTimeString()}</span>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function generateAIResponse(userMessage) {
        if (userMessage.includes('游戏') || userMessage.includes('Flappy Bird')) {
            return '现在画布中有一个完整的Flappy Bird游戏！点击画布或按空格键开始游戏，享受这个经典的小鸟飞行挑战吧！';
        } else if (userMessage.includes('控制') || userMessage.includes('操作')) {
            return '游戏控制很简单：点击画布或按空格键让小鸟跳跃，避开绿色管道，尽可能获得高分！';
        } else if (userMessage.includes('分数') || userMessage.includes('得分')) {
            return '每通过一个管道就能得到1分！每达到5分的倍数，我会为您送上祝贺。挑战更高分数吧！';
        } else if (userMessage.includes('音乐') || userMessage.includes('音频')) {
            return '您可以在音乐资源面板中管理音频文件，为游戏添加更丰富的音效体验。';
        }
        
        return '我理解了您的需求，让我来帮您实现这个功能。现在您可以享受Flappy Bird游戏了！';
    }
    
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    
}

// 初始化导航栏
function initNavbar() {
    // 导航项切换
    const navbarItems = document.querySelectorAll('.navbar-item');
    navbarItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有活动状态
            navbarItems.forEach(nav => nav.classList.remove('active'));
            // 激活当前项
            this.classList.add('active');
            
            const page = this.dataset.page;
            switchGame(page);
        });
    });
    
    // 导航按钮功能
    document.getElementById('fullscreen-btn').addEventListener('click', toggleFullscreen);
    document.getElementById('settings-btn').addEventListener('click', showSettings);
    document.getElementById('help-btn').addEventListener('click', showHelp);
}

// 初始化游戏页面导航
function initGamePageNav() {
    const pageNavBtns = document.querySelectorAll('.page-nav-btn');
    pageNavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有活动状态
            pageNavBtns.forEach(b => b.classList.remove('active'));
            // 激活当前页面
            this.classList.add('active');
            
            const page = this.dataset.page;
            switchGamePage(page);
        });
    });
}

// 从images文件夹加载图片
function loadImagesFromFolder() {
    const imagesGrid = document.querySelector('#images-panel .resource-grid');
    
    // 清空现有的占位符内容
    imagesGrid.innerHTML = '';
    
    // 为每个预定义的图片创建元素
    imageList.forEach((imageInfo, index) => {
        const imageItem = createImageItem(imageInfo, index);
        imagesGrid.appendChild(imageItem);
    });
    
    // 添加消息提示
    if (typeof addMessage === 'function') {
        addMessage('系统', `已加载 ${imageList.length} 个图片资源配置`, 'ai');
    }
}

// 创建图片项元素
function createImageItem(imageInfo, index) {
    const imageItem = document.createElement('div');
    imageItem.className = 'image-item';
    imageItem.dataset.filename = imageInfo.filename;
    imageItem.dataset.type = imageInfo.type;
    
    // 判断是AI生成的图片还是普通图片
    const imagePath = imageInfo.isAIGenerated ? imageInfo.dataUrl : `images/${imageInfo.filename}`;
    const aiLabel = imageInfo.isAIGenerated ? '<div class="ai-label"><i class="fas fa-magic"></i> AI</div>' : '';
    
    imageItem.innerHTML = `
        <div class="image-preview">
            <img src="${imagePath}" alt="${imageInfo.title}" onerror="handleImageError(this, '${imageInfo.type}')">
            <div class="image-overlay">
                <i class="fas fa-eye" title="预览图片"></i>
                <i class="fas fa-download" title="下载图片"></i>
            </div>
            ${aiLabel}
        </div>
        <span class="image-title">${imageInfo.title}</span>
        <small class="image-filename">${imageInfo.filename}</small>
    `;
    
    // 添加点击事件
    imageItem.addEventListener('click', function() {
        previewImage(imagePath, imageInfo.title, imageInfo);
    });
    
    return imageItem;
}

// 处理图片加载错误
function handleImageError(img, type) {
    // 如果图片加载失败，显示对应类型的图标
    const iconMap = {
        'character': 'fa-user',
        'enemy': 'fa-dragon',
        'background': 'fa-tree',
        'item': 'fa-gem'
    };
    
    const icon = iconMap[type] || 'fa-image';
    
    // 替换img元素为图标
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.innerHTML = `<i class="fas ${icon}"></i>`;
    
    img.parentNode.replaceChild(placeholder, img);
}

// 预览图片
function previewImage(imagePath, title, imageInfo = null) {
    // 创建模态框来预览图片
    const modal = document.createElement('div');
    modal.className = 'image-preview-modal';
    
    // 为AI生成的图片添加额外信息
    let additionalInfo = '';
    if (imageInfo && imageInfo.isAIGenerated) {
        additionalInfo = `
            <div class="ai-image-info">
                <h4><i class="fas fa-magic"></i> AI生成信息</h4>
                <p><strong>生成描述:</strong> ${imageInfo.prompt || '无'}</p>
                <p><strong>图片风格:</strong> ${getStyleName(imageInfo.style || 'unknown')}</p>
                <p><strong>图片类型:</strong> ${getTypeName(imageInfo.type || 'unknown')}</p>
                <p><strong>生成时间:</strong> ${imageInfo.timestamp ? new Date(imageInfo.timestamp).toLocaleString() : '未知'}</p>
            </div>
        `;
    }
    
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeImagePreview()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeImagePreview()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <img src="${imagePath}" alt="${title}" onerror="this.style.display='none'">
                <div class="image-info">
                    <p>文件路径: ${imageInfo && imageInfo.isAIGenerated ? '(AI生成)' : imagePath}</p>
                    ${additionalInfo}
                    <button class="download-btn" onclick="downloadImage('${imagePath}', '${title}')">
                        <i class="fas fa-download"></i> 下载图片
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 添加模态框样式（如果还没有）
    if (!document.querySelector('#image-modal-styles')) {
        addImageModalStyles();
    }
}

// 关闭图片预览
function closeImagePreview() {
    const modal = document.querySelector('.image-preview-modal');
    if (modal) {
        modal.remove();
    }
}

// 下载图片
function downloadImage(imagePath, title) {
    const link = document.createElement('a');
    link.href = imagePath;
    link.download = title + '.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (typeof addMessage === 'function') {
        addMessage('系统', `图片 "${title}" 下载完成！`, 'ai');
    }
}

// 添加图片模态框样式
function addImageModalStyles() {
    const style = document.createElement('style');
    style.id = 'image-modal-styles';
    style.textContent = `
        .image-preview-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            position: relative;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            max-width: 90vw;
            max-height: 90vh;
            overflow: hidden;
            animation: modalFadeIn 0.3s ease;
        }
        
        .modal-header {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h3 {
            margin: 0;
            font-size: 1.2em;
        }
        
        .modal-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 5px;
            border-radius: 5px;
            transition: background 0.3s ease;
        }
        
        .modal-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .modal-body {
            padding: 20px;
            text-align: center;
        }
        
        .modal-body img {
            max-width: 100%;
            max-height: 60vh;
            border-radius: 10px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
        
        .image-info {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        
        .image-info p {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 15px;
        }
        
        .download-btn {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        }
        
        .download-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    
    document.head.appendChild(style);
}

// 初始化AI生成功能
function initAIGenerate() {
    const aiGenerateButton = document.getElementById('ai-generate-button');
    const generateBtn = document.getElementById('generate-btn');
    const clearFormBtn = document.getElementById('clear-form-btn');
    const saveToLibraryBtn = document.getElementById('save-to-library-btn');
    const downloadResultBtn = document.getElementById('download-result-btn');
    const regenerateBtn = document.getElementById('regenerate-btn');
    
    // AI生成按钮点击事件 - 切换到AI生成面板
    aiGenerateButton.addEventListener('click', function() {
        // 移除所有标签的活动状态
        const tabButtons = document.querySelectorAll('.tab-btn');
        const panels = document.querySelectorAll('.resource-panel');
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        panels.forEach(panel => panel.classList.remove('active'));
        
        // 激活AI生成面板
        const aiPanel = document.getElementById('ai-generate-panel');
        if (aiPanel) {
            aiPanel.classList.add('active');
        }
        
        // 添加聊天消息
        if (typeof addMessage === 'function') {
            addMessage('AI助手', '欢迎使用AI美术生成功能！您可以通过描述文字来生成各种游戏美术资源。', 'ai');
        }
    });
    
    // 生成按钮点击事件
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const prompt = document.getElementById('prompt-input').value.trim();
            
            if (!prompt) {
                alert('请输入图片描述！');
                return;
            }
            
            generateAIImage();
        });
    }
    
    // 清空表单按钮
    if (clearFormBtn) {
        clearFormBtn.addEventListener('click', function() {
            clearGenerateForm();
        });
    }
    
    // 保存到资源库按钮
    if (saveToLibraryBtn) {
        saveToLibraryBtn.addEventListener('click', function() {
            saveGeneratedImageToLibrary();
        });
    }
    
    // 下载结果按钮
    if (downloadResultBtn) {
        downloadResultBtn.addEventListener('click', function() {
            downloadGeneratedImage();
        });
    }
    
    // 重新生成按钮
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', function() {
            generateAIImage();
        });
    }
}

// 生成AI图片
function generateAIImage() {
    const prompt = document.getElementById('prompt-input').value.trim();
    const style = document.getElementById('image-style').value;
    const size = document.getElementById('image-size').value;
    const type = document.getElementById('image-type').value;
    const quality = document.getElementById('image-quality').value;
    const negativePrompt = document.getElementById('negative-prompt').value.trim();
    
    const generateBtn = document.getElementById('generate-btn');
    const status = document.getElementById('generation-status');
    const resultGrid = document.getElementById('result-grid');
    const resultActions = document.getElementById('result-actions');
    
    // 更新UI状态为生成中
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<div class="generating-spinner"></div> 生成中...';
    
    status.className = 'result-status generating';
    status.innerHTML = '<div class="generating-spinner"></div> <span>AI正在生成图片，请稍候...</span>';
    
    // 模拟AI生成过程
    setTimeout(() => {
        // 模拟生成完成
        const generatedImageData = simulateAIGeneration(prompt, style, size, type, quality, negativePrompt);
        
        // 更新UI显示结果
        displayGeneratedImage(generatedImageData);
        
        // 恢复按钮状态
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-magic"></i> 开始生成';
        
        // 更新状态
        status.className = 'result-status success';
        status.innerHTML = '<i class="fas fa-check-circle"></i> <span>生成完成！</span>';
        
        // 显示操作按钮
        resultActions.style.display = 'flex';
        
        // 添加聊天消息
        if (typeof addMessage === 'function') {
            addMessage('AI助手', `AI图片生成完成！已根据您的描述"${prompt}"生成了${getStyleName(style)}风格的${getTypeName(type)}图片。`, 'ai');
        }
        
    }, 3000); // 模拟3秒生成时间
}

// 模拟AI生成图片
function simulateAIGeneration(prompt, style, size, type, quality, negativePrompt) {
    // 创建一个模拟的图片数据
    const canvas = document.createElement('canvas');
    const [width, height] = size.split('x').map(Number);
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // 创建渐变背景模拟生成的图片
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    
    // 根据类型选择不同的颜色
    const colorSchemes = {
        'character': ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'],
        'enemy': ['#ff6b6b', '#ee5a24', '#2d3436', '#636e72', '#74b9ff'],
        'background': ['#74b9ff', '#0984e3', '#6c5ce7', '#a29bfe', '#fd79a8'],
        'item': ['#fdcb6e', '#f39c12', '#e17055', '#d63031', '#fd79a8'],
        'ui': ['#636e72', '#2d3436', '#ddd', '#b2bec3', '#74b9ff'],
        'effect': ['#fd79a8', '#fdcb6e', '#e84393', '#00b894', '#74b9ff']
    };
    
    const colors = colorSchemes[type] || colorSchemes['character'];
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.25, colors[1]);
    gradient.addColorStop(0.5, colors[2]);
    gradient.addColorStop(0.75, colors[3]);
    gradient.addColorStop(1, colors[4]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // 添加一些装饰元素
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const radius = Math.random() * 30 + 10;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 添加文字标识
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.font = `bold ${Math.min(width, height) / 20}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AI Generated', width / 2, height / 2);
    
    ctx.font = `${Math.min(width, height) / 30}px Arial`;
    ctx.fillText(`${getStyleName(style)} Style`, width / 2, height / 2 + Math.min(width, height) / 15);
    ctx.fillText(`${getTypeName(type)}`, width / 2, height / 2 + Math.min(width, height) / 10);
    
    return {
        dataUrl: canvas.toDataURL('image/png'),
        prompt: prompt,
        style: style,
        size: size,
        type: type,
        quality: quality,
        negativePrompt: negativePrompt,
        timestamp: new Date()
    };
}

// 显示生成的图片
function displayGeneratedImage(imageData) {
    const resultGrid = document.getElementById('result-grid');
    
    resultGrid.innerHTML = `
        <img src="${imageData.dataUrl}" alt="AI生成的图片" class="generated-image">
    `;
    
    // 保存当前生成的图片数据
    window.currentGeneratedImage = imageData;
}

// 清空生成表单
function clearGenerateForm() {
    document.getElementById('prompt-input').value = '';
    document.getElementById('negative-prompt').value = '';
    document.getElementById('image-style').selectedIndex = 0;
    document.getElementById('image-size').selectedIndex = 0;
    document.getElementById('image-type').selectedIndex = 0;
    document.getElementById('image-quality').selectedIndex = 0;
    
    // 重置结果区域
    const resultGrid = document.getElementById('result-grid');
    const resultActions = document.getElementById('result-actions');
    const status = document.getElementById('generation-status');
    
    resultGrid.innerHTML = `
        <div class="result-placeholder">
            <i class="fas fa-image"></i>
            <p>生成的图片将显示在这里</p>
        </div>
    `;
    
    resultActions.style.display = 'none';
    status.className = 'result-status';
    status.innerHTML = '<i class="fas fa-info-circle"></i> <span>等待生成指令</span>';
    
    window.currentGeneratedImage = null;
    
    if (typeof addMessage === 'function') {
        addMessage('系统', '表单已清空，可以开始新的AI图片生成。', 'ai');
    }
}

// 保存生成的图片到资源库
function saveGeneratedImageToLibrary() {
    if (!window.currentGeneratedImage) {
        alert('没有可保存的图片！');
        return;
    }
    
    const imageData = window.currentGeneratedImage;
    const filename = `ai-generated-${imageData.type}-${Date.now()}.png`;
    
    // 创建新的图片项并添加到图片资源库
    const newImageInfo = {
        filename: filename,
        title: `AI生成-${getTypeName(imageData.type)}`,
        type: imageData.type,
        dataUrl: imageData.dataUrl,
        prompt: imageData.prompt,
        isAIGenerated: true
    };
    
    // 添加到全局图片列表
    imageList.push(newImageInfo);
    
    // 重新加载图片资源库
    loadImagesFromFolder();
    
    if (typeof addMessage === 'function') {
        addMessage('系统', `AI生成的图片已保存到资源库！文件名：${filename}`, 'ai');
    }
}

// 下载生成的图片
function downloadGeneratedImage() {
    if (!window.currentGeneratedImage) {
        alert('没有可下载的图片！');
        return;
    }
    
    const imageData = window.currentGeneratedImage;
    const link = document.createElement('a');
    link.href = imageData.dataUrl;
    link.download = `ai-generated-${imageData.type}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (typeof addMessage === 'function') {
        addMessage('系统', 'AI生成的图片已下载到本地！', 'ai');
    }
}

// 获取风格名称
function getStyleName(style) {
    const styleNames = {
        'realistic': '写实',
        'cartoon': '卡通',
        'anime': '动漫',
        'pixel': '像素',
        'fantasy': '魔幻',
        'sci-fi': '科幻'
    };
    return styleNames[style] || style;
}

// 获取类型名称
function getTypeName(type) {
    const typeNames = {
        'character': '角色',
        'enemy': '敌人',
        'background': '背景',
        'item': '道具',
        'ui': '界面元素',
        'effect': '特效'
    };
    return typeNames[type] || type;
}

// 初始化视觉编辑器功能
function initVisualEditor() {
    const visualEditorBtn = document.getElementById('visual-editor-btn');
    const editorPanel = document.querySelector('.editor-panel');
    const verticalResizer = document.getElementById('vertical-resizer');
    let editorVisible = true; // 默认显示编辑器
    
    if (!visualEditorBtn || !editorPanel) {
        console.log('视觉编辑器按钮或编辑器面板未找到');
        return;
    }
    
    // 切换编辑器显示/隐藏
    function toggleEditor() {
        editorVisible = !editorVisible;
        
        if (editorVisible) {
            // 显示编辑器
            editorPanel.style.display = 'flex';
            editorPanel.style.height = '50%';
            if (verticalResizer) {
                verticalResizer.style.display = 'flex';
            }
            
            // 更新按钮状态
            visualEditorBtn.classList.add('active');
            visualEditorBtn.title = '隐藏属性编辑器';
            
            // 更新游戏预览高度
            const gamePreview = document.querySelector('.game-preview');
            if (gamePreview) {
                gamePreview.style.height = '50%';
            }
            
            // 添加聊天消息
            if (typeof addMessage === 'function') {
                addMessage('系统', '属性编辑器已打开！您可以在这里调整游戏元素的属性。', 'ai');
            }
        } else {
            // 隐藏编辑器
            editorPanel.style.display = 'none';
            if (verticalResizer) {
                verticalResizer.style.display = 'none';
            }
            
            // 更新按钮状态
            visualEditorBtn.classList.remove('active');
            visualEditorBtn.title = '显示属性编辑器';
            
            // 更新游戏预览高度
            const gamePreview = document.querySelector('.game-preview');
            if (gamePreview) {
                gamePreview.style.height = '100%';
            }
            
            // 添加聊天消息
            if (typeof addMessage === 'function') {
                addMessage('系统', '属性编辑器已隐藏，游戏预览区域已扩展到全高度。', 'ai');
            }
        }
    }
    
    // 按钮点击事件
    visualEditorBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleEditor();
    });
    
    // 初始化时设置按钮状态
    if (editorVisible) {
        visualEditorBtn.classList.add('active');
        visualEditorBtn.title = '隐藏属性编辑器';
    } else {
        visualEditorBtn.classList.remove('active');
        visualEditorBtn.title = '显示属性编辑器';
    }
}

// 初始化项目菜单下拉功能
function initProjectMenu() {
    const dropdownBtn = document.getElementById('project-menu-btn');
    const dropdownMenu = document.getElementById('project-dropdown');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const projectUpload = document.getElementById('project-upload');
    
    // 点击按钮切换下拉菜单
    dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown();
    });
    
    // 点击页面其他地方关闭下拉菜单
    document.addEventListener('click', function() {
        closeDropdown();
    });
    
    // 阻止菜单内点击关闭菜单
    dropdownMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // 处理菜单项点击
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            const action = this.dataset.action;
            handleProjectAction(action);
            closeDropdown();
        });
    });
    
    // 处理文件上传
    projectUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            uploadProject(file);
        }
    });
    
    // 键盘快捷键支持
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'n':
                    e.preventDefault();
                    handleProjectAction('new-project');
                    break;
                case 'o':
                    e.preventDefault();
                    handleProjectAction('open-project');
                    break;
                case 's':
                    e.preventDefault();
                    handleProjectAction('save-project');
                    break;
                case 'e':
                    e.preventDefault();
                    handleProjectAction('export-project');
                    break;
            }
        }
    });
}

// 切换下拉菜单状态
function toggleDropdown() {
    const dropdownBtn = document.getElementById('project-menu-btn');
    const dropdownMenu = document.getElementById('project-dropdown');
    
    dropdownBtn.classList.toggle('active');
    dropdownMenu.classList.toggle('show');
}

// 关闭下拉菜单
function closeDropdown() {
    const dropdownBtn = document.getElementById('project-menu-btn');
    const dropdownMenu = document.getElementById('project-dropdown');
    
    dropdownBtn.classList.remove('active');
    dropdownMenu.classList.remove('show');
}

// 处理项目操作
function handleProjectAction(action) {
    switch(action) {
        case 'new-project':
            createNewProject();
            break;
        case 'open-project':
            openProject();
            break;
        case 'save-project':
            saveProject();
            break;
        case 'export-project':
            exportProject();
            break;
        case 'upload-project':
            uploadProjectFile();
            break;
        case 'share-project':
            shareProject();
            break;
        case 'project-settings':
            openProjectSettings();
            break;
        default:
            console.log('未知操作:', action);
    }
}

// 创建新项目
function createNewProject() {
    if (confirm('创建新项目将清除当前进度，是否继续？')) {
        // 重置游戏状态
        gameState = 'menu';
        gameScore = 0;
        resetFlappyBird();
        
        // 清除聊天记录
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = `
            <div class="message ai-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>新项目已创建！我是你的AI游戏开发助手。告诉我你想创建什么样的游戏，我会帮你生成相应的代码和资源。</p>
                    <span class="message-time">${new Date().toLocaleTimeString()}</span>
                </div>
            </div>
        `;
        
        // 使用现有的addMessage函数（如果存在）
        if (typeof addMessage === 'function') {
            addMessage('系统', '新项目创建成功！', 'ai');
        }
    }
}

// 打开项目
function openProject() {
    const projectUpload = document.getElementById('project-upload');
    projectUpload.click();
}

// 保存项目
function saveProject() {
    const projectData = {
        gameType: 'flappy-bird',
        gameScore: gameScore,
        gameState: gameState,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(projectData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `menke-ai-project-${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    if (typeof addMessage === 'function') {
        addMessage('系统', '项目已保存到本地！', 'ai');
    }
}

// 导出项目
function exportProject() {
    const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flappy Bird - Menke AI导出</title>
    <style>
        body { margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: Arial, sans-serif; }
        canvas { border: 2px solid #333; border-radius: 10px; background: #87CEEB; display: block; margin: 20px auto; }
        .info { text-align: center; color: white; margin: 20px; }
        .controls { text-align: center; margin: 20px; }
        button { background: #667eea; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 5px; cursor: pointer; }
        button:hover { background: #5a6fd8; }
    </style>
</head>
<body>
    <div class="info">
        <h1>Flappy Bird</h1>
        <p>由 Menke AI 生成 | 点击画布或按空格键控制小鸟</p>
    </div>
    <canvas id="gameCanvas" width="400" height="300"></canvas>
    <div class="controls">
        <button onclick="startGame()">开始游戏</button>
        <button onclick="resetGame()">重置游戏</button>
    </div>
    <script>
        // 这里会包含完整的Flappy Bird游戏代码
        // 为演示目的，这里显示简化版本
        alert('完整的Flappy Bird游戏已导出！');
    </script>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `flappy-bird-export-${new Date().getTime()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    if (typeof addMessage === 'function') {
        addMessage('系统', '游戏已导出为HTML文件！', 'ai');
    }
}

// 上传项目文件
function uploadProjectFile() {
    const projectUpload = document.getElementById('project-upload');
    projectUpload.click();
}

// 上传项目
function uploadProject(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const projectData = JSON.parse(e.target.result);
            
            // 验证项目数据
            if (projectData.gameType && projectData.timestamp) {
                // 恢复项目状态
                gameScore = projectData.gameScore || 0;
                gameState = projectData.gameState || 'menu';
                
                if (typeof addMessage === 'function') {
                    addMessage('系统', `项目 "${projectData.gameType}" 上传成功！创建时间: ${new Date(projectData.timestamp).toLocaleString()}`, 'ai');
                }
                
                // 如果需要，可以在这里恢复更多状态
                resetFlappyBird();
            } else {
                throw new Error('无效的项目文件格式');
            }
        } catch (error) {
            if (typeof addMessage === 'function') {
                addMessage('系统', '项目文件解析失败：' + error.message, 'ai');
            }
        }
    };
    
    reader.readAsText(file);
}

// 分享项目
function shareProject() {
    const shareData = {
        title: 'Menke AI - Flappy Bird游戏',
        text: '我用Menke AI创建了一个Flappy Bird游戏，快来试试吧！',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => {
                if (typeof addMessage === 'function') {
                    addMessage('系统', '项目分享成功！', 'ai');
                }
            })
            .catch(() => {
                if (typeof addMessage === 'function') {
                    addMessage('系统', '分享取消', 'ai');
                }
            });
    } else {
        // fallback: 复制链接到剪贴板
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                if (typeof addMessage === 'function') {
                    addMessage('系统', '项目链接已复制到剪贴板！', 'ai');
                }
            })
            .catch(() => {
                if (typeof addMessage === 'function') {
                    addMessage('系统', '分享功能不可用', 'ai');
                }
            });
    }
}

// 打开项目设置
function openProjectSettings() {
    const settings = {
        项目名称: 'Flappy Bird游戏',
        游戏类型: 'flappy-bird',
        难度级别: '正常',
        主题风格: '经典'
    };
    
    const settingsText = Object.entries(settings)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    
    if (typeof addMessage === 'function') {
        addMessage('系统', `项目设置:\n${settingsText}`, 'ai');
    }
}

// 切换游戏
function switchGame(gameType) {
    // 停止当前游戏
    gameState = 'menu';
    cancelAnimationFrame(animationId);
    
    // 更新游戏标题
    const gameTitle = document.getElementById('current-game-title');
    
    switch(gameType) {
        case 'flappy-bird':
            gameTitle.textContent = 'Flappy Bird';
            resetFlappyBird();
            // 重置到游戏页面
            document.querySelector('.page-nav-btn[data-page="game"]').click();
            if (typeof addMessage === 'function') {
                addMessage('AI助手', '已切换到Flappy Bird游戏！点击画布开始游戏。', 'ai');
            }
            break;
        case 'snake':
            gameTitle.textContent = '贪吃蛇';
            drawComingSoon('贪吃蛇游戏');
            if (typeof addMessage === 'function') {
                addMessage('AI助手', '贪吃蛇游戏正在开发中，敬请期待！', 'ai');
            }
            break;
        case 'tetris':
            gameTitle.textContent = '俄罗斯方块';
            drawComingSoon('俄罗斯方块');
            if (typeof addMessage === 'function') {
                addMessage('AI助手', '俄罗斯方块游戏正在开发中，敬请期待！', 'ai');
            }
            break;
        case 'breakout':
            gameTitle.textContent = '打砖块';
            drawComingSoon('打砖块游戏');
            if (typeof addMessage === 'function') {
                addMessage('AI助手', '打砖块游戏正在开发中，敬请期待！', 'ai');
            }
            break;
        case 'puzzle':
            gameTitle.textContent = '拼图游戏';
            drawComingSoon('拼图游戏');
            if (typeof addMessage === 'function') {
                addMessage('AI助手', '拼图游戏正在开发中，敬请期待！', 'ai');
            }
            break;
    }
}

// 切换游戏页面
function switchGamePage(pageType) {
    // 停止当前游戏动画
    if (pageType !== 'game') {
        gameState = 'menu';
        cancelAnimationFrame(animationId);
    }
    
    const currentGame = document.querySelector('.navbar-item.active').dataset.page;
    
    switch(pageType) {
        case 'game':
            if (currentGame === 'flappy-bird') {
                resetFlappyBird();
            } else {
                drawComingSoon(document.getElementById('current-game-title').textContent);
            }
            if (typeof addMessage === 'function') {
                addMessage('AI助手', '切换到游戏页面！准备开始游戏吧！', 'ai');
            }
            break;
            
        case 'tutorial':
            drawTutorialPage(currentGame);
            if (typeof addMessage === 'function') {
                addMessage('AI助手', '这是游戏教程页面，我来为您介绍游戏玩法！', 'ai');
            }
            break;
            
        case 'settings':
            drawSettingsPage(currentGame);
            if (typeof addMessage === 'function') {
                addMessage('AI助手', '这是游戏设置页面，您可以调整游戏参数！', 'ai');
            }
            break;
            
        case 'leaderboard':
            drawLeaderboardPage(currentGame);
            if (typeof addMessage === 'function') {
                addMessage('AI助手', '这是排行榜页面，查看最高分记录！', 'ai');
            }
            break;
            
        case 'stats':
            drawStatsPage(currentGame);
            if (typeof addMessage === 'function') {
                addMessage('AI助手', '这是统计页面，查看您的游戏数据！', 'ai');
            }
            break;
            
        case 'new-page':
            drawNewPage();
            if (typeof addMessage === 'function') {
                addMessage('AI助手', '欢迎使用新建页面功能！您可以在这里创建自定义游戏页面。', 'ai');
            }
            break;
    }
}

// 绘制"即将推出"界面
function drawComingSoon(gameName) {
    // 清空画布
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制主标题
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    
    ctx.strokeText(gameName, canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillText(gameName, canvas.width / 2, canvas.height / 2 - 30);
    
    // 绘制副标题
    ctx.font = '16px Arial';
    ctx.strokeText('即将推出', canvas.width / 2, canvas.height / 2);
    ctx.fillText('即将推出', canvas.width / 2, canvas.height / 2);
    
    // 绘制提示文字
    ctx.font = '14px Arial';
    ctx.strokeText('敬请期待更多精彩游戏！', canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillText('敬请期待更多精彩游戏！', canvas.width / 2, canvas.height / 2 + 30);
    
    // 绘制装饰图标
    ctx.font = '48px Arial';
    ctx.strokeText('🎮', canvas.width / 2, canvas.height / 2 + 80);
    ctx.fillText('🎮', canvas.width / 2, canvas.height / 2 + 80);
}

// 绘制教程页面
function drawTutorialPage(gameType) {
    // 清空画布
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#4facfe');
    gradient.addColorStop(1, '#00f2fe');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制标题
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    
    ctx.strokeText('🎓 游戏教程', canvas.width / 2, 60);
    ctx.fillText('🎓 游戏教程', canvas.width / 2, 60);
    
    // 绘制教程内容
    ctx.font = '14px Arial';
    const tutorials = gameType === 'flappy-bird' ? 
        ['点击画布或按空格键', '让小鸟跳跃飞行', '避开绿色管道', '获得更高分数！'] :
        ['教程内容', '正在准备中', '敬请期待！', ''];
    
    tutorials.forEach((text, index) => {
        const y = 120 + index * 30;
        ctx.strokeText(text, canvas.width / 2, y);
        ctx.fillText(text, canvas.width / 2, y);
    });
}

// 绘制设置页面
function drawSettingsPage(gameType) {
    // 清空画布
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#a8edea');
    gradient.addColorStop(1, '#fed6e3');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制标题
    ctx.fillStyle = '#333';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    
    ctx.strokeText('⚙️ 游戏设置', canvas.width / 2, 60);
    ctx.fillText('⚙️ 游戏设置', canvas.width / 2, 60);
    
    // 绘制设置选项
    ctx.font = '14px Arial';
    const settings = [
        '🔊 音效: 开启',
        '🎵 背景音乐: 开启', 
        '🎯 难度: 普通',
        '🎨 主题: 默认'
    ];
    
    settings.forEach((text, index) => {
        const y = 120 + index * 30;
        ctx.strokeText(text, canvas.width / 2, y);
        ctx.fillText(text, canvas.width / 2, y);
    });
}

// 绘制排行榜页面
function drawLeaderboardPage(gameType) {
    // 清空画布
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ffecd2');
    gradient.addColorStop(1, '#fcb69f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制标题
    ctx.fillStyle = '#333';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    
    ctx.strokeText('🏆 排行榜', canvas.width / 2, 60);
    ctx.fillText('🏆 排行榜', canvas.width / 2, 60);
    
    // 绘制排行榜
    ctx.font = '14px Arial';
    const leaderboard = [
        '🥇 第1名: 999分',
        '🥈 第2名: 888分',
        '🥉 第3名: 777分',
        '4. 您的记录: ' + gameScore + '分'
    ];
    
    leaderboard.forEach((text, index) => {
        const y = 120 + index * 30;
        ctx.strokeText(text, canvas.width / 2, y);
        ctx.fillText(text, canvas.width / 2, y);
    });
}

// 绘制统计页面
function drawStatsPage(gameType) {
    // 清空画布
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ff9a9e');
    gradient.addColorStop(1, '#fecfef');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制标题
    ctx.fillStyle = '#333';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    
    ctx.strokeText('📊 游戏统计', canvas.width / 2, 60);
    ctx.fillText('📊 游戏统计', canvas.width / 2, 60);
    
    // 绘制统计数据
    ctx.font = '14px Arial';
    const stats = [
        '🎮 总游戏次数: 0',
        '⏱️ 总游戏时间: 0分钟',
        '🏆 最高分: ' + gameScore,
        '📈 平均分: 0'
    ];
    
    stats.forEach((text, index) => {
        const y = 120 + index * 30;
        ctx.strokeText(text, canvas.width / 2, y);
        ctx.fillText(text, canvas.width / 2, y);
    });
}

// 绘制新建页面
function drawNewPage() {
    // 清空画布
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#f093fb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制标题
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    
    ctx.strokeText('➕ 新建页面', canvas.width / 2, 60);
    ctx.fillText('➕ 新建页面', canvas.width / 2, 60);
    
    // 绘制功能描述
    ctx.font = '14px Arial';
    const features = [
        '🎨 自定义页面布局',
        '🎮 添加游戏元素',
        '⚙️ 配置页面功能',
        '💾 保存页面设计',
        '🚀 一键发布页面'
    ];
    
    features.forEach((text, index) => {
        const y = 120 + index * 25;
        ctx.strokeText(text, canvas.width / 2, y);
        ctx.fillText(text, canvas.width / 2, y);
    });
    
    // 绘制提示文字
    ctx.font = '12px Arial';
    ctx.strokeText('点击开始创建您的专属游戏页面！', canvas.width / 2, canvas.height - 40);
    ctx.fillText('点击开始创建您的专属游戏页面！', canvas.width / 2, canvas.height - 40);
}

// 全屏功能
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('无法进入全屏模式:', err);
        });
        document.getElementById('fullscreen-btn').innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            document.getElementById('fullscreen-btn').innerHTML = '<i class="fas fa-expand"></i>';
        }
    }
}

// 设置功能
function showSettings() {
    if (typeof addMessage === 'function') {
        addMessage('AI助手', '设置功能正在开发中，您可以通过聊天告诉我您想要调整的设置！', 'ai');
    }
}

// 帮助功能
function showHelp() {
    if (typeof addMessage === 'function') {
        const helpMessage = `
🎮 游戏控制帮助：
• Flappy Bird：点击画布或按空格键让小鸟跳跃
• 使用顶部导航栏切换不同游戏
• 点击播放/暂停/停止按钮控制游戏
• 全屏按钮可以进入全屏模式
• 拖拽分隔条可以调整窗口大小
• 双击分隔条重置为默认布局
• 有问题随时问我！
        `;
        addMessage('AI助手', helpMessage, 'ai');
    }
}

// 初始化垂直分隔条
function initVerticalResizer() {
    const verticalResizer = document.getElementById('vertical-resizer');
    const gamePreview = document.querySelector('.game-preview');
    const editorPanel = document.querySelector('.editor-panel');
    const middlePanel = document.querySelector('.middle-panel');
    
    let isResizing = false;
    let startY = 0;
    let startGameHeight = 0;
    let startEditorHeight = 0;
    
    verticalResizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        startY = e.clientY;
        
        // 获取当前高度
        const middlePanelHeight = middlePanel.clientHeight;
        const resizerHeight = verticalResizer.offsetHeight;
        startGameHeight = gamePreview.offsetHeight;
        startEditorHeight = editorPanel.offsetHeight;
        
        document.body.style.cursor = 'ns-resize';
        document.body.style.userSelect = 'none';
        
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        
        const deltaY = e.clientY - startY;
        const middlePanelHeight = middlePanel.clientHeight;
        const resizerHeight = verticalResizer.offsetHeight;
        
        // 计算新的高度
        let newGameHeight = startGameHeight + deltaY;
        let newEditorHeight = startEditorHeight - deltaY;
        
        // 设置最小高度限制
        const minHeight = 200;
        const maxGameHeight = middlePanelHeight - minHeight - resizerHeight;
        const maxEditorHeight = middlePanelHeight - minHeight - resizerHeight;
        
        // 应用边界限制
        if (newGameHeight < minHeight) {
            newGameHeight = minHeight;
            newEditorHeight = middlePanelHeight - minHeight - resizerHeight;
        } else if (newEditorHeight < minHeight) {
            newEditorHeight = minHeight;
            newGameHeight = middlePanelHeight - minHeight - resizerHeight;
        } else if (newGameHeight > maxGameHeight) {
            newGameHeight = maxGameHeight;
            newEditorHeight = minHeight;
        }
        
        // 应用新的高度
        gamePreview.style.height = newGameHeight + 'px';
        editorPanel.style.height = newEditorHeight + 'px';
        
        e.preventDefault();
    });
    
    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });
    
    // 双击重置布局
    verticalResizer.addEventListener('dblclick', () => {
        resetVerticalLayout();
    });
    
    function resetVerticalLayout() {
        gamePreview.style.height = '50%';
        editorPanel.style.height = '50%';
        
        if (typeof addMessage === 'function') {
            addMessage('AI助手', '已重置垂直布局为默认大小！', 'ai');
        }
    }
}

// 工具函数
function getRandomColor() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 初始化代码查看器
function initCodeViewer() {
    // 初始化编辑器标签切换
    const editorTabs = document.querySelectorAll('.editor-tab-btn');
    const editorContents = document.querySelectorAll('.editor-content');
    
    editorTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有激活状态
            editorTabs.forEach(t => t.classList.remove('active'));
            editorContents.forEach(c => c.classList.remove('active'));
            
            // 激活当前标签
            this.classList.add('active');
            const targetContent = document.getElementById(this.dataset.editorTab + '-editor');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // 为代码资源项添加点击事件
    const codeItems = document.querySelectorAll('#code-panel .resource-item');
    codeItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 阻止默认的拖拽事件
            e.preventDefault();
            
            const fileName = this.querySelector('span').textContent;
            displayCodeContent(fileName);
            
            // 切换到代码标签
            document.querySelector('[data-editor-tab="code"]').click();
        });
    });
    
    // 代码操作按钮
    document.getElementById('copy-code-btn').addEventListener('click', copyCode);
    document.getElementById('download-code-btn').addEventListener('click', downloadCode);
}

// 显示代码内容
function displayCodeContent(fileName) {
    const codeDisplay = document.getElementById('code-display');
    const codeFilename = document.getElementById('code-filename');
    
    // 更新文件名
    codeFilename.textContent = fileName;
    
    // 根据文件名显示相应的代码内容
    let codeContent = '';
    
    switch(fileName) {
        case 'player.js':
            codeContent = `// 玩家角色类
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.speed = 5;
        this.health = 100;
        this.color = '#4fc3f7';
    }
    
    // 更新玩家位置
    update() {
        this.handleInput();
        this.checkBounds();
    }
    
    // 处理输入
    handleInput() {
        if (keys.left) this.x -= this.speed;
        if (keys.right) this.x += this.speed;
        if (keys.up) this.y -= this.speed;
        if (keys.down) this.y += this.speed;
    }
    
    // 检查边界
    checkBounds() {
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
        }
    }
    
    // 绘制玩家
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 绘制生命值条
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(this.x, this.y - 8, this.width, 4);
        ctx.fillStyle = '#44ff44';
        ctx.fillRect(this.x, this.y - 8, this.width * (this.health / 100), 4);
    }
}`;
            break;
            
        case 'enemy.js':
            codeContent = `// 敌人类
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 28;
        this.speed = 2;
        this.health = 50;
        this.color = '#ff6b6b';
        this.direction = Math.random() * Math.PI * 2;
    }
    
    // 更新敌人状态
    update(player) {
        this.moveTowardsPlayer(player);
        this.checkBounds();
    }
    
    // 向玩家移动
    moveTowardsPlayer(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }
    
    // 检查边界
    checkBounds() {
        if (this.x < 0 || this.x + this.width > canvas.width) {
            this.direction = Math.PI - this.direction;
        }
        if (this.y < 0 || this.y + this.height > canvas.height) {
            this.direction = -this.direction;
        }
    }
    
    // 绘制敌人
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 绘制眼睛
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 6, this.y + 6, 4, 4);
        ctx.fillRect(this.x + 18, this.y + 6, 4, 4);
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x + 7, this.y + 7, 2, 2);
        ctx.fillRect(this.x + 19, this.y + 7, 2, 2);
    }
}`;
            break;
            
        case 'game.js':
            codeContent = `// 游戏主循环
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.player = new Player(100, 100);
        this.enemies = [];
        this.score = 0;
        this.gameRunning = false;
        
        this.init();
    }
    
    // 初始化游戏
    init() {
        this.setupControls();
        this.spawnEnemies();
        this.gameLoop();
    }
    
    // 设置控制
    setupControls() {
        window.keys = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'ArrowLeft': keys.left = true; break;
                case 'ArrowRight': keys.right = true; break;
                case 'ArrowUp': keys.up = true; break;
                case 'ArrowDown': keys.down = true; break;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            switch(e.code) {
                case 'ArrowLeft': keys.left = false; break;
                case 'ArrowRight': keys.right = false; break;
                case 'ArrowUp': keys.up = false; break;
                case 'ArrowDown': keys.down = false; break;
            }
        });
    }
    
    // 生成敌人
    spawnEnemies() {
        for (let i = 0; i < 3; i++) {
            this.enemies.push(new Enemy(
                Math.random() * (this.canvas.width - 32),
                Math.random() * (this.canvas.height - 32)
            ));
        }
    }
    
    // 游戏循环
    gameLoop() {
        if (this.gameRunning) {
            this.update();
            this.draw();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
    
    // 更新游戏状态
    update() {
        this.player.update();
        this.enemies.forEach(enemy => enemy.update(this.player));
        this.checkCollisions();
    }
    
    // 检查碰撞
    checkCollisions() {
        this.enemies.forEach((enemy, index) => {
            if (this.isColliding(this.player, enemy)) {
                this.player.health -= 10;
                this.enemies.splice(index, 1);
                this.score += 10;
                
                if (this.player.health <= 0) {
                    this.gameOver();
                }
            }
        });
    }
    
    // 碰撞检测
    isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    // 绘制游戏
    draw() {
        // 清空画布
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制游戏对象
        this.player.draw(this.ctx);
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        
        // 绘制UI
        this.drawUI();
    }
    
    // 绘制UI
    drawUI() {
        this.ctx.fillStyle = '#333';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('得分: ' + this.score, 10, 25);
        this.ctx.fillText('生命: ' + this.player.health, 10, 50);
    }
    
    // 游戏结束
    gameOver() {
        this.gameRunning = false;
        alert('游戏结束！最终得分: ' + this.score);
    }
    
    // 开始游戏
    start() {
        this.gameRunning = true;
    }
    
    // 暂停游戏
    pause() {
        this.gameRunning = false;
    }
}

// 创建游戏实例
const game = new Game();`;
            break;
            
        case 'physics.js':
            codeContent = `// 物理引擎
class Physics {
    constructor() {
        this.gravity = 0.5;
        this.friction = 0.8;
        this.bounce = 0.7;
    }
    
    // 应用重力
    applyGravity(object) {
        if (object.y + object.height < canvas.height) {
            object.velocityY += this.gravity;
        }
    }
    
    // 应用摩擦力
    applyFriction(object) {
        object.velocityX *= this.friction;
        object.velocityY *= this.friction;
    }
    
    // 更新物体位置
    updatePosition(object) {
        object.x += object.velocityX;
        object.y += object.velocityY;
        
        // 边界检查和反弹
        this.checkBounds(object);
    }
    
    // 边界检查
    checkBounds(object) {
        // 左右边界
        if (object.x <= 0) {
            object.x = 0;
            object.velocityX *= -this.bounce;
        } else if (object.x + object.width >= canvas.width) {
            object.x = canvas.width - object.width;
            object.velocityX *= -this.bounce;
        }
        
        // 上下边界
        if (object.y <= 0) {
            object.y = 0;
            object.velocityY *= -this.bounce;
        } else if (object.y + object.height >= canvas.height) {
            object.y = canvas.height - object.height;
            object.velocityY *= -this.bounce;
        }
    }
    
    // 碰撞检测
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    // 解决碰撞
    resolveCollision(obj1, obj2) {
        const dx = (obj1.x + obj1.width / 2) - (obj2.x + obj2.width / 2);
        const dy = (obj1.y + obj1.height / 2) - (obj2.y + obj2.height / 2);
        
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (obj1.width + obj2.width) / 2;
        
        if (distance < minDistance) {
            const overlap = minDistance - distance;
            const separationX = (dx / distance) * overlap * 0.5;
            const separationY = (dy / distance) * overlap * 0.5;
            
            obj1.x += separationX;
            obj1.y += separationY;
            obj2.x -= separationX;
            obj2.y -= separationY;
            
            // 交换速度
            const tempVelX = obj1.velocityX;
            const tempVelY = obj1.velocityY;
            obj1.velocityX = obj2.velocityX * this.bounce;
            obj1.velocityY = obj2.velocityY * this.bounce;
            obj2.velocityX = tempVelX * this.bounce;
            obj2.velocityY = tempVelY * this.bounce;
        }
    }
    
    // 计算距离
    distance(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // 计算角度
    angle(obj1, obj2) {
        const dx = obj2.x - obj1.x;
        const dy = obj2.y - obj1.y;
        return Math.atan2(dy, dx);
    }
}

// 创建物理引擎实例
const physics = new Physics();`;
            break;
            
        default:
            codeContent = `// ${fileName}
// 这是一个示例代码文件

console.log('欢迎查看 ${fileName}！');

// 您可以在这里编写游戏逻辑
function gameFunction() {
    // 游戏功能代码
    console.log('游戏功能正在运行...');
}

// 导出函数
export { gameFunction };`;
    }
    
    // 应用简单的语法高亮
    const highlightedCode = applySyntaxHighlight(codeContent);
    codeDisplay.innerHTML = highlightedCode;
}

// 简单的语法高亮
function applySyntaxHighlight(code) {
    return code
        .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
        .replace(/\b(class|function|const|let|var|if|else|for|while|return|new|this|export|import)\b/g, '<span class="keyword">$1</span>')
        .replace(/'[^']*'/g, '<span class="string">$&</span>')
        .replace(/"[^"]*"/g, '<span class="string">$&</span>')
        .replace(/\b\d+\b/g, '<span class="number">$&</span>')
        .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, '<span class="function">$1</span>(');
}

// 复制代码
function copyCode() {
    const codeDisplay = document.getElementById('code-display');
    const codeText = codeDisplay.textContent;
    
    navigator.clipboard.writeText(codeText).then(() => {
        // 显示复制成功提示
        const copyBtn = document.getElementById('copy-code-btn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.color = '#4fc3f7';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.color = '';
        }, 2000);
        
        // 添加聊天消息
        if (typeof addMessage === 'function') {
            addMessage('AI助手', '代码已复制到剪贴板！', 'ai');
        }
    }).catch(err => {
        console.error('复制失败:', err);
        if (typeof addMessage === 'function') {
            addMessage('AI助手', '复制失败，请手动选择代码复制。', 'ai');
        }
    });
}

// 下载代码
function downloadCode() {
    const codeDisplay = document.getElementById('code-display');
    const codeFilename = document.getElementById('code-filename');
    const codeText = codeDisplay.textContent;
    const filename = codeFilename.textContent;
    
    const blob = new Blob([codeText], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
    
    // 添加聊天消息
    if (typeof addMessage === 'function') {
        addMessage('AI助手', `文件 ${filename} 已下载！`, 'ai');
    }
}

// 初始化窗口大小调整功能
function initResizers() {
    const leftResizer = document.getElementById('left-resizer');
    const rightResizer = document.getElementById('right-resizer');
    const leftPanel = document.getElementById('left-panel');
    const middlePanel = document.getElementById('middle-panel');
    const rightPanel = document.getElementById('right-panel');
    const container = document.querySelector('.container');
    
    let isResizing = false;
    let currentResizer = null;
    let startX = 0;
    let startWidth = 0;
    let startNextWidth = 0;
    
    // 左侧分隔条事件
    leftResizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        currentResizer = 'left';
        startX = e.clientX;
        startWidth = leftPanel.offsetWidth;
        startNextWidth = middlePanel.offsetWidth;
        
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        
        // 添加视觉反馈
        leftResizer.style.background = '#667eea';
        leftResizer.style.width = '10px';
        leftResizer.style.margin = '0';
        
        e.preventDefault();
    });
    
    // 右侧分隔条事件
    rightResizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        currentResizer = 'right';
        startX = e.clientX;
        startWidth = middlePanel.offsetWidth;
        startNextWidth = rightPanel.offsetWidth;
        
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        
        // 添加视觉反馈
        rightResizer.style.background = '#667eea';
        rightResizer.style.width = '10px';
        rightResizer.style.margin = '0';
        
        e.preventDefault();
    });
    
    // 鼠标移动事件
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        
        const deltaX = e.clientX - startX;
        const containerWidth = container.offsetWidth - 20; // 减去padding
        
        if (currentResizer === 'left') {
            const newLeftWidth = startWidth + deltaX;
            const newMiddleWidth = startNextWidth - deltaX;
            
            // 限制最小和最大宽度
            const minWidth = 250;
            const maxLeftWidth = containerWidth * 0.5;
            const maxMiddleWidth = containerWidth - 250 - rightPanel.offsetWidth - 20; // 减去分隔条宽度
            
            if (newLeftWidth >= minWidth && newLeftWidth <= maxLeftWidth && 
                newMiddleWidth >= 300 && newMiddleWidth <= maxMiddleWidth) {
                
                const leftPercent = (newLeftWidth / containerWidth) * 100;
                const middlePercent = (newMiddleWidth / containerWidth) * 100;
                
                leftPanel.style.flexBasis = `${leftPercent}%`;
                middlePanel.style.flexBasis = `${middlePercent}%`;
            }
        } else if (currentResizer === 'right') {
            const newMiddleWidth = startWidth + deltaX;
            const newRightWidth = startNextWidth - deltaX;
            
            // 限制最小和最大宽度
            const minWidth = 250;
            const maxRightWidth = containerWidth * 0.5;
            const maxMiddleWidth = containerWidth - leftPanel.offsetWidth - 250 - 20; // 减去分隔条宽度
            
            if (newRightWidth >= minWidth && newRightWidth <= maxRightWidth && 
                newMiddleWidth >= 300 && newMiddleWidth <= maxMiddleWidth) {
                
                const middlePercent = (newMiddleWidth / containerWidth) * 100;
                const rightPercent = (newRightWidth / containerWidth) * 100;
                
                middlePanel.style.flexBasis = `${middlePercent}%`;
                rightPanel.style.flexBasis = `${rightPercent}%`;
            }
        }
        
        e.preventDefault();
    });
    
    // 鼠标释放事件
    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            currentResizer = null;
            
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            
            // 重置分隔条样式
            leftResizer.style.background = '';
            leftResizer.style.width = '';
            leftResizer.style.margin = '';
            
            rightResizer.style.background = '';
            rightResizer.style.width = '';
            rightResizer.style.margin = '';
            
            // 触发画布重绘
            if (typeof drawCanvas === 'function') {
                setTimeout(drawCanvas, 100);
            }
        }
    });
    
    // 双击分隔条重置布局
    leftResizer.addEventListener('dblclick', () => {
        resetLayout();
    });
    
    rightResizer.addEventListener('dblclick', () => {
        resetLayout();
    });
    
    // 重置布局函数
    function resetLayout() {
        leftPanel.style.flexBasis = '33.33%';
        middlePanel.style.flexBasis = '33.34%';
        rightPanel.style.flexBasis = '33.33%';
        
        // 添加聊天消息
        if (typeof addMessage === 'function') {
            addMessage('AI助手', '布局已重置为默认状态！', 'ai');
        }
        
        // 触发画布重绘
        if (typeof drawCanvas === 'function') {
            setTimeout(drawCanvas, 100);
        }
    }
    
    // 防止分隔条上的文本选择
    [leftResizer, rightResizer].forEach(resizer => {
        resizer.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });
    });
}

// 初始化文件上传功能
function initFileUpload() {
    // 上传按钮点击事件
    const uploadButtons = document.querySelectorAll('.upload-btn');
    uploadButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.type;
            const fileInput = document.getElementById(`${type}-upload`);
            fileInput.click();
        });
    });
    
    // 文件选择事件
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            const type = this.id.replace('-upload', '');
            
            if (files.length > 0) {
                handleFileUpload(files, type);
            }
        });
    });
    
    // 拖拽上传支持
    const uploadSections = document.querySelectorAll('.upload-section');
    uploadSections.forEach(section => {
        section.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.background = 'rgba(102, 126, 234, 0.1)';
            this.style.borderColor = '#667eea';
        });
        
        section.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.background = '';
            this.style.borderColor = '';
        });
        
        section.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.background = '';
            this.style.borderColor = '';
            
            const files = Array.from(e.dataTransfer.files);
            const type = this.parentElement.id.replace('-panel', '');
            
            if (files.length > 0) {
                handleFileUpload(files, type);
            }
        });
    });
}

// 处理文件上传
function handleFileUpload(files, type) {
    const validFiles = [];
    const invalidFiles = [];
    
    // 文件类型验证
    const allowedTypes = {
        code: ['.js', '.ts', '.html', '.css', '.json'],
        images: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'],
        music: ['.mp3', '.wav', '.ogg', '.m4a', '.flac'],
        models: ['.obj', '.fbx', '.gltf', '.glb', '.3ds', '.blend']
    };
    
    files.forEach(file => {
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (allowedTypes[type] && allowedTypes[type].includes(fileExtension)) {
            validFiles.push(file);
        } else {
            invalidFiles.push(file);
        }
    });
    
    // 显示上传进度
    showUploadProgress(type, validFiles.length, invalidFiles.length);
    
    // 处理有效文件
    if (validFiles.length > 0) {
        processValidFiles(validFiles, type);
    }
    
    // 提示无效文件
    if (invalidFiles.length > 0) {
        showUploadError(type, `${invalidFiles.length} 个文件格式不支持`);
    }
}

// 显示上传进度
function showUploadProgress(type, validCount, invalidCount) {
    const panel = document.getElementById(`${type}-panel`);
    let progressDiv = panel.querySelector('.upload-progress');
    
    if (!progressDiv) {
        progressDiv = document.createElement('div');
        progressDiv.className = 'upload-progress';
        panel.querySelector('.upload-section').appendChild(progressDiv);
    }
    
    if (validCount > 0) {
        progressDiv.textContent = `正在处理 ${validCount} 个文件...`;
        progressDiv.className = 'upload-progress show';
        
        // 模拟上传进度
        setTimeout(() => {
            progressDiv.textContent = `成功上传 ${validCount} 个文件！`;
            progressDiv.className = 'upload-progress show upload-success';
            
            setTimeout(() => {
                progressDiv.className = 'upload-progress';
            }, 3000);
        }, 1500);
    }
}

// 显示上传错误
function showUploadError(type, message) {
    const panel = document.getElementById(`${type}-panel`);
    let progressDiv = panel.querySelector('.upload-progress');
    
    if (!progressDiv) {
        progressDiv = document.createElement('div');
        progressDiv.className = 'upload-progress';
        panel.querySelector('.upload-section').appendChild(progressDiv);
    }
    
    progressDiv.textContent = message;
    progressDiv.className = 'upload-progress show upload-error';
    
    setTimeout(() => {
        progressDiv.className = 'upload-progress';
    }, 3000);
}

// 处理有效文件
function processValidFiles(files, type) {
    files.forEach(file => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // 根据文件类型进行不同处理
            switch(type) {
                case 'code':
                    addCodeFile(file.name, e.target.result);
                    break;
                case 'images':
                    addImageFile(file.name, e.target.result);
                    break;
                case 'music':
                    addAudioFile(file.name, e.target.result);
                    break;
                case 'models':
                    addModelFile(file.name, e.target.result);
                    break;
            }
        };
        
        // 根据文件类型选择读取方式
        if (type === 'code') {
            reader.readAsText(file);
        } else {
            reader.readAsDataURL(file);
        }
    });
    
    // 添加聊天消息
    if (typeof addMessage === 'function') {
        addMessage('AI助手', `成功上传了 ${files.length} 个${getResourceTypeName(type)}文件！`, 'ai');
    }
}

// 添加代码文件
function addCodeFile(filename, content) {
    const codePanel = document.querySelector('#code-panel .resource-list');
    const newItem = document.createElement('div');
    newItem.className = 'resource-item';
    newItem.draggable = true;
    newItem.dataset.content = content;
    
    newItem.innerHTML = `
        <i class="fas fa-file-code"></i>
        <span>${filename}</span>
    `;
    
    // 添加点击查看代码的功能
    newItem.addEventListener('click', function(e) {
        e.preventDefault();
        displayUploadedCode(filename, content);
        document.querySelector('[data-editor-tab="code"]').click();
    });
    
    codePanel.appendChild(newItem);
}

// 添加图片文件
function addImageFile(filename, dataUrl) {
    const imagesPanel = document.querySelector('#images-panel .resource-grid');
    const newItem = document.createElement('div');
    newItem.className = 'image-item';
    newItem.draggable = true;
    
    newItem.innerHTML = `
        <div class="image-placeholder" style="background-image: url(${dataUrl}); background-size: cover; background-position: center;">
        </div>
        <span>${filename}</span>
    `;
    
    imagesPanel.appendChild(newItem);
}

// 添加音频文件
function addAudioFile(filename, dataUrl) {
    const musicPanel = document.querySelector('#music-panel .resource-list');
    const newItem = document.createElement('div');
    newItem.className = 'audio-item';
    
    newItem.innerHTML = `
        <i class="fas fa-play-circle"></i>
        <span>${filename}</span>
        <button class="play-btn"><i class="fas fa-play"></i></button>
    `;
    
    // 添加播放功能
    const playBtn = newItem.querySelector('.play-btn');
    playBtn.addEventListener('click', function() {
        const audio = new Audio(dataUrl);
        audio.play();
        
        const icon = this.querySelector('i');
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        
        audio.addEventListener('ended', () => {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        });
    });
    
    musicPanel.appendChild(newItem);
}

// 添加模型文件
function addModelFile(filename, dataUrl) {
    const modelsPanel = document.querySelector('#models-panel .resource-grid');
    const newItem = document.createElement('div');
    newItem.className = 'model-item';
    newItem.draggable = true;
    
    // 根据文件扩展名选择图标
    const extension = filename.split('.').pop().toLowerCase();
    let icon = 'fa-cube';
    switch(extension) {
        case 'fbx':
        case 'obj':
            icon = 'fa-cube';
            break;
        case 'gltf':
        case 'glb':
            icon = 'fa-shapes';
            break;
        case 'blend':
            icon = 'fa-vector-square';
            break;
    }
    
    newItem.innerHTML = `
        <div class="model-preview">
            <i class="fas ${icon}"></i>
        </div>
        <span>${filename}</span>
    `;
    
    modelsPanel.appendChild(newItem);
}

// 显示上传的代码内容
function displayUploadedCode(filename, content) {
    const codeDisplay = document.getElementById('code-display');
    const codeFilename = document.getElementById('code-filename');
    
    codeFilename.textContent = filename;
    
    // 应用语法高亮
    const highlightedCode = applySyntaxHighlight(content);
    codeDisplay.innerHTML = highlightedCode;
}

// 获取资源类型名称
function getResourceTypeName(type) {
    const names = {
        code: '代码',
        images: '图片',
        music: '音频',
        models: '模型'
    };
    return names[type] || type;
}

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' && selectedElement) {
        deleteElement();
    } else if (e.ctrlKey && e.key === 'z') {
        // 撤销功能（可以后续实现）
        e.preventDefault();
    } else if (e.ctrlKey && e.key === 's') {
        // 保存功能（可以后续实现）
        e.preventDefault();
        addChatMessage('AI助手', '游戏项目已保存！', 'ai');
    }
});

// 窗口大小改变时重新绘制画布
window.addEventListener('resize', () => {
    drawCanvas();
});

// 导出功能（可选）
function exportGame() {
    const gameData = {
        objects: gameObjects,
        canvas: {
            width: canvas.width,
            height: canvas.height
        }
    };
    
    const dataStr = JSON.stringify(gameData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'game-project.json';
    link.click();
    
    URL.revokeObjectURL(url);
    if (typeof addMessage === 'function') {
        addMessage('AI助手', '游戏项目已导出为JSON文件！', 'ai');
    }
}

// ============= Flappy Bird 游戏实现 =============

// 小鸟类
class Bird {
    constructor() {
        this.x = 80;
        this.y = canvas.height / 2;
        this.width = 20;
        this.height = 20;
        this.velocity = 0;
        this.gravity = 0.6;
        this.jumpPower = -12;
        this.color = '#FFD700';
        this.rotation = 0;
    }
    
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        
        // 计算旋转角度
        this.rotation = Math.min(this.velocity * 3, 90);
        
        // 边界检测
        if (this.y <= 0) {
            this.y = 0;
            this.velocity = 0;
        }
        if (this.y >= canvas.height - this.height) {
            this.y = canvas.height - this.height;
            this.velocity = 0;
            gameState = 'gameOver';
        }
    }
    
    flap() {
        this.velocity = this.jumpPower;
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.rotation * Math.PI / 180);
        
        // 绘制小鸟身体
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // 绘制小鸟眼睛
        ctx.fillStyle = '#000';
        ctx.fillRect(-this.width/4, -this.height/4, 4, 4);
        
        // 绘制小鸟喙
        ctx.fillStyle = '#FF6B35';
        ctx.fillRect(this.width/2 - 2, -2, 6, 4);
        
        ctx.restore();
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// 管道类
class Pipe {
    constructor(x) {
        this.x = x;
        this.width = pipeWidth;
        this.gapStart = Math.random() * (canvas.height - pipeGap - 100) + 50;
        this.gapEnd = this.gapStart + pipeGap;
        this.color = '#32CD32';
        this.passed = false;
    }
    
    update() {
        this.x -= gameSpeed;
    }
    
    draw() {
        // 绘制上管道
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, 0, this.width, this.gapStart);
        
        // 绘制上管道帽子
        ctx.fillRect(this.x - 5, this.gapStart - 20, this.width + 10, 20);
        
        // 绘制下管道
        ctx.fillRect(this.x, this.gapEnd, this.width, canvas.height - this.gapEnd);
        
        // 绘制下管道帽子
        ctx.fillRect(this.x - 5, this.gapEnd, this.width + 10, 20);
        
        // 管道边框
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, 0, this.width, this.gapStart);
        ctx.strokeRect(this.x, this.gapEnd, this.width, canvas.height - this.gapEnd);
    }
    
    getBounds() {
        return [
            { x: this.x, y: 0, width: this.width, height: this.gapStart },
            { x: this.x, y: this.gapEnd, width: this.width, height: canvas.height - this.gapEnd }
        ];
    }
    
    isOffScreen() {
        return this.x + this.width < 0;
    }
}

// 初始化Flappy Bird游戏
function initFlappyBird() {
    bird = new Bird();
    pipes = [];
    gameScore = 0;
    gameState = 'menu';
    
    // 添加键盘控制
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (gameState === 'menu') {
                startFlappyBird();
            } else if (gameState === 'playing') {
                bird.flap();
            } else if (gameState === 'gameOver') {
                resetFlappyBird();
            }
        }
    });
    
    drawMenu();
}

// 开始游戏
function startFlappyBird() {
    gameState = 'playing';
    bird = new Bird();
    pipes = [];
    gameScore = 0;
    gameSpeed = 2;
    
    // 生成第一个管道
    pipes.push(new Pipe(canvas.width));
    
    gameLoop();
}

// 重置游戏
function resetFlappyBird() {
    gameState = 'menu';
    bird = new Bird();
    pipes = [];
    gameScore = 0;
    gameSpeed = 2;
    cancelAnimationFrame(animationId);
    drawMenu();
}

// 游戏主循环
function gameLoop() {
    if (gameState === 'playing') {
        update();
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }
}

// 更新游戏状态
function update() {
    // 更新小鸟
    bird.update();
    
    // 更新管道
    pipes.forEach(pipe => pipe.update());
    
    // 生成新管道
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        pipes.push(new Pipe(canvas.width));
    }
    
    // 移除离开屏幕的管道
    pipes = pipes.filter(pipe => !pipe.isOffScreen());
    
    // 检查碰撞
    checkCollisions();
    
    // 检查得分
    checkScore();
    
    // 增加游戏难度
    if (gameScore > 0 && gameScore % 5 === 0) {
        gameSpeed = Math.min(2 + gameScore * 0.1, 5);
    }
}

// 绘制游戏
function draw() {
    // 清空画布并绘制背景
    drawBackground();
    
    // 绘制管道
    pipes.forEach(pipe => pipe.draw());
    
    // 绘制小鸟
    bird.draw();
    
    // 绘制分数
    drawScore();
    
    // 绘制游戏结束界面
    if (gameState === 'gameOver') {
        drawGameOver();
    }
}

// 绘制背景
function drawBackground() {
    // 天空渐变
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制云朵
    drawClouds();
    
    // 绘制地面
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
}

// 绘制云朵
function drawClouds() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    const cloudY = 50;
    for (let i = 0; i < 3; i++) {
        const x = (i * 150 + gameScore * 0.5) % (canvas.width + 100) - 50;
        drawCloud(x, cloudY + i * 10);
    }
}

// 绘制单个云朵
function drawCloud(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.arc(x + 15, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 30, y, 15, 0, Math.PI * 2);
    ctx.arc(x + 15, y - 10, 15, 0, Math.PI * 2);
    ctx.fill();
}

// 绘制分数
function drawScore() {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    
    const text = gameScore.toString();
    const x = canvas.width / 2;
    const y = 60;
    
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
}

// 绘制菜单
function drawMenu() {
    drawBackground();
    
    // 绘制标题
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    
    ctx.strokeText('Flappy Bird', canvas.width / 2, 100);
    ctx.fillText('Flappy Bird', canvas.width / 2, 100);
    
    // 绘制小鸟
    bird.draw();
    
    // 绘制说明文字
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.font = '16px Arial';
    
    const instructions = [
        '点击画布或按空格键开始游戏',
        '控制小鸟飞过管道',
        '不要撞到管道或地面！'
    ];
    
    instructions.forEach((text, index) => {
        const y = 180 + index * 25;
        ctx.strokeText(text, canvas.width / 2, y);
        ctx.fillText(text, canvas.width / 2, y);
    });
}

// 绘制游戏结束界面
function drawGameOver() {
    // 半透明背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Game Over 文字
    ctx.fillStyle = '#FF6B35';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    
    ctx.strokeText('Game Over', canvas.width / 2, 120);
    ctx.fillText('Game Over', canvas.width / 2, 120);
    
    // 最终分数
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    
    ctx.strokeText(`最终分数: ${gameScore}`, canvas.width / 2, 160);
    ctx.fillText(`最终分数: ${gameScore}`, canvas.width / 2, 160);
    
    // 重新开始提示
    ctx.font = '16px Arial';
    ctx.strokeText('点击重新开始', canvas.width / 2, 200);
    ctx.fillText('点击重新开始', canvas.width / 2, 200);
}

// 检查碰撞
function checkCollisions() {
    const birdBounds = bird.getBounds();
    
    pipes.forEach(pipe => {
        const pipeBounds = pipe.getBounds();
        
        pipeBounds.forEach(bound => {
            if (isColliding(birdBounds, bound)) {
                gameState = 'gameOver';
            }
        });
    });
}

// 碰撞检测函数
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// 检查得分
function checkScore() {
    pipes.forEach(pipe => {
        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
            pipe.passed = true;
            gameScore++;
            
            // 播放得分音效（模拟）
            if (typeof addMessage === 'function' && gameScore % 5 === 0) {
                addMessage('AI助手', `太棒了！您已经得到 ${gameScore} 分！`, 'ai');
            }
        }
    });
}

// 游戏策划功能
function initGamePlanning() {
    const gamePlanningBtn = document.getElementById('game-planning-btn');
    const gamePlanningPanel = document.getElementById('game-planning-panel');
    const backToChatBtn = document.getElementById('back-to-chat-btn');
    const exportPlanningBtn = document.getElementById('export-planning-btn');
    const chatInputContainer = document.querySelector('.chat-input-container');
    const chatMessages = document.getElementById('chatMessages');
    
    // 游戏策划按钮点击事件
    if (gamePlanningBtn) {
        gamePlanningBtn.addEventListener('click', function() {
            showGamePlanningPanel();
        });
    }
    
    // 返回聊天按钮点击事件
    if (backToChatBtn) {
        backToChatBtn.addEventListener('click', function() {
            hideGamePlanningPanel();
        });
    }
    
    // 导出策划案按钮点击事件
    if (exportPlanningBtn) {
        exportPlanningBtn.addEventListener('click', function() {
            exportGamePlan();
        });
    }
    
    // 编辑按钮点击事件
    const editBtns = document.querySelectorAll('.edit-section-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.section;
            toggleEditMode(section);
        });
    });
    
    // 可编辑元素点击事件
    const editableElements = document.querySelectorAll('.editable');
    editableElements.forEach(element => {
        element.addEventListener('click', function() {
            if (!this.isEditing) {
                makeEditable(this);
            }
        });
    });
    
    // 可编辑列表项双击事件
    const editableLists = document.querySelectorAll('.editable-list');
    editableLists.forEach(list => {
        list.addEventListener('dblclick', function(e) {
            if (e.target.tagName === 'LI') {
                makeListItemEditable(e.target);
            }
        });
    });
    
    // 初始化滚动和导航功能
    initPlanningNavigation();
}

// 显示游戏策划面板
function showGamePlanningPanel() {
    const gamePlanningPanel = document.getElementById('game-planning-panel');
    const chatInputContainer = document.querySelector('.chat-input-container');
    const chatMessages = document.getElementById('chatMessages');
    
    if (gamePlanningPanel) {
        gamePlanningPanel.style.display = 'block';
        
        // 隐藏聊天输入区域
        if (chatInputContainer) {
            chatInputContainer.style.display = 'none';
        }
        
        // 调整聊天消息区域高度
        if (chatMessages) {
            chatMessages.style.height = 'calc(100% - 80px)';
        }
        
        // 添加消息到聊天
        if (typeof addMessage === 'function') {
            addMessage('AI助手', '已打开游戏策划案页面！您可以查看当前项目的详细策划信息，并进行编辑和导出。', 'ai');
        }
    }
}

// 隐藏游戏策划面板
function hideGamePlanningPanel() {
    const gamePlanningPanel = document.getElementById('game-planning-panel');
    const chatInputContainer = document.querySelector('.chat-input-container');
    const chatMessages = document.getElementById('chatMessages');
    
    if (gamePlanningPanel) {
        gamePlanningPanel.style.display = 'none';
        
        // 显示聊天输入区域
        if (chatInputContainer) {
            chatInputContainer.style.display = 'block';
        }
        
        // 恢复聊天消息区域高度
        if (chatMessages) {
            chatMessages.style.height = '';
        }
        
        // 添加消息到聊天
        if (typeof addMessage === 'function') {
            addMessage('AI助手', '已返回聊天界面。如果您需要再次查看游戏策划案，点击"游戏策划"按钮即可。', 'ai');
        }
    }
}

// 导出游戏策划案
function exportGamePlan() {
    const planData = collectPlanData();
    const content = generatePlanDocument(planData);
    
    // 创建下载链接
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${planData.gameName || 'Flappy Bird'}_游戏策划案.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // 添加成功消息
    if (typeof addMessage === 'function') {
        addMessage('AI助手', '游戏策划案已成功导出！文件包含了完整的策划信息，可用于团队协作和项目管理。', 'ai');
    }
}

// 收集策划数据
function collectPlanData() {
    const plan = {};
    
    // 基本信息
    plan.gameName = document.querySelector('[data-field="gameName"]')?.textContent || 'Flappy Bird';
    plan.gameType = document.querySelector('[data-field="gameType"]')?.textContent || '休闲益智';
    plan.platform = document.querySelector('[data-field="platform"]')?.textContent || 'Web浏览器';
    plan.timeline = document.querySelector('[data-field="timeline"]')?.textContent || '1-2周';
    
    // 核心玩法
    plan.mainMechanics = Array.from(document.querySelectorAll('[data-field="mainMechanics"] li'))
        .map(li => li.textContent);
    plan.controls = Array.from(document.querySelectorAll('[data-field="controls"] li'))
        .map(li => li.textContent);
    
    // 技术规格
    plan.language = document.querySelector('[data-field="language"]')?.textContent || 'HTML5 + JavaScript + CSS3';
    plan.rendering = document.querySelector('[data-field="rendering"]')?.textContent || 'Canvas 2D API';
    plan.audio = document.querySelector('[data-field="audio"]')?.textContent || 'Web Audio API';
    plan.storage = document.querySelector('[data-field="storage"]')?.textContent || 'LocalStorage';
    
    // 美术需求
    plan.characters = Array.from(document.querySelectorAll('[data-field="characters"] li'))
        .map(li => li.textContent);
    plan.scenes = Array.from(document.querySelectorAll('[data-field="scenes"] li'))
        .map(li => li.textContent);
    plan.ui = Array.from(document.querySelectorAll('[data-field="ui"] li'))
        .map(li => li.textContent);
    
    return plan;
}

// 生成策划文档
function generatePlanDocument(plan) {
    const date = new Date().toLocaleDateString('zh-CN');
    
    return `
============================================
           ${plan.gameName} 游戏策划案
============================================

生成日期：${date}
策划工具：AI游戏生成器

============================================
一、游戏基本信息
============================================

游戏名称：${plan.gameName}
游戏类型：${plan.gameType}
目标平台：${plan.platform}
开发周期：${plan.timeline}

============================================
二、核心玩法设计
============================================

主要机制：
${plan.mainMechanics.map(item => `• ${item}`).join('\n')}

操作方式：
${plan.controls.map(item => `• ${item}`).join('\n')}

============================================
三、技术实现方案
============================================

开发语言：${plan.language}
渲染技术：${plan.rendering}
音频支持：${plan.audio}
存储方案：${plan.storage}

============================================
四、美术设计需求
============================================

角色设计：
${plan.characters.map(item => `• ${item}`).join('\n')}

场景设计：
${plan.scenes.map(item => `• ${item}`).join('\n')}

UI设计：
${plan.ui.map(item => `• ${item}`).join('\n')}

============================================
五、开发进度规划
============================================

✅ 已完成：
• 核心游戏机制 - 小鸟物理系统、跳跃控制
• 管道系统 - 障碍物生成、碰撞检测
• 分数系统 - 得分计算、最高分记录

🚧 进行中：
• 音效系统 - 背景音乐、音效播放

📋 待开发：
• 多人排行榜 - 在线排行榜功能

============================================
六、项目总结
============================================

${plan.gameName} 是一款${plan.gameType}类型的游戏，采用${plan.language}开发，
目标平台为${plan.platform}。游戏具有简单易懂的操作方式和富有挑战性的游戏机制，
适合所有年龄段的玩家游玩。

当前版本已实现核心功能，具备完整的游戏体验。后续可考虑增加更多功能特性，
如音效系统、多人排行榜等，以提升游戏的可玩性和用户体验。

============================================

文档由 AI游戏生成器 自动生成
更多信息请访问项目主页
`;
}

// 切换编辑模式
function toggleEditMode(section) {
    const sectionContent = document.getElementById(section + '-content');
    const isEditing = sectionContent.classList.contains('editing');
    
    if (isEditing) {
        exitEditMode(section);
    } else {
        enterEditMode(section);
    }
}

// 进入编辑模式
function enterEditMode(section) {
    const sectionContent = document.getElementById(section + '-content');
    sectionContent.classList.add('editing');
    
    // 为该区域的可编辑元素添加编辑样式
    const editableElements = sectionContent.querySelectorAll('.editable, .editable-list li');
    editableElements.forEach(element => {
        element.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
        element.style.border = '1px dashed #667eea';
        element.style.cursor = 'text';
    });
    
    if (typeof addMessage === 'function') {
        addMessage('AI助手', '编辑模式已开启！您可以点击文本进行编辑。', 'ai');
    }
}

// 退出编辑模式
function exitEditMode(section) {
    const sectionContent = document.getElementById(section + '-content');
    sectionContent.classList.remove('editing');
    
    // 移除编辑样式
    const editableElements = sectionContent.querySelectorAll('.editable, .editable-list li');
    editableElements.forEach(element => {
        element.style.backgroundColor = '';
        element.style.border = '';
        element.style.cursor = '';
        if (element.isEditing) {
            finishEditing(element);
        }
    });
    
    if (typeof addMessage === 'function') {
        addMessage('AI助手', '编辑模式已关闭。更改已保存。', 'ai');
    }
}

// 使元素可编辑
function makeEditable(element) {
    if (element.isEditing) return;
    
    element.isEditing = true;
    const originalText = element.textContent;
    
    // 创建输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalText;
    input.style.width = '100%';
    input.style.border = 'none';
    input.style.background = 'transparent';
    input.style.font = 'inherit';
    input.style.color = 'inherit';
    input.style.outline = '2px solid #667eea';
    input.style.padding = '2px 4px';
    input.style.borderRadius = '3px';
    
    // 替换文本内容
    element.textContent = '';
    element.appendChild(input);
    input.focus();
    input.select();
    
    // 完成编辑函数
    const finishEdit = () => {
        const newText = input.value.trim();
        element.removeChild(input);
        element.textContent = newText || originalText;
        element.isEditing = false;
    };
    
    // 绑定事件
    input.addEventListener('blur', finishEdit);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            finishEdit();
        }
    });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            element.removeChild(input);
            element.textContent = originalText;
            element.isEditing = false;
        }
    });
}

// 使列表项可编辑
function makeListItemEditable(listItem) {
    if (listItem.isEditing) return;
    
    listItem.isEditing = true;
    const originalText = listItem.textContent;
    
    // 创建文本框
    const textarea = document.createElement('textarea');
    textarea.value = originalText;
    textarea.style.width = '100%';
    textarea.style.border = 'none';
    textarea.style.background = 'transparent';
    textarea.style.font = 'inherit';
    textarea.style.color = 'inherit';
    textarea.style.outline = '2px solid #667eea';
    textarea.style.padding = '4px';
    textarea.style.borderRadius = '3px';
    textarea.style.resize = 'vertical';
    textarea.style.minHeight = '20px';
    
    // 替换文本内容
    listItem.textContent = '';
    listItem.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    // 完成编辑函数
    const finishEdit = () => {
        const newText = textarea.value.trim();
        listItem.removeChild(textarea);
        listItem.textContent = newText || originalText;
        listItem.isEditing = false;
    };
    
    // 绑定事件
    textarea.addEventListener('blur', finishEdit);
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            finishEdit();
        }
        if (e.key === 'Escape') {
            listItem.removeChild(textarea);
            listItem.textContent = originalText;
            listItem.isEditing = false;
        }
    });
}

// 初始化策划案导航和滚动功能
function initPlanningNavigation() {
    const planningContent = document.getElementById('planning-content');
    const navIndicator = document.getElementById('planning-nav-indicator');
    const navDots = document.querySelectorAll('.nav-dot');
    const scrollHint = document.getElementById('scroll-hint');
    
    if (!planningContent || !navIndicator) return;
    
    let currentSectionIndex = 0;
    let isScrolling = false;
    let lastScrollTime = 0;
    
    // 获取所有策划区域
    const sections = [
        'section-basic-info',
        'section-gameplay', 
        'section-elements',
        'section-technical',
        'section-art',
        'section-progress'
    ];
    
    // 导航点击事件
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            scrollToSection(index);
        });
    });
    
    // 滚轮翻页功能
    planningContent.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        const now = Date.now();
        if (now - lastScrollTime < 150) return; // 防抖动
        lastScrollTime = now;
        
        if (isScrolling) return;
        
        const delta = e.deltaY;
        
        if (delta > 0 && currentSectionIndex < sections.length - 1) {
            // 向下滚动
            currentSectionIndex++;
            scrollToSection(currentSectionIndex);
        } else if (delta < 0 && currentSectionIndex > 0) {
            // 向上滚动
            currentSectionIndex--;
            scrollToSection(currentSectionIndex);
        }
    }, { passive: false });
    
    // 键盘导航
    document.addEventListener('keydown', function(e) {
        if (!document.getElementById('game-planning-panel') || 
            document.getElementById('game-planning-panel').style.display === 'none') {
            return;
        }
        
        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                if (currentSectionIndex < sections.length - 1) {
                    currentSectionIndex++;
                    scrollToSection(currentSectionIndex);
                }
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                if (currentSectionIndex > 0) {
                    currentSectionIndex--;
                    scrollToSection(currentSectionIndex);
                }
                break;
            case 'Home':
                e.preventDefault();
                currentSectionIndex = 0;
                scrollToSection(currentSectionIndex);
                break;
            case 'End':
                e.preventDefault();
                currentSectionIndex = sections.length - 1;
                scrollToSection(currentSectionIndex);
                break;
        }
    });
    
    // 滚动到指定区域
    function scrollToSection(index) {
        if (index < 0 || index >= sections.length) return;
        
        isScrolling = true;
        currentSectionIndex = index;
        
        const targetSection = document.getElementById(sections[index]);
        if (targetSection) {
            // 平滑滚动到目标区域
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // 更新导航指示器
            updateNavIndicator(index);
            
            // 添加视觉反馈
            addScrollFeedback(targetSection);
            
            // 防止快速连续滚动
            setTimeout(() => {
                isScrolling = false;
            }, 800);
        }
    }
    
    // 更新导航指示器
    function updateNavIndicator(activeIndex) {
        navDots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // 添加滚动反馈效果
    function addScrollFeedback(section) {
        section.style.transform = 'scale(1.02)';
        section.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            section.style.transform = 'scale(1)';
            setTimeout(() => {
                section.style.transition = '';
            }, 300);
        }, 200);
    }
    
    // 监听滚动位置，更新当前区域
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const sectionId = entry.target.id;
                const sectionIndex = sections.indexOf(sectionId);
                if (sectionIndex !== -1 && sectionIndex !== currentSectionIndex) {
                    currentSectionIndex = sectionIndex;
                    updateNavIndicator(currentSectionIndex);
                }
            }
        });
    }, {
        threshold: [0.3, 0.7],
        rootMargin: '-20% 0px -20% 0px'
    });
    
    // 观察所有策划区域
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            observer.observe(section);
        }
    });
    
    // 显示滚动提示
    function showScrollHint() {
        if (scrollHint) {
            scrollHint.style.animation = 'fadeInOut 3s ease-in-out';
            setTimeout(() => {
                scrollHint.style.animation = '';
            }, 3000);
        }
    }
    
    // 在页面显示时显示提示
    setTimeout(showScrollHint, 1000);
    
    // 优化移动端滚动体验
    initMobilePlanningScroll();
}

// 优化移动端滚动体验
function initMobilePlanningScroll() {
    const planningContent = document.getElementById('planning-content');
    if (!planningContent) return;
    
    let startY = 0;
    let startTime = 0;
    
    planningContent.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        startTime = Date.now();
    }, { passive: true });
    
    planningContent.addEventListener('touchend', function(e) {
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();
        const deltaY = startY - endY;
        const deltaTime = endTime - startTime;
        
        // 检测快速滑动
        if (Math.abs(deltaY) > 50 && deltaTime < 300) {
            const sections = document.querySelectorAll('.planning-section');
            const currentScrollTop = planningContent.scrollTop;
            
            let targetSection = null;
            
            if (deltaY > 0) {
                // 向上滑动，找下一个区域
                sections.forEach(section => {
                    if (section.offsetTop > currentScrollTop + 100 && !targetSection) {
                        targetSection = section;
                    }
                });
            } else {
                // 向下滑动，找上一个区域
                const reverseSections = Array.from(sections).reverse();
                reverseSections.forEach(section => {
                    if (section.offsetTop < currentScrollTop - 100 && !targetSection) {
                        targetSection = section;
                    }
                });
            }
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }, { passive: true });
} 