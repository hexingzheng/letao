/**
 * 进度条功能
 */

$(function () {
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
})