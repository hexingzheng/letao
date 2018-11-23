$(function () {
  //1. 获取数据动态渲染页面
  var currentPage = 1;
  var pageSize = 5;
  //进页面就要渲染页面
  render()

  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        var htmlStr = template("firstTpl", info);
        $("tbody").html(htmlStr);
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          size: "normal", //设置控件的大小，mini, small, normal,large
          onPageClicked: function (event, originalEvent, type, page) {
            //page为当前点击的页码
            currentPage = page;
            render();
          }
        });
      }
    })
  };


  //2. 点击添加分类按钮显示模态框
  $("#add_category").click(function () {
    $("#first_modal").modal("show");
  });

  // 3. 表单校验功能
  $('#form').bootstrapValidator({
    // 配置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },

    // 配置字段
    fields: {
      categoryName: {
        // 配置校验规则
        validators: {
          // 配置非空校验
          notEmpty: {
            message: "请输入一级分类名称"
          }
        }
      }
    }
  });


  // 4. 注册表单校验成功事件, 阻止默认的表单提交, 通过 ajax 提交
  $('#form').on("success.form.bv", function (e) {

    // 阻止默认的提交
    e.preventDefault();

    // 通过 ajax 提交
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $('#form').serialize(),
      dataType: "json",
      success: function (info) {
        console.log(info);
        if (info.success) {
          // 添加成功
          // 关闭模态框
          $('#addModal').modal("hide");
          // 重新渲染页面, 重新渲染第一页
          //因为新添加在第一个（后台倒序排列）
          currentPage = 1;
          render();

          // 内容和状态都要重置
          $('#form').data("bootstrapValidator").resetForm(true);
        }
      }
    })

  })

})