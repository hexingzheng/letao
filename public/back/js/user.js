$(function () {
  //获取后台数据渲染用户页
  //当前页码
  var currentPage = 1;
  //每页的数据条数
  var pageSize = 5;
  render();
  //封装一个渲染页面的方法
  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        var htmlStr = template("userTpl", info);
        $("tbody").html(htmlStr);

        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page, //当前页
          totalPages: Math.ceil(info.total / info.size), //总页数
          size: "normal", //设置控件的大小，mini, small, normal,large
          onPageClicked: function (event, originalEvent, type, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          }
        });
      }
    });
  };

  //2. 点击启用禁用  按钮   显示模态框(动态创建需要事件委托)
  //点击时获取还元素的id 和当前的状态 然后通过ajax进行修改
  var currentId;
  var isDelete;
  $("tbody").on("click", ".btn", function () {
    $("#user_modal").modal("show");
    currentId = $(this).parent().data("id");
    // console.log(currentId);
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
  });


  //点击模态框上的确定按钮发送ajax请求修改状态
  $("#user_btn").click(function () {
    $.ajax({
      type: "post",
      url: "/user/updateUser",
      data: {
        id: currentId,
        isDelete: isDelete
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        //关闭模态框
        $("#user_modal").modal("hide");
        render();
      }
    })
  });





})