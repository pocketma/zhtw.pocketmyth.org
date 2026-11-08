
let systemId = 20022; // 06体系
let superId = 1069; // 所属游戏id
let gamePid = 351279; // 注册游戏pid
let gamename = '战斗吧！精灵';

let xhsMQrImageQ = '';
let xhsMQrImageH = '';
let xhsMQrImageTxt = '';
let qqQrImageQ = '';
let qqQrImageH = '';
let qqQrImageTxt = '';
let wxgzhMQrImageQ = '';
let wxgzhMQrImageH = '';
let wxgzhMQrImageTxt = '';
let hyMQrQ = '';
let hyMQrH = '';
let hyMQrTxt = '';
let kfMQrQ = '';
let kfMQrTxt = '';
let kfMQrJumpUrl = '';
let communityForm = {};
let newsSwiper = ''
let newNewsId = ''
// 游戏社区form
let changeCommunityForm = {
    'inChangeImg': {
        'wx': '',
        'qq': '',
        'xhs': '',
        'hy': ''
    },
    'outChangeImg': {
        'wx': '',
        'qq': '',
        'xhs': '',
        'hy': ''
    },
    'inChangeText': {
        'wx': '扫码关注',
        'qq': '扫码关注',
        'xhs': '扫码关注',
        'hy': '扫码关注'
    },
    'ioutChangeText': {
        'wx': '',
        'qq': '',
        'xhs': '',
        'hy': ''
    },
}

// 检查是否为移动设备
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Mobile Safari|Windows Phone/i.test(navigator.userAgent);
}
// 游戏咨询内容状态切换
function newsNavsCli(type, articleCategoryId) {
    $('.newsNavBlock').removeClass('newsNavBlock')
    $(`.newsNavs${type}`).addClass('newsNavBlock');
    articleListFun(type == '4' ? null : articleCategoryId);
    // if (type == 1) {
    //     $('.news-listZx').show();
    //     $('.news-listZix').hide();
    //     $('.news-listGg').hide();
    //     $('.news-listGd').hide();
    // } else if (type == 2){
    //     $('.news-listZx').hide();
    //     $('.news-listZix').show();
    //     $('.news-listGg').hide();
    //     $('.news-listGd').hide();
    // } else if (type == 3){
    //     $('.news-listZx').hide();
    //     $('.news-listZix').hide();
    //     $('.news-listGg').show();
    //     $('.news-listGd').hide();
    // } else if (type == 4){
    //     $('.news-listZx').hide();
    //     $('.news-listZix').hide();
    //     $('.news-listGg').hide();
    //     $('.news-listGd').show();
    // }
}

layui.use(function () {
    var form = layui.form;
    var layer = layui.layer;

    // 游戏资讯内容详情
    articleListFun = function (articleCategoryId) {
        layer.load();
        API.articleList({
            superId: superId,
            systemId: systemId,
            articleCategoryId: articleCategoryId,
            terminal: isMobileDevice() ? 101 : 100,
        })
            .then(res => {
                layer.closeAll();
                $('.news-list').empty();
                // 主轮播固定使用 POCKET Myth 品牌素材，不再使用资讯 banner 覆盖
                // 数据倒叙
                let newsData = res.data.sort((a, b) => {
                    // 将 startTime 转换为 Date 对象
                    const dateA = new Date(a.startTime.replace(' ', 'T'));
                    const dateB = new Date(b.startTime.replace(' ', 'T'));
                    // 按降序排序
                    return dateB - dateA;
                });
                // 排除最新 2025-4-7 不还要移除最新（xuhao）
                // if (articleCategoryId == null) {
                //     newsData = res.data.filter((item) => {
                //         return item.categoryName != '最新';
                //     });
                // }

                let displayData = articleCategoryId == null ? newsData : newsData.slice(0, 5);
                displayData.forEach(item => {
                    $('.news-list').append(`
                        <a class="news-item pointer" href="${item.articleHtmlUrl}">
                            <div class="news-item-status">
                                <span>${item.categoryName}</span>
                            </div>
                            <div class="news-item-content">${item.title}</div>
                            <div class="news-item-date">${item.startTime}</div>
                        </a>
                    `)
                })
            })
            .catch((error) => {
                console.log(error);
                layer.closeAll();
            })
    }

    // 文章分类接口
    articleCategoryFun = function () {
        layer.load();
        API.articleCategory({
            superId: superId,
            systemId: systemId,
        })
            .then(res => {
                layer.closeAll();
                $('.news-nav').empty();
                newNewsId = res.data.filter(item => item.categoryName == '最新')[0].id
                res.data.forEach((item, index) => {
                    $('.news-nav').append(`
                        <div class="newsNavs${index + 1}" onclick="newsNavsCli(${index + 1},${item.id})">${item.categoryName}</div>
                    `)
                })
                $('.newsNavs1').addClass('newsNavBlock');
                $('.news-nav p:last').remove();
                articleListFun(res.data[0].id);
            })
            .catch((error) => {
                layer.closeAll();
            })
    }

    // 轮播图接口
    carouselChartFun = function () {
        layer.load();
        API.carouselChart({
            superId: superId,
        })
            .then(res => {
                layer.closeAll();
                $('.news-swiper-container>.swiper-wrapper').empty();
                let data = JSON.parse(res.data[0].jsonStr);

                // 官网主轮播：POCKET Myth 品牌素材
                var pomyCarousel = [
                    'img/pomy/carousel_1_0.jpg',
                    'img/pomy/carousel_1_1.jpg',
                    'img/pomy/carousel_1_2.jpg',
                    'img/pomy/carousel_1_3.jpg',
                    'img/pomy/carousel_1_4.jpg'
                ];
                pomyCarousel.forEach(function (src, index) {
                    $('.news-swiper-container>.swiper-wrapper').append(`
                    <div class="swiper-slide"><img src="${src}" alt="POCKET Myth 游戏截图 ${index + 1}"></div>
                `);
                });
                newsSwiper = new Swiper(".news-swiper-container", {
                    loop: true,
                    navigation: {
                        nextEl: '.swiper-button-next2',
                        prevEl: '.swiper-button-prev2',
                    },
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                    },
                });
                // // 游戏资讯轮播和标题
                // let gameInformationArr = data.filter(item => item.carouselType == '缩略轮播')[0];
                // gameInformationArr.carousel.forEach((item, index) => {
                //     $('.news-swiper-container>.swiper-wrapper').append(`
                //     <div class="swiper-slide">
                //         <img src="${item.carouselImg}" alt="游戏资讯">
                //         <div class="swiper-title overFlowEllipsis">${item.carouselDetail}</div>
                //     </div>
                // `)
                // })
                // gameFeatureSwiper = new Swiper(".news-swiper-container", {
                //     loop: true,
                //     navigation: {
                //         nextEl: '.swiper-button-next2',
                //         prevEl: '.swiper-button-prev2',
                //     },
                //     autoplay: {
                //         delay: 2000,
                //         disableOnInteraction: false,
                //     },
                // })
                // 游戏特色轮播
                if (isMobileDevice()) {
                    $('.news-swiper-container4>.swiper-wrapper').empty();
                    // 游戏资讯轮播图
                    let gameFeatureArr = data.filter(item => item.carouselType == '普通轮播')[0];
                    gameFeatureArr.carousel.forEach((item, index) => {
                        $('.news-swiper-container4>.swiper-wrapper').append(`
                        <div class="swiper-slide"><img src="${item.carouselImg}" alt="游戏特色"></div>
                    `)
                    })
                    gameCharacteristicSwiper = new Swiper(".news-swiper-container4", {
                        loop: true,
                        loopedSlides: gameFeatureArr.carousel.length,
                        direction: "vertical",
                        effect: "coverflow",
                        grabCursor: true,
                        centeredSlides: true,
                        slidesPerView: 1.1,
                        coverflowEffect: {
                            rotate: -40,
                            stretch: window.innerHeight < 600 ? 100 : (window.innerHeight < 800 ? 150 : 190),
                            depth: 160,
                            modifier: 1,
                            slideShadows: false,
                        },
                        navigation: {
                            nextEl: '.swiper-button-next4',
                            prevEl: '.swiper-button-prev4',
                        },
                        autoplay: {
                            delay: 2000,
                            disableOnInteraction: false,
                        },
                    });
                } else {
                    $('.news-swiper-container4>.swiper-wrapper').empty();
                    let data = JSON.parse(res.data[0].jsonStr);

                    // 游戏资讯轮播图
                    let gameFeatureArr = data.filter(item => item.carouselType == '普通轮播')[0];
                    gameFeatureArr.carousel.forEach((item, index) => {
                        $('.gameFeature-swiper-container>.swiper-wrapper').append(`
                        <div class="swiper-slide"><img src="${item.carouselImg}" alt="游戏特色"></div>
                    `)
                    })
                    // 游戏特色轮播
                    swiper4 = new Swiper(".gameFeature-swiper-container", {
                        loop: true,
                        centeredSlides: true,
                        // slidesPerView: 3,
                        effect: "coverflow",
                        speed: 1500,
                        centeredSlides: true,
                        grabCursor: true,
                        slidesPerView: 1.5,
                        coverflowEffect: {
                            rotate: 70,
                            stretch: window.innerWidth < 1400 ? (window.innerWidth < 1080 ? 50 : 150) : 300,
                            depth: 100,
                            modifier: 1,
                            slideShadows: false,
                        },
                        navigation: {
                            prevEl: '.swiper-button-prev4',
                            nextEl: '.swiper-button-next4',
                        },
                        pagination: {
                            el: '.gameFeature-pagination',
                            clickable: true,
                        },
                        autoplay: {
                            delay: 2000, // 每个轮播项的停留时间，单位为毫秒
                            disableOnInteraction: false, // 用户操作之后是否禁止自动轮播
                        },
                    });
                }

            })
            .catch((error) => {
                layer.closeAll();
            })
    }

    let initialElfDataList = [];

    // 获取初始精灵的数据接口
    initialElfListFun = function () {
        layer.load();
        API.initialElfList({
            superId: superId,
            systemId: systemId,
            type: 105,
        })
            .then(res => {
                layer.closeAll();
                // console.log("获取初始精灵的数据成功：", res);
                if (res.data && res.data.length > 0) {
                    initialElfDataList = res.data;
                    renderInitialElfList(res.data);
                }
            })
            .catch((error) => {
                layer.closeAll();
                console.log("获取初始精灵的数据失败：", error);
            })
    }

    function renderInitialElfList(data) {
        let $partnerContents = $('.partner-content');

        $partnerContents.each(function () {
            let $container = $(this);
            let $portraitList = $container.find('.portrait-list');
            $portraitList.empty();

            data.forEach((item, index) => {
                let pitchOn = index === 0 ? 'pitch-on' : '';
                let html = `
                    <div class="portrait ${pitchOn}" data-index="${index}">
                        <img src="${item.imageUrl}" alt="战斗吧精灵手游官网初始精灵头像www.pocketmyth.net" aria-label="初始精灵头像">
                        <span>${item.animalNo || ''}</span>
                    </div>
                `;
                $portraitList.append(html);
            });
        });

        // 默认渲染第一个精灵的详情
        renderInitialElfDetail(data[0]);

        // 重新绑定事件
        bindElfSliderEvents();
    }

    function bindElfSliderEvents() {
        let $partnerContents = $('.partner-content');

        $partnerContents.each(function () {
            let $container = $(this);
            let $partnerList = $container.find('.left-indicator .portrait-list');
            let $btnLeft = $container.find('.left-indicator .arrows.left');
            let $btnRight = $container.find('.left-indicator .arrows.right');

            // 解绑旧事件，防止重复或失效
            $partnerList.off('click', '.portrait');
            $btnLeft.off('click');
            $btnRight.off('click');

            let currentIndex = 0;
            let visibleItems = 4;

            function updateTransform() {
                let $portraits = $partnerList.find('.portrait');
                if ($portraits.length <= 1) return;
                let $p0 = $portraits.eq(0);
                let $p1 = $portraits.eq(1);
                if ($p0.length && $p1.length) {
                    let itemWidth = $p1.position().left - $p0.position().left;
                    $partnerList.css('transform', `translateX(-${currentIndex * itemWidth}px)`);
                }
            }

            $partnerList.on('click', '.portrait', function () {
                let $portraits = $partnerList.find('.portrait');
                let totalItems = $portraits.length;
                let maxIndex = Math.max(0, totalItems - visibleItems);

                let index = $(this).index();

                // 同步更新所有的选择状态
                $('.partner-content .left-indicator .portrait-list').each(function () {
                    $(this).find('.portrait').removeClass('pitch-on').eq(index).addClass('pitch-on');
                });

                currentIndex = Math.min(index, maxIndex);
                updateTransform();

                let dataIndex = $(this).data('index');
                renderInitialElfDetail(initialElfDataList[dataIndex]);
            });

            $btnLeft.on('click', function () {
                let $portraits = $partnerList.find('.portrait');
                let totalItems = $portraits.length;
                let maxIndex = Math.max(0, totalItems - visibleItems);

                let selectedIndex = $portraits.index($partnerList.find('.portrait.pitch-on'));
                if (selectedIndex > 0) {
                    selectedIndex--;

                    $('.partner-content .left-indicator .portrait-list').each(function () {
                        $(this).find('.portrait').removeClass('pitch-on').eq(selectedIndex).addClass('pitch-on');
                    });

                    currentIndex = Math.min(selectedIndex, maxIndex);
                    updateTransform();

                    renderInitialElfDetail(initialElfDataList[selectedIndex]);
                }
            });

            $btnRight.on('click', function () {
                let $portraits = $partnerList.find('.portrait');
                let totalItems = $portraits.length;
                let maxIndex = Math.max(0, totalItems - visibleItems);

                let selectedIndex = $portraits.index($partnerList.find('.portrait.pitch-on'));
                if (selectedIndex < totalItems - 1) {
                    selectedIndex++;

                    $('.partner-content .left-indicator .portrait-list').each(function () {
                        $(this).find('.portrait').removeClass('pitch-on').eq(selectedIndex).addClass('pitch-on');
                    });

                    currentIndex = Math.min(selectedIndex, maxIndex);
                    updateTransform();

                    renderInitialElfDetail(initialElfDataList[selectedIndex]);
                }
            });
        });
    }

    function renderInitialElfDetail(item) {
        if (!item) return;

        // 名称
        $('.partner-content .left-title').text(item.animalName || '');

        // 属性和特性
        let attrsHtml = '';
        if (item.animalAttributeList && item.animalAttributeList.length > 0) {
            item.animalAttributeList.forEach(attr => {
                attrsHtml += `<img src="./img/new/nature/${attr.name}.png" alt="战斗吧精灵手游官网属性图www.pocketmyth.net">`;
            });
        }
        attrsHtml += `\n<span class="text">特性：${item.jumpUrl || ''}</span>`;
        $('.partner-content .peculiarity').html(attrsHtml);

        // 身高体重
        $('.partner-content .left-info > .text.figure').text(`身高：${item.animalHeight || ''} 体重：${item.animalWeight || ''}`);

        // 介绍
        $('.partner-content .left-info > .text').not('.figure').text(`介绍：${item.description || ''}`);

        // 主图 flipImageUrl
        $('.partner-content .partner-img > img').attr('src', item.flipImageUrl || '');

        // 种族值 / 数值 titleUrl2
        $('.partner-content .right-numerical > img').attr('src', item.titleUrl2 || '');

        // 进化图片 imageUrl2
        $('.partner-content .right-evolve > img').attr('src', item.imageUrl2 || '');
    }

    // 游戏官网图片跳转接口
    imageListFun = function () {
        layer.load();
        API.imageList({
            superId: superId,
            systemId: systemId,
            type: 100,
        })
            .then(res => {
                layer.closeAll();
                communityForm = res.data;

                // 根据 configType 更新页面二维码和问题反馈链接（同时生效于PC和移动端）
                res.data.forEach(item => {
                    if (item.configType == 108) {
                        // 小红书二维码/跳转
                        if (item.flipImageUrl) {
                            $('#footerXhsQr, #mobileXhsQr').attr('data-qr', item.flipImageUrl);
                            $('#navXhsQr').attr('src', item.flipImageUrl).parent().show();
                        } else {
                            $('#navXhsQr').parent().hide();
                        }
                        if (item.jumpUrl) {
                            $('#footerXhsQr, #mobileXhsQr').attr('data-jump', item.jumpUrl);
                            $('#navXhsQr').closest('.nav-social-item').attr('data-jump', item.jumpUrl).css('cursor', 'pointer');
                        }
                    } else if (item.configType == 107) {
                        // 微信二维码/跳转
                        if (item.flipImageUrl) {
                            $('#footerWxQr, #mobileWxQr').attr('data-qr', item.flipImageUrl);
                            $('#navWxQr').attr('src', item.flipImageUrl).parent().show();
                        } else {
                            $('#navWxQr').parent().hide();
                        }
                        if (item.jumpUrl) {
                            $('#footerWxQr, #mobileWxQr').attr('data-jump', item.jumpUrl);
                            $('#navWxQr').closest('.nav-social-item').attr('data-jump', item.jumpUrl).css('cursor', 'pointer');
                        }
                    } else if (item.configType == 131) {
                        // QQ二维码/跳转
                        if (item.flipImageUrl) {
                            $('#footerQqQr, #mobileQqQr').attr('data-qr', item.flipImageUrl);
                            $('#navQqQr').attr('src', item.flipImageUrl).parent().show();
                        } else {
                            $('#navQqQr').parent().hide();
                        }
                        if (item.jumpUrl) {
                            $('#footerQqQr, #mobileQqQr').attr('data-jump', item.jumpUrl);
                            $('#navQqQr').closest('.nav-social-item').attr('data-jump', item.jumpUrl).css('cursor', 'pointer');
                        }
                    } else if (item.configType == 109 && item.jumpUrl) {
                        // 问题反馈跳转地址
                        if (typeof feedbackUrl !== 'undefined') {
                            feedbackUrl = item.jumpUrl;
                        } else {
                            window.feedbackUrl = item.jumpUrl;
                        }
                    }
                });

                // 有链接客服
                res.data.filter(item => {
                    if (item.jumpUrl !== "") {
                        kfMQrQ = item.imageUrl;
                        kfMQrTxt = item.description;
                        kfMQrJumpUrl = item.jumpUrl;
                        $('.kfMQr').attr('src', item.imageUrl);
                        $('.kfMQrName').text(item.description);
                    }
                })
                // 无链接翻转
                const withoutJumpUrl = res.data.filter(item => item.jumpUrl === "");
                if (isMobileDevice()) {
                    xhsMQrImageQ = withoutJumpUrl[0].imageUrl;
                    xhsMQrImageH = withoutJumpUrl[0].flipImageUrl;
                    xhsMQrImageTxt = withoutJumpUrl[0].description;
                    $('#xhsMQrImage').attr('src', withoutJumpUrl[0].imageUrl);
                    $('.xhsMQrName').text(withoutJumpUrl[0].description);
                    qqQrImageQ = withoutJumpUrl[1].imageUrl;
                    qqQrImageH = withoutJumpUrl[1].flipImageUrl;
                    qqQrImageTxt = withoutJumpUrl[1].description;
                    $('#qqQrImage').attr('src', withoutJumpUrl[1].imageUrl);
                    $('.qqMQrName').text(withoutJumpUrl[1].description);
                    wxgzhMQrImageQ = withoutJumpUrl[2].imageUrl;
                    wxgzhMQrImageH = withoutJumpUrl[2].flipImageUrl;
                    wxgzhMQrImageTxt = withoutJumpUrl[2].description;
                    $('#wxgzhMQrImage').attr('src', withoutJumpUrl[2].imageUrl);
                    $('.wxgzhMQrName').text(withoutJumpUrl[2].description);
                    hyMQrQ = withoutJumpUrl[3].imageUrl;
                    hyMQrH = withoutJumpUrl[3].flipImageUrl;
                    hyMQrTxt = withoutJumpUrl[3].description;
                    $('#hyMQrImage').attr('src', withoutJumpUrl[3].imageUrl);
                    $('.hyMQrName').text(withoutJumpUrl[3].description);
                } else {
                    let storeList = ['xhs', 'wx', 'qq', 'hy']
                    let htmlstoreList = ['wx', 'qq', 'xhs', 'hy']
                    withoutJumpUrl.forEach((item, index) => {
                        changeCommunityForm.inChangeImg[storeList[index]] = item.flipImageUrl
                        changeCommunityForm.outChangeImg[storeList[index]] = item.imageUrl
                        changeCommunityForm.ioutChangeText[storeList[index]] = item.description
                    })
                    // 初始化
                    for (let item of htmlstoreList) {
                        $(`#${item}`).attr('src', changeCommunityForm.outChangeImg[item]);
                        $(`#${item}`).siblings('.text').text(changeCommunityForm.ioutChangeText[item]);
                    }
                    $(`.kf-box>.pointer`).on('click', function () {
                        window.open(kfMQrJumpUrl)
                    })
                }

            })
            .catch((error) => {
                layer.closeAll();
            })
    }

    // 获取下载信息接口
    let downloadInfoData = null;
    downloadInfoFun = function () {
        layer.load();
        API.imageList({
            superId: superId,
            systemId: systemId,
            type: 104,
        })
            .then(res => {
                layer.closeAll();
                console.log("获取下载信息成功：", res);
                downloadInfoData = res.data;
                // 根据 configType 分发数据
                res.data.forEach(item => {
                    if (item.configType == 100 && (item.imageUrl || item.jumpUrl)) {
                        // 100：二维码链接
                        $('.leftQR-code').attr('src', item.imageUrl || item.jumpUrl);
                        $('.downloadGameDialog-QRCode').attr('src', item.imageUrl || item.jumpUrl);
                    } else if (item.configType == 103 && item.jumpUrl) {
                        // 103：安卓下载链接
                        window.androidDownloadUrl = item.jumpUrl;
                    } else if (item.configType == 102 && item.jumpUrl) {
                        // 102：iOS下载链接
                        window.iosDownloadUrl = item.imageUrl;
                    }
                });
            })
            .catch((error) => {
                layer.closeAll();
                console.log("获取下载信息失败：", error);
            })
    }

    articleCategoryFun(); // 文章分类接口
    carouselChartFun(); // 轮播图接口
    imageListFun(); // 游戏官网图片跳转接口
    initialElfListFun(); // 获取初始精灵的数据
    downloadInfoFun(); // 获取下载信息

})
// pc 游戏社区 鼠标移入移出 翻转事件
let flip = (thisDOM) => {
    var $element = $(thisDOM);
    var imgId = $element.find('img').attr('id');
    $element.on('mouseenter', function () {
        setTimeout(() => {
            $(`#${imgId}`).attr('src', changeCommunityForm.inChangeImg[imgId]);
            $(`#${imgId}`).siblings('.text').text(changeCommunityForm.inChangeText[imgId]);
        }, 300);
    });

    $element.on('mouseleave', function () {
        setTimeout(() => {
            $(`#${imgId}`).attr('src', changeCommunityForm.outChangeImg[imgId]);
            $(`#${imgId}`).siblings('.text').text(changeCommunityForm.ioutChangeText[imgId]);
        }, 300);
    });
}
$(document).ready(function () {
    $('.inTop').each(function () {
        flip(this);
    });
    $('.inBottom').each(function () {
        flip(this);
    });
});
// 文章跳转
function newsDetailsCli(articleHtmlUrl) {
    if (/articleHtml\/web\//.test(articleHtmlUrl)) {
        window.location.href = articleHtmlUrl;
    } else {
        window.open(articleHtmlUrl, '_blank');
    }
}

// 跳转落地页 苹果下载
let goDownload = () => {
    window.open("https://game.qu06.cn/website/ll/zdbjlgc/?3UjZQAPs", '_blank');
}

let goDownloadM = () => {
    showIntlDownloadDialog();
}
//版本信息 1.隐私政策、2.儿童个人信息保护规则、3.用户协议、4.防沉迷自律公约跳转。
let footerClick = (type) => {
    let _arry = ['https://game.qu06.cn/website/agreement/ll/ll_quick_ysqzc.html', 'https://game.qu06.cn/website/agreement/ll/ll_etysbhsm.html', 'https://game.qu06.cn/website/agreement/ll/ll_quick_yxxkz.html', '../view/addicted.html']
    let url = _arry[type]
    window.open(url, '_blank');
}


