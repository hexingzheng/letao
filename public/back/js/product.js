$(function () {
  //1. 动态渲染页面
  //当前页
  var currentPage = 1;
  //每页数据条数
  var pageSize = 3;
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template("productTpl", info);
        $("tbody").html(htmlStr);

        //2. 分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          size: "nomal",//设置控件的大小，mini, small, normal,large
          onPageClicked: function (event, originalEvent, type, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          }
        });
      }
    })
  };


  //3. 点击添加商品按钮  显示模态框 
  $("#add_product").click(function () {
    $("#product_modal").modal("show");
  })
})