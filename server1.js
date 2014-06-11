/**
 * Date: 12-3-24 演示程序5 说明: 使用服务端模板nTenjin输出动态轻博客内容
 */
var http = require("http");
var tenjin = require('tenjin');
var fs = require('fs');

var htmlTemplete = {
	html : {},
	loadTemplete : function() {
		this.html['content'] = {};
		this.html['content'].string = fs.readFileSync('./pages/content.html',
				encoding = 'utf8');
		this.html['content'].template = new tenjin.Template();
		this.html['content'].template.convert(this.html['content'].string);// 我们需要在初始化时编译html模板,
		// 生成JavaScript函数，而不是每次访问调用模板时编译一遍。
	}
};
var i = 1;
htmlTemplete.loadTemplete();

http.createServer(function(request, response) {

	response.writeHead(200, {
		"Content-Type" : "text/html; charset=UTF-8"
	});

	testTenjin(response);
	i++;
	console.log("服务器访问被访问次数: i = " + i);
	response.end();

}).listen(8080);

var articles = [ "这是第一篇文章", "这是第二篇文章", "这是第3篇文章" ];
function testTenjin(response) {

	var result = htmlTemplete.html['content'].template.render(articles);// 调用模板，输出结果
	response.write(result);
	response.write(result);
}
console.log("服务器开启");
