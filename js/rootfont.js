/**
 * 动态根据屏幕视口宽度计算并设置 html 根元素 fontSize (rem 基准)
 * PC 端设计稿基准：1920px (1rem = 100px)
 * 移动端设计稿基准：750px (1rem = 100px)
 */
(function (doc, win) {
    let docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Mobile Safari|Windows Phone/i.test(navigator.userAgent);

    let recalc = function () {
        let innerWidth = window.innerWidth;
        if (!innerWidth) return;

        if (isMobileDevice) {
            // 移动端以 750px 为基准设计稿，1rem = 100px
            let scale = innerWidth / 750;
            docEl.style.fontSize = 100 * scale + 'px';
        } else {
            // PC 端以 1920*1080 为基准设计稿
            // 考虑浏览器地址栏、书签栏及电脑任务栏会导致实际高度(innerHeight)往往只有900px左右
            // 结合宽度与高度取最小值计算，确保无论窗口多扁，首屏内容始终完整显示无需滚动
            let scaleW = innerWidth / 1920;
            let scaleH = window.innerHeight / 1080;
            let scale = Math.min(scaleW, scaleH);
            docEl.style.fontSize = 100 * scale + 'px';
        }
    };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
    // 立即执行一次初始化，防止渲染闪烁
    recalc();
})(document, window);
