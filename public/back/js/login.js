/**
 * 表单校验
 */
$(function () {
  $("#form").bootstrapValidator({
    feedbackIcons: { /*input状态样式图片*/
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      username: {
        validators: {
          notEmpty: { //非空验证：提示消息
            message: '用户名不能为空'
          },
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须在2到6之间'
          },
          //插件固定方法
          callback: {
            message: "用户名不存在"
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: '密码不能为空'
          },
          stringLength: {
            min: 6,
            max: 12,
            message: '密码长度必须在6到12之间'
          },
          //插件固定方法
          callback: {
            message: "密码错误"
          }
        }
      }
    },
  });

  // 2. 进行登录请求
  //    通过 ajax 进行登录请求

  // 表单校验插件有一个特点, 在表单提交的时候进行校验
  // 如果校验成功, 继续提交, 需要阻止这次默认的提交, 通过 ajax 进行请求提交
  // 如果校验失败, 默认会阻止提交
  $("#form").on('success.form.bv', function (e) {
    // 阻止默认的表单提交
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      dataType: "json",
      //切记input一定要加name类，不然获取不了数据
      data: $("#form").serialize(),
      success: function (info) {
        if (info.success) {
          location.href = "index.html";
        }
        if (info.error === 1000) {
          //用户名错误
          //alert(info.message); 这种方法用户体验不好（使用下面的方法更好）
          // 插件提供$(form).data('bootstrapValidator')创建实例  然后访问原型上面的方法
          // 用户名不存在
          // 参数1: 字段名称
          // 参数2: 校验状态
          // 参数3: 配置规则, 用于提示
          $(form).data('bootstrapValidator').updateStatus("username", "INVALID", "callback");
        }
        if (info.error === 1001) {
          //密码错误
          //alert(info.message);这种方法用户体验不好（使用下面的方法更好）
          $(form).data('bootstrapValidator').updateStatus("password", "INVALID", "callback");
        }
      }
    })
  });
  // 3.重置功能 (本身reset按钮就可以重置内容, 需要调用表单校验插件的方法, 重置校验状态)
  //插件提供了该方法
  $('[type="reset"]').click(function () {

    // 重置状态
    // resetForm 如果传 true  表示内容和状态都重置
    //           不传参,      只重置状态
    $('#form').data("bootstrapValidator").resetForm();

  });
})