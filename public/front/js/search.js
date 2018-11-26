

/*
* 由于整个页面都在进行本地历史记录的操作, 所以约定键名: search_list
*
  以下 3 行代码, 用于在控制台执行, 添加假数据
  var arr = ["耐克", "啊迪", "阿迪王", "耐克王", "老奶奶", "老北京"];
  var jsonStr = JSON.stringify( arr );
  localStorage.setItem( "search_list", jsonStr );
* */


/*
* 功能分析
* 功能1: 本地历史记录渲染展示
* 功能2: 清空所有历史记录
* 功能3: 删除单条历史记录
* 功能4: 添加搜索历史
* */

$(function () {
  //功能1: 本地历史记录渲染展示
  //因为localstorage 只能存储简单数据类型  
  var jsonStr = localStorage.getItem("search_list");
  //console.log(jsonStr);
  //将字符串转成一个数组
  var arr = JSON.parse(jsonStr);

  //结合模板引擎渲染历史纪录页面

  var htmlStr = template("", { list: arr });
})