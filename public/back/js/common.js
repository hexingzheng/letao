/**
 * 进度条功能
 */

$(function () {

  //1.  进度条功能


  // ajax全局事件
  // 需求: 1. 在第一个ajax发送的时候, 开启进度条
  //      2.  在全部的ajax请求完成时, 关闭进度条
  $(document).ajaxStart(function () {
    //开启进度条
    NProgress.start();
  });

  $(document).ajaxStop(function () {
    //可以模拟网络延迟  （实际开发中不用网络延迟）
    setInterval(function () {
      NProgress.done();
    }, 500)
  });

  //2.   侧边导航高亮功能是将current类添加在a链接上进行显示
  //点击分类管理 id=categroy 让二级菜单显示

  $("#category").click(function () {
    // $(".nav .second").stop().slideToggle();
    $(this).next().stop().slideToggle();
  })

  /**
   * 3.   点击lt_main的左上角a里icon ,左侧边栏left:-180px;右边mian的padding-left:0;
   * 通过css样式  类切换即可
   */
  $(".main_header .icon_left").click(function () {
    $(".lt_aside").toggleClass("hideout");
    $(".lt_main .main_header").toggleClass("hideout");
    $(".lt_main").toggleClass("hideout");
  })

  //4. 点击模态框退出按钮  销毁用户登录信息  公共退出功能
  $(".main_header .icon_right").click(function () {
    //显示模态框
    $("#out_modal").show();
  });

  //点击退出按钮
  $("#btn_logout").click(function () {
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      dataType: "json",
      success: function (info) {
        //销毁成功
        location.href = "login.html";
      }
    })
  });

})