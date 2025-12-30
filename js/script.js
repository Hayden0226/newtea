// 全局变量
const scrollbar = document.getElementById('imageScrollbar');
const thumbnails = document.querySelectorAll('.thumbnail');
const selectedImage = document.getElementById('selectedImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const prevPageBtn = document.getElementById('prevPageBtn');
const pages = document.querySelectorAll('.page');
const shareBtn = document.getElementById('shareBtn');
const shareTip = document.getElementById('shareTip');
let scrollDistance;
let currentPage = 1;

// 初始化滚动距离
function initScrollDistance() {
    if (thumbnails.length > 0) {
        const thumbnailWidth = thumbnails[0].offsetWidth;
        const gap = 15;
        scrollDistance = thumbnailWidth + gap;
        updateButtonStates();
    }
}

// 更新按钮状态
function updateButtonStates() {
    if (!scrollbar) return;

    const scrollLeft = scrollbar.scrollLeft;
    const scrollWidth = scrollbar.scrollWidth;
    const clientWidth = scrollbar.clientWidth;

    // 更新左按钮状态
    prevBtn.disabled = scrollLeft <= 0;
    prevBtn.style.opacity = scrollLeft <= 0 ? '0.3' : '1';

    // 更新右按钮状态
    nextBtn.disabled = scrollLeft + clientWidth >= scrollWidth;
    nextBtn.style.opacity = scrollLeft + clientWidth >= scrollWidth ? '0.3' : '1';
}

// 选择图片
function selectImage(thumb) {
    thumbnails.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    selectedImage.src = thumb.querySelector('img').src;

    // 移动端触摸反馈
    thumb.style.transform = 'scale(0.95)';
    setTimeout(() => {
        thumb.style.transform = '';
    }, 150);
}

// 向左滚动
function scrollLeft() {
    if (scrollDistance && !prevBtn.disabled) {
        scrollbar.scrollBy({
            left: -scrollDistance,
            behavior: 'smooth'
        });

        setTimeout(updateButtonStates, 300);
    }
}

// 向右滚动
function scrollRight() {
    if (scrollDistance && !nextBtn.disabled) {
        scrollbar.scrollBy({
            left: scrollDistance,
            behavior: 'smooth'
        });

        setTimeout(updateButtonStates, 300);
    }
}

// 切换到下一页
function goToNextPage() {
    if (currentPage < pages.length) {
        // 隐藏当前页面
        document.querySelector(`.page-${currentPage}`).classList.remove('active');

        // 显示下一页
        currentPage++;
        document.querySelector(`.page-${currentPage}`).classList.add('active');

        // 更新按钮状态
        updatePageButtons();
    }
}

// 切换到上一页
function goToPrevPage() {
    if (currentPage > 1) {
        // 隐藏当前页面
        document.querySelector(`.page-${currentPage}`).classList.remove('active');

        // 显示上一页
        currentPage--;
        document.querySelector(`.page-${currentPage}`).classList.add('active');

        // 更新按钮状态
        updatePageButtons();
    }
}

// 更新页面切换按钮状态
function updatePageButtons() {
    // 如果是第一页，隐藏上一页按钮
    if (currentPage === 1) {
        prevPageBtn.style.display = 'none';
    } else {
        prevPageBtn.style.display = 'flex';
    }

    // 如果是最后一页，隐藏下一页按钮
    if (currentPage === pages.length) {
        nextPageBtn.style.display = 'none';
    } else {
        nextPageBtn.style.display = 'flex';
    }
}

// 下载背景图片功能 - 优化版本（解决QQ浏览器问题）
function downloadBackgroundImage() {
    console.log('开始下载背景图片...');

    // 显示下载提示
    if (shareTip) {
        shareTip.innerHTML = '正在准备下载...';
        shareTip.classList.add('show');
    }

    // 方法1：使用Blob和URL.createObjectURL（推荐）
    function downloadWithBlob() {
        // 创建虚拟图片数据（base64格式）
        const createFallbackImage = () => {


            // 直接返回图片路径
            return 'images/分享.jpg';

            //后面懒得删了
            // 创建一个简单的占位图片
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');

            // 绘制简单背景
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, 400, 300);

            // 添加文字
            ctx.fillStyle = '#333';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('茶百戏分享背景图', 200, 150);
            ctx.font = '14px Arial';
            ctx.fillText('点击右上角菜单保存图片', 200, 180);

            return canvas.toDataURL('image/jpeg', 0.8);
        };

        // 尝试加载真实图片，失败时使用备用图片
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = function () {
            try {
                // 创建canvas来转换图片
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                // 转换为Blob
                canvas.toBlob(function (blob) {
                    const url = URL.createObjectURL(blob);
                    triggerDownload(url, '结尾分享背景图.jpg');
                }, 'image/jpeg', 0.8);

            } catch (error) {
                console.error('图片处理失败:', error);
                // 使用备用方案
                const fallbackUrl = createFallbackImage();
                triggerDownload(fallbackUrl, '结尾分享背景图.jpg');
            }
        };

        img.onerror = function () {
            console.warn('图片加载失败，使用备用图片');
            const fallbackUrl = createFallbackImage();
            triggerDownload(fallbackUrl, '结尾分享背景图.jpg');
        };

        // 修改路径：使用images文件夹中的图片
        img.src = 'images/结尾分享背景图.jpg';
    }

    // 触发下载的核心函数
    function triggerDownload(url, filename) {
        console.log('触发下载:', filename);

        // 更新提示
        if (shareTip) {
            shareTip.innerHTML = '正在下载...';
        }

        // 创建下载链接
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        // 添加到页面
        document.body.appendChild(link);

        // 方法1：直接点击（桌面端）
        if (typeof link.click === 'function') {
            try {
                link.click();
                console.log('方法1：直接点击成功');
                showSuccessMessage();
            } catch (error) {
                console.error('方法1失败:', error);
                tryMethod2(link, filename);
            }
        } else {
            tryMethod2(link, filename);
        }

        // 清理资源
        setTimeout(() => {
            if (link.parentNode) {
                document.body.removeChild(link);
            }
            if (url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        }, 1000);
    }

    // 方法2：创建事件（移动端兼容）
    function tryMethod2(link, filename) {
        console.log('尝试方法2...');
        try {
            const event = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            link.dispatchEvent(event);
            console.log('方法2：事件触发成功');
            showSuccessMessage();
        } catch (error) {
            console.error('方法2失败:', error);
            tryMethod3(filename);
        }
    }

    // 方法3：使用window.open（最后手段）
    function tryMethod3(filename) {
        console.log('尝试方法3...');
        try {
            // 在新窗口打开图片，让用户手动保存
            const imgWindow = window.open('', '_blank');
            imgWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${filename}</title>
                    <style>
                        body { margin: 0; padding: 20px; background: #f5f5f5; }
                        img { max-width: 100%; height: auto; border: 2px solid #ddd; }
                        .instruction { text-align: center; margin: 20px 0; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="instruction">长按图片 → 选择"保存图片"</div>
                    <img src="images/结尾分享背景图.jpg" alt="${filename}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiMzMzMiPui/meS4quWbvuWDj+Wkp+Wwj+W3peS9nDwvdGV4dD48L3N2Zz4='">
                </body>
                </html>
            `);

            showManualSaveMessage();
        } catch (error) {
            console.error('所有方法都失败:', error);
            showErrorMessage();
        }
    }

    // 显示成功消息
    function showSuccessMessage() {
        setTimeout(() => {
            if (shareTip) {
                shareTip.innerHTML = '✅ 下载成功！请检查下载文件夹';
                setTimeout(() => {
                    shareTip.classList.remove('show');
                }, 3000);
            }
        }, 1000);
    }

    // 显示手动保存提示
    function showManualSaveMessage() {
        setTimeout(() => {
            if (shareTip) {
                shareTip.innerHTML = '📱 已打开新页面，请长按图片保存';
                setTimeout(() => {
                    shareTip.classList.remove('show');
                }, 5000);
            }
        }, 1000);
    }

    // 显示错误消息
    function showErrorMessage() {
        setTimeout(() => {
            if (shareTip) {
                shareTip.innerHTML = '❌ 下载失败，请尝试其他浏览器';
                setTimeout(() => {
                    shareTip.classList.remove('show');
                }, 3000);
            }
        }, 1000);
    }

    // 开始下载流程
    downloadWithBlob();
}

// 触摸事件处理 - 优化版本
function handleTouchDownload(e) {
    e.preventDefault();

    // 触摸反馈
    if (shareBtn) {
        shareBtn.style.transform = 'scale(0.95)';
        shareBtn.style.transition = 'transform 0.2s ease';

        setTimeout(() => {
            shareBtn.style.transform = '';
            downloadBackgroundImage();
        }, 200);
    }
}

// 关闭分享提示
function closeShareTip() {
    if (shareTip) {
        shareTip.classList.remove('show');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    // 初始化滚动距离
    initScrollDistance();

    // 监听窗口大小变化
    window.addEventListener('resize', initScrollDistance);

    // 监听滚动条滚动事件
    if (scrollbar) {
        scrollbar.addEventListener('scroll', updateButtonStates);
    }

    // 绑定按钮事件
    if (prevBtn) {
        prevBtn.addEventListener('click', scrollLeft);
        prevBtn.addEventListener('touchstart', scrollLeft);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', scrollRight);
        nextBtn.addEventListener('touchstart', scrollRight);
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', goToNextPage);
        nextPageBtn.addEventListener('touchstart', goToNextPage);
    }

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', goToPrevPage);
        prevPageBtn.addEventListener('touchstart', goToPrevPage);
    }

    // 绑定分享按钮 - 改为下载功能
    if (shareBtn) {
        // 移除所有现有事件
        shareBtn.onclick = null;
        shareBtn.ontouchstart = null;

        // 绑定新事件
        shareBtn.addEventListener('click', downloadBackgroundImage);
        shareBtn.addEventListener('touchstart', handleTouchDownload);

        // 更新按钮文本
        shareBtn.innerHTML = '下载背景图';
        shareBtn.title = '点击下载"结尾分享背景图.jpg"';
    }

    // 图片弹窗功能
    const startupPopup = document.getElementById('startupPopup');

    // 启动应用
    function startApp() {
        // 淡出弹窗
        if (startupPopup) {
            startupPopup.style.opacity = '0';
            startupPopup.style.transform = 'translate(-50%, -50%) scale(0.8)';

            // 延迟隐藏弹窗
            setTimeout(() => {
                startupPopup.style.display = 'none';
            }, 300);
        }
    }

    // 点击图片关闭弹窗
    if (startupPopup) {
        startupPopup.addEventListener('click', startApp);

        // 触摸事件支持
        startupPopup.addEventListener('touchstart', function (e) {
            e.preventDefault();
            startApp();
        });
    }

    // 3秒后自动关闭弹窗（可选功能）
    // setTimeout(() => {
    //     if (startupPopup && startupPopup.style.display !== 'none') {
    //         startApp();
    //     }
    // }, 3000);

    // 初始化页面按钮状态
    updatePageButtons();
});

// 添加全局函数
window.closeShareTip = closeShareTip;
window.downloadBackgroundImage = downloadBackgroundImage;