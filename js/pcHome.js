let downloadGameValue = false;
let footerValue = false;//默认隐藏
let searchParams = new URLSearchParams(window.location.search);
let canTrigger = true; //鼠标滚动
let navArr = ['index', 'news', 'introduction', 'gameFeature', 'footer'] //导航栏数组（5屏）
let navIndex = 0; //导航栏索引

// 页面加载完成后，计算当前位置并同步导航栏
$(document).ready(function () {
    if (!searchParams.get('backIndex')) {
        setTimeout(function () {
            let currentScroll = $(window).scrollTop();
            let matchedIndex = 0;
            let minDiff = Infinity;

            // 找出当前滚动高度最贴近哪一屏
            for (let i = 0; i < navArr.length; i++) {
                let type = navArr[i];
                let elClass = type === 'index' ? '.first' : '.' + type;
                if ($(elClass).length > 0) {
                    let offsetTop = $(elClass).offset().top;
                    let diff = Math.abs(currentScroll - offsetTop);
                    if (diff < minDiff) {
                        minDiff = diff;
                        matchedIndex = i;
                    }
                }
            }

            // 更新索引并执行导航栏点击逻辑以同步 UI
            navClick($('.nav-left>li').eq(matchedIndex), navArr[matchedIndex]);
        }, 100);
    }
});

// scrolltTips初始化绑定
$(".scrolltTips").on('click', function () {
    navIndex++
    navClick($('.nav-left>li').eq(navIndex), navArr[navIndex])
})
// 禁止 Ctrl + 鼠标滚轮缩放
window.addEventListener('wheel', function (event) {
    if (event.ctrlKey) {
        event.preventDefault();
        this.setTimeout(() => navLeft(), 10)
    }
}, { passive: false })
// 禁止 Ctrl + 和 Ctrl - 缩放
window.addEventListener('keydown', function (event) {
    // 检查是否按下了Ctrl键以及相应的键是'='或者'-'
    if (event.ctrlKey && (event.key === '=' || event.key === '-' || (event.key === '+' && event.shiftKey))) {
        event.preventDefault(); // 阻止默认行为
        // 使用箭头函数中的正确上下文
        setTimeout(() => navLeft(), 10);
    }
});

//鼠标滚动
$('#mainBodyContent').on('mousewheel DOMMouseScroll', function (e) {
    // if (angent != 12 || $(e.target).closest('.ninjaVillage_content, .login, .login-user, .recharge, .news_content_text').length > 0) return;
    // 如果鼠标在资讯列表内滚动，则只滚动列表，不触发上下切屏
    if ($(e.target).closest('.news-list').length > 0) {
        return;
    }
    e.preventDefault(); // 阻止默认滚动行为
    if (!canTrigger) return
    canTrigger = false;
    setTimeout(() => canTrigger = true, 500);
    let delta = e.originalEvent.deltaY || e.originalEvent.wheelDelta;
    if (delta < 0 && navIndex > 0) {
        navIndex--
        navClick($('.nav-left>li').eq(navIndex), navArr[navIndex])
    } else if (delta > 0 && navIndex < navArr.length - 1) {
        navIndex++
        navClick($('.nav-left>li').eq(navIndex), navArr[navIndex])
    }
});
// 导航栏点击事件
function navClick(dom, type) {
    navIndex = navArr.findIndex(item => item == type);
    const currentActive = $('.nav-list .activation');
    if (currentActive.length > 0) {
        currentActive.removeClass('activation');
    }
    // 页脚不属于左侧导航栏的菜单，避免错误地把第5个子元素(问题反馈)高亮
    if (type !== 'footer') {
        $(dom).addClass('activation');
    }
    // 导航栏背景透明度控制：第一屏（首页）为 0.4 透明度，其他屏为 1 不透明
    if (type === 'index' || navIndex === 0) {
        $('#navbar').removeClass('nav-solid');
        $('.downloadGameDialog').fadeOut(300); // 第一屏隐藏悬浮窗
    } else {
        $('#navbar').addClass('nav-solid');
        $('.downloadGameDialog').fadeIn(300); // 其他屏显示悬浮窗
    }
    // 页面bottom滚动提示 判断（最后一屏显示返回顶部）
    if (['index', 'news', 'introduction'].includes(type)) {
        $(".scrolltTips").html(
            `<span>下滑界面</span>
            <img src="../img/home/nextPage.png" alt="">
            <span>查看更多</span>`
        )
            .off('click').on('click', function () {
                navIndex++
                navClick($('.nav-left>li').eq(navIndex), navArr[navIndex])
            })
    } else {
        $(".scrolltTips").html(
            `<span>返回</span>
            <img src="../img/home/prevPage.png" alt="">
            <span>顶部</span>`
        ).off('click')
            .on('click', function () {
                navIndex = 0
                navClick($('.nav-left>li').eq(navIndex), navArr[navIndex])
            })
    }

    $("html,body").animate({ scrollTop: type == 'index' ? 0 : $(`.${type}`).offset().top }, 500);
}

// 下载游戏悬浮窗展开与收缩切换
let toggleDownloadGameDialog = () => {
    $('.downloadGameDialog').toggleClass('active');
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

// dialog
let selfdialog = (content, className) => {
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
// Andirid下载弹窗（国际站：暂未上线）
let showDownloadAndiridDialog = () => {
    showIntlDownloadDialog();
}
// AppStore下载弹窗（国际站：暂未上线）
let showDownloadAppStoreDialog = () => {
    showIntlDownloadDialog();
}

let giftPackageCodeDialog = () => {
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
        selfdialog(content, 'home-dialog home-dialog2')
    })

}

// show 12+
let show12plusDialog = () => {
    let content = `<div class='dialog-content-self'>
        <span>
            适龄提示<br/>
            亲爱的训练家：<br/>
            1、本游戏是一款3D口袋妖怪题材对战手游，适合年满16周岁及以上用户使用，建议未成年人在家长监护下进行游戏。<br/>
            2、本游戏采用高清3D画面风格，背景设定在口袋妖怪世界，玩家将扮演训练师角色，通过收集和培养精灵参与各类对战，最终成为最强训练师。<br/>
            3、本游戏实行实名认证制度，未满8周岁的用户不能进行充值；8周岁以上未满16周岁的用户单次充值金额不得超过50元人民币，每月累计不得超过200元人民币；16周岁以上未满18周岁的用户单次充值金额不得超过100元人民币，每月累计不得超过400元人民币。未成年用户仅可在周五、周六、周日及法定节假日的20:00至21:00登录游戏，其他时间无法登录。</span>
    </div>`
    selfdialog(content, 'home-dialog twelve-dialog')
}
// 版权信息
let footerFun = () => {
    let footerHeight = $('.footer').height()
    if (footerValue) {
        $('.footer').css('transform', 'translateY(100%)')
        $('.copyright-btn').css('transform', 'translateY(0px)')
        $('.copyright-btn>img').css("transform", "rotateZ(0deg)")
    } else {
        $('.footer').css('transform', 'translateY(0px)')
        $('.copyright-btn').css('transform', 'translateY(-' + footerHeight + 'px)')
        $('.copyright-btn>img').css("transform", "rotateZ(180deg)")
    }
    footerValue = !footerValue
}

// 详情页回来跳转
let watchBackIndex = (() => {
    if (searchParams.get('backIndex')) {
        navIndex = navArr.findIndex(item => item == searchParams.get('backIndex'));
        if (navIndex !== -1) {
            navClick($('.nav-left>li').eq(navIndex), navArr[navIndex]);
        }
        setTimeout(() => {
            searchParams.set('backIndex', '')
            const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
            history.replaceState({}, '', newUrl); // 更新 URL 而不刷新页面
        }, 300);
    }
})()

// 问题反馈跳转（国际站：暂未上线）
var feedbackUrl = window.feedbackUrl; // 可以在此处配置具体的问题反馈链接
function goFeedback() {
    showIntlSupportDialog();
}

// 初始精灵头像互动逻辑
$(function () {


    // 自动根据图片比例切换进化界面的高度 (long 类)
    let $evolveContainer = $('.partner-content .right .right-evolve');

    function checkEvolveImgRatio(img) {
        if (!img) return;
        // 519*163 的宽高比约 3.18
        // 519*316 的宽高比约 1.64
        // 以 2.5 作为分界线，如果比例小于 2.5 就是较高的那张图
        let ratio = img.naturalWidth / img.naturalHeight;
        if (ratio > 0 && ratio < 2.5) {
            $(img).closest('.right-evolve').addClass('long');
        } else {
            $(img).closest('.right-evolve').removeClass('long');
        }
    }

    // 因为图片 load 事件不冒泡，无法使用事件代理，因此直接绑定现有的 img 
    // 后续如果是改变 src，这里的 load 依旧会触发。
    $evolveContainer.find('img').on('load', function () {
        checkEvolveImgRatio(this);
    });

    // 页面加载时的初始检查
    let $evolveImg = $evolveContainer.find('img');
    if ($evolveImg.length > 0 && $evolveImg[0].complete) {
        checkEvolveImgRatio($evolveImg[0]);
    }
});

$(function () {
    // 底部二维码交互
    $('.footer-qr-trigger').on('click', function () {
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

    // 顶部导航栏二维码交互
    $('.nav-social-item').on('click', function () {
        var qrSrc = $(this).find('.social-qrcode-popup img').attr('src');
        var jumpUrl = $(this).attr('data-jump');

        if (qrSrc) {
            // 有图片时仅靠 hover 显示，不执行跳转
            return;
        } else if (jumpUrl) {
            window.open(jumpUrl, '_blank');
        } else {
            layer.msg('敬请期待');
        }
    });

    // 点击蒙层关闭弹窗
    $('.full-qrcode-model').on('click', function (e) {
        if ($(e.target).closest('.img-box').length === 0) {
            $(this).fadeOut(200);
        }
    });
});
