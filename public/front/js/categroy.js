
$(function () {

  //1.动态渲染分类页左侧的列表页
  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    dataType: "json",
    success: function (info) {
      // console.log(info.rows[0].id);
      var htmlStr = template("leftTpl", info);
      $("#lt_category").html(htmlStr);
      // 一进页面就要渲染列表和第一分类的 右边页面
      getSecondCategory(info.rows[0].id);
    }
  });
  // 2. 根据左边的分类（点击事件要用事件委托） id 发送ajax获取后台信息渲染右边的页面  

  $("#lt_category").on("click", "a", function () {
    //点击当前切换current类
    // $(this).addClass("current").parent().siblings().find("a").removeClass("current");
    $("#lt_category a").removeClass("current");
    $(this).addClass("current");
    //获取当前点击的id
    var id = $(this).data("id");
    getSecondCategory(id)
  })

  function getSecondCategory(id) {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      data: {
        id: id
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        var htmlStr = template("rightTpl", info);
        $("#right_category").html(htmlStr);
      }
    })
  }


})