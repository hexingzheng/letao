//用户没有登录过  通过地址栏不允许登录  拦截到登录页面

$.ajax({
  type: "get",
  url: "/employee/checkRootLogin",
  dataType: "json",
  success: function (info) {
    if (info.success) {
      console.log("已登陆");
    }
    if (info.error === 400) {
      location.href = "login.html";
    }
  }
})