$(function () {
  //1. 动态渲染页面
  //当前页
  var currentPage = 1;
  //每页数据条数
  var pageSize = 3;
  // 图片预览存储地址的容器
  var picArr = [];
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
        // console.log(info);
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

    //点击商品按钮同时就要准备模态框下拉菜单的渲染
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        //一次性拿到所有数据
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

  //4. 点击下拉菜单里面的a 让其内容显示在上面文本框  通过事件委托

  $(".dropdown-menu").on("click", "a", function () {
    $("#textBox").text($(this).text());
    //往后台传的是id 将其赋值给隐藏于
    var id = $(this).data("id");
    // console.log(id);
    $('[name="brandId"]').val(id);
    //将隐藏域状态重置
    $("#form").data('bootstrapValidator').updateStatus("brandId", "VALID");
  });






  //5.图片预览

  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      // console.log(data);
      //获取上传图片路径 data.result.picAddr
      var picObj = data.result;
      // console.log(picObj);
      //添加到存储路径的容器,往前面添加
      picArr.unshift(picObj);
      //将地址赋值给img的src属性
      $("#imgBox").prepend('<img src="' + picObj.picAddr + '" style="width: 100px;">');
      //最多三张图片  超出三张删除数组最后一项,同时删除html结构中的最后一个img标签
      if (picArr.length > 3) {
        picArr.pop();
        //remove自杀式删除   empty清空子节点
        $("#imgBox img:last-of-type").remove();
      }
      if (picArr.length == 3) {
        $("#form").data('bootstrapValidator').updateStatus("picStatus", "VALID");
      }
    }
  });





  //6. 表单校验
  $("#form").bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],

    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          },
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          },
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          },
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '请输入数字'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '请输入格式为xx-xx的数字 例如：36-44'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          },
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          },
        }
      },
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片" //要在图片满三张改变非表单元素的状态
          },
        }
      }

    }
  })

  //7.校验完成shijian
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    //多张图片 拼接到
    var formStr = $("#form").serialize();
    // console.log(str);根据原有的格式拼接即可
    formStr += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
    formStr += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
    formStr += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;
    console.log(formStr);
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: formStr,
      success: function (info) {
        console.log(info);
        if (info.success) {
          //隐藏模态框
          $("#product_modal").modal("hide");

          currentPage = 1;
          render();
          //重置表单
          $("#form").data("bootstrapValidator").resetForm(true);

          //手动重置非表单元素
          $("#textBox").text("请选择二级分类");
          //img重置只要将数组为空即可
          picArr = [];
        }
      }
    })

  })

})