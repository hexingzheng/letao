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

        //2.分页
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
  };

  //3.点击添加分类按钮   显示模态框
  //4. 动态渲染下拉列表  当点击下拉按钮时再请求数据瞬间渲染时间太短  当点击添加分类按钮时就请求数据渲染下拉列表

  $("#add_category").click(function () {
    $("#sceond_modal").modal("show");

    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      // 通过传参 page=1 pageSize=100 模拟请求所有（一次性全部拿过来）一级分类列表的接口
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        var htmlStr = template("dropdownTpl", info);
        $(".dropdown-menu").html(htmlStr);
      }
    })
  });

  //5. 点击下拉菜单里面的内容 赋值给button框 需要事件委托



  $(".dropdown-menu").on("click", "a", function () {
    var txt = $(this).text();
    // console.log(txt);
    //直接赋值给button后面的箭头会覆盖，创建一个子元素并赋值
    // $("#dropdownMenu1 span:first-child").text(txt);
    $("#textBox").text(txt);
    //获取a上面存储的id赋值给隐藏域
    var id = $(this).data("id");
    // console.log(id);
    $('[name = "categoryId"]').val(id);
    // 手动将隐藏域的校验状态, 改成成功
    //创建了实例  调用原型上的方法 $('#form').data("bootstrapValidator")
    // updateStatus
    // 参数1. 字段名称
    // 参数2. 校验状态  VALID成功
    // 参数3. 配置校验规则, 用来配置错误提示信息
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
  });

  //6.点击图片上传（因为是button按钮无法获取file文件） 可以关联一个type=file的input（隐藏即可）框
  //获取图片的地址赋值给img的src达到预览功能 使用插件 fileupload
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      // console.log(data);
      // console.log(data.result.picAddr);
      var picUrl = data.result.picAddr;
      //把路径赋值给图片的src让其展示
      $(".imgBox img").attr("src", picUrl);
      //路径赋值给隐藏域
      $('[name="brandLogo"]').val(picUrl);
      // 手动将隐藏域的校验状态, 改成成功
      // updateStatus
      // 参数1. 字段名称
      // 参数2. 校验状态  VALID成功
      // 参数3. 配置校验规则, 用来配置错误提示信息
      $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });



  // 7. 添加分类表单校验 用插件
  // 用ajax提交给后台 一级目录名称提交是id, 图片提交是地址（ 这些是不想被用户看到） 用隐藏域完成

  $('#form').bootstrapValidator({
    // 配置排除项, 需要对隐藏域进行校验
    excluded: [],

    // 配置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },

    // 配置校验字段
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  })


  //8.表单校验成功事件
  $("#form").on('success.form.bv', function (e) {
    //阻止表单默认提交
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      // data: FormData,
      // contentType: false,
      // processData: false,
      data: $("#form").serialize(),
      dataType: "json",
      success: function (info) {
        //隐藏模态框
        $("#sceond_modal").modal("hide");
        // console.log(info);
        currentPage = 1;
        render();
      }
    })
  });



})