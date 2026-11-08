var feedbackUrl = window.feedbackUrl;

// 问题反馈（国际站：暂未上线）
function goFeedback() {
    if (window.layer && layer.msg) {
        layer.msg('Support is coming soon.', { icon: 1, time: 2500 });
    } else {
        alert('Support is coming soon.');
    }
}

function goHome(type) {
    window.location.href = `../../?backIndex=${type}`;
}

// 自动获取问题反馈链接 (type: 100, configType: 109)
$(function () {
    var apiUrl = typeof consultingAPI_url !== 'undefined' ? consultingAPI_url : (typeof url !== 'undefined' ? url : "https://web.qu06.cn");
    var sysId = typeof systemId !== 'undefined' ? systemId : 20022;
    var supId = typeof superId !== 'undefined' ? superId : 1069;

    $.ajax({
        url: apiUrl + "/websiteActivityReservationReceive/imageList",
        type: "POST",
        data: JSON.stringify({
            superId: supId,
            systemId: sysId,
            type: 100
        }),
        dataType: 'json',
        contentType: 'application/json',
        success: function (res) {
            if (res && res.data) {
                res.data.forEach(function (item) {
                    if (item.configType == 109 && item.jumpUrl) {
                        feedbackUrl = item.jumpUrl;
                        window.feedbackUrl = item.jumpUrl;
                    }
                });
            }
        }
    });
});
