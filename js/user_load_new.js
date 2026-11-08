//落地页 用户注册 下载游戏
//游戏名称
//游戏gamePid
// var gamePid = "";
// var Game_name = document
//   .querySelector('meta[name="keywords"]')
//   .getAttribute("content");
var Game_name = ''


// function GetQueryString(name) {
//   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
//   var r = window.location.search.substr(1).match(reg);
//   if (r != null) return unescape(r[2]); return null;
// }
// var mypid = GetQueryString("pid");
// if (GetQueryString("pid") == null) {
//   mypid = 65000000;
// }
// 新闻详情pid冲突 写死
var mypid = 65000000;  

var $angent = "";

function userinfo() {
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    $angent = "10";
  } else if (/(Android)/i.test(navigator.userAgent)) {
    $angent = "11";
  } else {
    $angent = "12";
  }
}
userinfo();

var btn = $("#code");
var send_time = 60;
var timeLeft = send_time;
var code_str = "";

//注册
$(".close_reg").click(function () {
  $(".pop2").hide();
  $(".pop1").hide();
  $(".pop3").hide();
  $("body").css({
    position: "absolute",
  });

  $("#username1").val(""); //用户名（手机号）
  $("#pwd1").val("");
  $("#pwd2").val(""); //验证码
  $("#username").val(""); //用户名（手机号）
  $("#pwd").val("");
  $("#y_code").val(""); //验证码
  timeLeft = 0;
  btn.remove("disabled");
});
$("#reg_pt").click(function () {
  $(".pop2").show();
  $(".pop1").hide();
});
$("#reg_phone").click(function () {
  $(".pop1").show();
  $(".pop2").hide();
});
$(".ok_btn1").click(function () {
  $(".pop3").hide();
  $("body").css({
    position: "absolute",
  });
});

// 下载（国际站：暂未上线）
let downloadInner = () => {
  $('.pop3').hide();
  showIntlDownloadDialog();
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~验证码
var bindBtn = function () {
  btn.click(function () {
    var phone = $("#username").val(); //用户名（手机号）
    var y_code = $("#y_code").val(); //验证码

    if (phone == "") {
      layer.msg("请输入手机号");
      btn.remove("disabled");
      return false;
    }
    btn.unbind("click");
    btn.attr("disabled", "disabled");
    // $.getJSON('https://pay-api.haofangame.com/htmlApi/htmlVerifyCode.jhtml?phoneNum='+phone+'&callback=?',
    //     function(data){
    //         code_str= data.data.verificationCode;
    //         console.log(data);
    //         if(data.code==100){
    //             layer.msg("发送成功");
    //             timeLeft = send_time;
    //             timeCount();
    //         }
    //         else{
    //             layer.msg(data.msg);
    //             $('#username').val('');//用户名（手机号）
    //             $('#pwd').val('');
    //             $('#y_code').val(''); //验证码
    //             bindBtn();
    //             btn.remove('disabled');
    //             return false;
    //         }
    //     }
    // ).error(function(){console.log('接口异常');});
    $.ajax({
      url: "https://pay-api.qu06.cn/htmlApi/htmlVerifyCode.jhtml",
      type: "post",
      dataType: "jsonp",
      data: {
        phoneNum: phone,
        phone: phone,
        typeId: 3,
        systemId: 20022,
      },
      success: function (data) {
        console.log(data);
        if (data.code == 100) {
          layer.msg("发送成功");
          timeLeft = send_time;
          timeCount();
        } else {
          layer.msg(data.msg);
          $("#username").val(""); //用户名（手机号）
          $("#pwd").val("");
          $("#y_code").val(""); //验证码
          bindBtn();
          btn.remove("disabled");
          return false;
        }
      },
      error: function () {
        console.log("接口异常");
      },
    });
  });
};
bindBtn();
/*重新发送计时*/
var timeCount = function () {
  window.setTimeout(function () {
    if (timeLeft > 0) {
      timeLeft -= 1;
      btn.html(timeLeft + "s后重新发送");
      timeCount();
    } else {
      btn.html("重新发送");
      btn.remove("disabled");
      bindBtn();
    }
  }, 1000);
};
//~~~~~手机注册

let isFirst = true;

$("#reg-form").on("submit", function (ev) {
  $("body").css({
    position: "fixed",
  });
  if (isFirst) {
    Register();
    isFirst = false;
  } else {
    layer.msg("请勿重复操作！！");
  }
  ev.preventDefault();
});
//~~~~~普通注册
$("#reg-form2").on("submit", function (ev) {
  $("body").css({
    position: "fixed",
  });
  Register_pt();
  ev.preventDefault();
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~手机注册
function Register() {
  setTimeout(function () {
    isFirst = true;
  }, 3000);
  if (!mypid) {
    mypid = getPid();
  }
  if ($("#pwd").val() != $("#confirmPwd").val()) {
    layer.msg("两次密码不一致");
    return;
  }
  var userphone = $("#username").val(); //用户名（手机号）
  var password = $("#pwd").val();
  $.ajax({
    type: "POST",
    url: "https://pay-api.qu06.cn/htmlApi/regFromPageGift.jhtml",
    dataType: "json",
    data: {
      username: "",
      phoneNum: userphone,
      password: password,
      typeId: $angent,
      introId: mypid,
      gamePid: $("#appGamePid").val(),
      giftId: $('#giftId').val(),
      systemId: 20022,
    },
    success: function (data) {
      console.log(data);
      console.log(mypid);
      if (data.code == 100) {
        console.log(data);
        getShareReg(data.data)
        layer.msg("注册成功！");
        $("#gift_code").html(data.msg); //礼包码
        btn.remove("disabled");
        $("#username").val(""); //用户名（手机号）
        $("#pwd").val("");
        $("#y_code").val(""); //验证码
        $(".pop1").hide();
        $(".pop3").show(500);
        return false;
      } else {
        $("#pwd1").val("");
        $("#pwd2").val("");
        console.log(data);
        layer.msg(data.msg);
      }
    },
    error: function () {
      console.log("接口异常");
    },
  });
}
$("#nextBtn").click(function () {
  var userphone = $("#username").val(); //用户名（手机号）
  var y_code = $("#y_code").val(); //验证码
  if (y_code == "") {
    layer.msg("请输入验证码！");
  } else {
    $.ajax({
      url: "https://pay-api.qu06.cn/htmlApi/htmlValidVerCode.jhtml",
      type: "post",
      dataType: "jsonp",
      data: {
        phone: userphone,
        code: y_code,
        systemId: 20022,
      },
      success: function (data) {
        if (data.code == 100) {
          $.ajax({
            url: "https://pay-api.qu06.cn/htmlApi/isRegister.jhtml",
            type: "post",
            // dataType: "jsonp",
            data: {
              phoneNum: userphone,
              username: "",
              gamePid: $("#appGamePid").val(),
              giftId: $("#giftId").val(),
              systemId: 20022,
            },
            success: function (data) {
              if (data.code == 101) {
                $("#nextBtn").hide();
                $(".pwdDiv").show();
                $("#btn_reg1").show();
              } else if (data.code == 100) {
                $("#gift_code").html(data.data); //礼包码
                $("#username").val(""); //用户名（手机号）
                $("#pwd").val("");
                $("#y_code").val(""); //验证码
                $(".pop1").hide();
                $(".pop3").show(500);
              }
            },
            error: function () {
              console.log("接口异常");
            },
          });
        } else {
          layer.msg(data.msg);
        }
      },
      error: function () {
        console.log("接口异常");
      },
    });
  }
});
//~~~~~~~~~~~~~~~~~~~~~~~~~普通注册
function Register_pt() {
  if (!mypid) {
    mypid = getPid();
  }
  var username1 = $("#username1").val();
  var pwd1 = $("#pwd1").val();
  var pwd2 = $("#pwd2").val();
  if (pwd1 != pwd2) {
    layer.msg("密码输入不一致！");
    $("#pwd2").val("");
    return false;
  }
  $.ajax({
    type: "POST",
    url: "https://pay-api.qu06.cn/htmlApi/regFromPage.jhtml",
    dataType: "json",
    data: {
      username: username1,
      password: pwd2,
      typeId: $angent,
      introId: mypid,
      gamename: Game_name,
      giftname: Game_name,
      systemId: 20022
    },
    success: function (data) {
      console.log(data);
      if (data.code == 100) {
        console.log(data);
        getShareReg(data.data)
        layer.msg("注册成功!");
        $("#gift_code").html(data.msg); //礼包码
        $("#username1").val(""); //用户名（手机号）
        $("#pwd1").val("");
        $("#pwd2").val(""); //验证码
        $(".pop2").hide();
        $(".pop3").show(500);
        return false;
      } else {
        $("#pwd1").val("");
        $("#pwd2").val("");
        console.log(data);
        layer.msg(data.msg);
      }
    },
  });
}
//判断渠道是否掉签
function getGameConfigDownloadType(gamePid, pid) {
  var result = pid;
  var url =
    "https://webaccess.qu06.cn/landingpagepoint/getGameConfigDownloadType.jhtml";
  $.ajax({
    type: "POST",
    url: url,
    dataType: "json",
    async: false,
    data: {
      gamePid: gamePid,
    },
    success: function (data) {
      if (data.code == "200") {
        if (data.data == "100") {
          result = pid;
        } else if (data.data == "101") {
          result = 65000000;
        }
      }
    },
    error: function () {
      console.log("接口异常");
      result = pid;
    },
  });
  return result;
}

var userId;
//获取pid
function getPid() {
  if (userId) {
    return userId;
  }
  var url = window.location.href;
  var pid;
  if (url.indexOf("?") >= 0) {
    pid = GetQueryString("pid");
    var uuid = url.substring(url.indexOf("?") + 1, url.length);
    uuid = uuid.replace("=", "");
    if (/^[0-9a-zA-Z]{8}$/.test(uuid) || /^[0-9a-zA-Z]{24}$/.test(uuid)) {
      $.ajax({
        type: "POST",
        url: "https://ei.qu06.cn/accountWeb/getAccountId.yl",
        dataType: "json",
        async: false,
        data: {
          uuid: uuid,
        },
        success: function (resp) {
          console.log(resp);
          if (resp.success) {
            pid = resp.data;
            userId = resp.data;
          } else {
            location.href =
              "https://game.haofangame.com/website/hf/public/error.html";
          }
        },
        error: function () {
          console.log("接口异常");
          location.href =
            "https://game.haofangame.com/website/hf/public/error.html";
        },
      });
    } else {
      if (pid) {
        if (!/^\d{7}$/.test(pid)) {
          pid = 65000000;
          userId = 65000000;
        }
      } else {
        location.href =
          "https://game.haofangame.com/website/hf/public/error.html";
      }
    }
  } else {
    pid = 65000000;
    userId = 65000000;
  }
  return pid;
}

function getReyunTask(gamePid, introduction) {
  var data = {};
  $.ajax({
    type: "POST",
    url: "https://webaccess.qu06.cn/adspread/getReyunTask.jhtml",
    dataType: "json",
    async: false,
    data: {
      gamePid: gamePid,
      status: 100,
      introduction: introduction,
    },
    success: function (resp) {
      console.log(resp);
      data = resp[0];
    },
    error: function () {
      console.log("接口异常");
    },
  });
  return data;
}

//注册分享获取
function getShareReg(data) {
  let searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get('shareCode')) {
    $.ajax({
      type: "POST",
      url: "https://pay-api.qu06.cn/htmlApi/shareUsers",
      dataType: "json",
      async: false,
      data: {
        loginName: data.loginName,
        systemId: 20022,
        pid: $("#appGamePid").val(),
        shareCode: searchParams.get('shareCode')
      },
      success: function (resp) {
        console.log(resp);
      }
    })
  }
}
