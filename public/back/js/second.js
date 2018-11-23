$(function () {

  //1.获取数据动态渲染页面
  var currentPage = 1;
  var pageSize = 5;
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        var htmlStr = template("secondTpl", info);
        $("tbody").html(htmlStr);

        //分页
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page, //当前页
          totalPages: Math.ceil(info.total / info.size), //总页数
          size: "small", //设置控件的大小，mini, small, normal,large
          onPageClicked: function (event, originalEvent, type, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          }
        });
      }
    });
  }

  //点击添加分类按钮   显示模态框

  $("#add_category").click(function () {
    $("#sceond_modal").modal("show");
  })


})