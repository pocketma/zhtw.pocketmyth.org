// 国际站：下载地址（Android / iOS）
var PK_DOWNLOAD_LINKS = {
    android: 'https://hk.qu06.cn/pomy/?WS5W76WR',
    ios: 'https://hk.qu06.cn/gtpcsc/?WS5W76WR'
};

// 根据 UA 判断设备系统，返回 'android' / 'ios' / ''
function getPkPlatform() {
    var ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
    if (/Android/i.test(ua)) return 'android';
    return '';
}

// 下载入口：移动端直接跳对应下载页，PC 端弹窗选择系统
function showIntlDownloadDialog() {
    var platform = getPkPlatform();
    if (platform === 'android') {
        window.location.href = PK_DOWNLOAD_LINKS.android;
        return;
    }
    if (platform === 'ios') {
        window.location.href = PK_DOWNLOAD_LINKS.ios;
        return;
    }

    if (window.layer && layer.open) {
        var html = '<div class="pk-dl-box">'
            + '<p class="pk-dl-tip">请选择你的设备系统</p>'
            + '<div class="pk-dl-btns">'
            + '<a class="pk-dl-btn pk-dl-android" href="' + PK_DOWNLOAD_LINKS.android + '">Android 下载</a>'
            + '<a class="pk-dl-btn pk-dl-ios" href="' + PK_DOWNLOAD_LINKS.ios + '">iOS 下载</a>'
            + '</div></div>';
        layer.open({
            type: 1,
            title: false,
            closeBtn: 1,
            area: ['460px', 'auto'],
            shadeClose: true,
            content: html
        });
    } else {
        window.location.href = PK_DOWNLOAD_LINKS.android;
    }
}
function showIntlSupportDialog() {
    if (window.layer && layer.msg) {
        layer.msg('Support is coming soon.', { icon: 1, time: 2500 });
    } else {
        alert('Support is coming soon.');
    }
}

// 问题反馈跳转
var feedbackUrl = window.feedbackUrl; // 可以在此处配置具体的问题反馈链接
function goFeedback() {
    showIntlSupportDialog();
}

let giftPackageCodeDialogM = () => {
    let code1 = ''
    let code2 = ''
    let qqNum = ''
    API.giftCode({
        superId: superId,
        systemId: systemId,
    }).then(res => {
        // 礼包码固定为这两个，每人只能使用其中一个
        code1 = 'WMGnGZ'
        code2 = 'rrtKVw'
        qqNum = res.data[0].qqGroup

        let successMsg = "复制成功"
        let content = `
        <div class='dialog-content-self'>
        <div class='dialog-content-title'>礼包兑换码领取</div>
        <div class='dialog-content-self-code'>
            <div>礼包码：${code1}</div>
            <div class='dialog-content-self-copybtn' onclick="copyText('${code1}','${successMsg}')">复制</div>
        </div>
        <div class='dialog-content-self-code'>
            <div>礼包码：${code2}</div>
            <div class='dialog-content-self-copybtn' onclick="copyText('${code2}','${successMsg}')">复制</div>
        </div>
        <div class='dialog-content-self-tip'>提示：每人只能使用其中一个礼包码</div>
        </div>
        `
        selfdialogM(content, 'home-dialog home-dialog2')
    })
}

let selfdialogM = (content, className) => {
    document.body.classList.add('no-scroll'); // 添加禁止滚动的类
    layer.open({
        title: ''
        , content: content,
        btn: [],
        skin: className,
        end: function () {
            // 对话框关闭后的回调，移除禁止滚动的类
            document.body.classList.remove('no-scroll');
        }
    })
}

// 复制功能函数
function copyText(text, copyyes, copyno) {
    // 创建一个文本区域（textarea）元素用于复制操作
    var textArea = document.createElement("textarea");
    textArea.value = text; // 设置需要复制的文本
    document.body.appendChild(textArea); // 添加到DOM中
    textArea.select(); // 选中刚刚添加的文本
    try {
        // 执行复制操作
        var successful = document.execCommand('copy');
        var msg = successful ? copyyes : copyno;
        layer.msg(msg);
    } catch (err) {
        console.error('copy operation is not supported:', err);
    }
    document.body.removeChild(textArea); // 移除临时的textarea
}

// 手机端全屏菜单展示与收缩
function toggleMenuM() {
    let $menu = $('#fullScreenMenu');
    if ($menu.is(':visible')) {
        $menu.slideUp(300, function () {
            document.body.classList.remove('no-scroll');
        });
    } else {
        document.body.classList.add('no-scroll');
        $menu.slideDown(300);
    }
}

// 手机端菜单点击
function navClickM(sectionClass, element) {
    $('.menu-item-m').removeClass('active');
    if (element) {
        $(element).addClass('active');
    }

    let target = $('.' + sectionClass);
    if (target.length > 0) {
        let offset = target.get(0).offsetTop;
        $('#mainBody').scrollTop(offset); // 触发带平滑滚动属性的容器滚动
        setTimeout(() => {
            toggleMenuM();
        }, 200);
    }
}

$(function () {
    // 手机端全屏菜单底部的二维码弹窗交互
    $('.mobile-qr-trigger').on('click', function (e) {
        e.stopPropagation(); // 阻止事件冒泡
        var qrSrc = $(this).attr('data-qr');
        var jumpUrl = $(this).attr('data-jump');
        
        if (qrSrc) {
            $('.full-qrcode-model .img-box img').attr('src', qrSrc);
            $('.full-qrcode-model').css('display', 'flex').hide().fadeIn(200);
        } else if (jumpUrl) {
            window.open(jumpUrl, '_blank');
        } else {
            layer.msg('敬请期待');
        }
    });

    // 确保弹窗蒙层可以点击关闭（防止与 pcHome 重复绑定，做一下标记）
    if ($('.full-qrcode-model').length > 0 && !window.qrCodeModelBound) {
        $('.full-qrcode-model').on('click', function (e) {
            if ($(e.target).closest('.img-box').length === 0) {
                $(this).fadeOut(200);
            }
        });
        window.qrCodeModelBound = true;
    }

    // 礼包码悬浮窗拖动逻辑 (仅上下拖动，刷新后重置)
    let receiveStartY = 0;
    let receiveStartTop = 0;
    
    $('.receive').on('touchstart', function(e) {
        receiveStartY = e.originalEvent.touches[0].clientY;
        receiveStartTop = $(this)[0].getBoundingClientRect().top;
        $(this).data('moved', false);
    }).on('touchmove', function(e) {
        let currentY = e.originalEvent.touches[0].clientY;
        let deltaY = currentY - receiveStartY;
        
        if (Math.abs(deltaY) > 5) {
            $(this).data('moved', true);
            e.preventDefault(); // 防止屏幕跟着滚动
            
            let newTop = receiveStartTop + deltaY;
            let maxTop = $(window).height() - $(this).outerHeight();
            
            if (newTop < 0) newTop = 0;
            if (newTop > maxTop) newTop = maxTop;
            
            $(this).css({
                'top': newTop + 'px',
                'bottom': 'auto' // 覆盖原有的 bottom
            });
        }
    }).on('touchend', function(e) {
        if (!$(this).data('moved')) {
            // 没有拖动，属于点击事件
            if (typeof giftPackageCodeDialogM === 'function') {
                giftPackageCodeDialogM();
            }
        }
    });

    // 初始精灵头像互动逻辑 (Mobile)


    // 监听返回首页时的锚点定位
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('backIndex')) {
        let sectionClass = searchParams.get('backIndex');
        let target = $('.' + sectionClass);
        if (target.length > 0) {
            setTimeout(() => {
                let offset = target.get(0).offsetTop;
                $('#mainBody').scrollTop(offset);
                // 执行完清空URL避免刷新再次跳转
                let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.history.replaceState({path:newUrl},'',newUrl);
            }, 300);
        }
    }
});