// 本地
// let url = "http://192.168.16.180:3030";
// 线上
let url = "https://web.qu06.cn";

// 请求
function request(url, type, data, dataType, contentType) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url, type, data, dataType, contentType,
            success: resolve,
            error: (error) => {
                reject(error);
            },
        });
    });
}

let API = {
    // 文章分类
    articleCategory: (data) => {
        return request(`${url}/websiteActivityReservationReceive/articleCategory`, "POST", JSON.stringify(data), 'json', 'application/json')
    },

    // 文章详情
    articleDetail: (data) => {
        return request(`${url}/websiteActivityReservationReceive/articleDetail`, "POST", JSON.stringify(data), 'json', 'application/json')
    },

    // 游戏官网文章
    articleList: (data) => {
        return request(`${url}/websiteActivityReservationReceive/articleHtmlList`, "POST", JSON.stringify(data), 'json', 'application/json')
    },

    // 游戏资讯和游戏特色轮播图
    carouselChart: (data) => {
        return request(`${url}/websiteActivityReservationReceive/carouselChart`, "POST", JSON.stringify(data), 'json', 'application/json')
    },

    //  游戏官网图片跳转接口
    imageList: (data) => {
        return request(`${url}/websiteActivityReservationReceive/imageList`, "POST", JSON.stringify(data), 'json', 'application/json')
    },
    //  礼包码和qq群号
    giftCode: (data) => {
        return request(`${url}/websiteActivityReservationReceive/giftCodeList`, "POST", JSON.stringify(data), 'json', 'application/json')
    },
    // 获取初始精灵的数据
    initialElfList: (data) => {
        return request(`${url}/websiteActivityReservationReceive/imageList`, "POST", JSON.stringify(data), 'json', 'application/json')
    },

}