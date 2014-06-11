var express = require('express');
var app = express();
var tenjin = require('tenjin');

var fs = require('fs'), path = require('path'), album_hdlr = require('./handlers/albums.js'), page_hdlr = require('./handlers/pages.js'), helpers = require('./handlers/helpers.js');

app.get('/v1/albums.json', album_hdlr.list_all);
app.get('/v1/albums/:album_name.json', album_hdlr.album_by_name);

app.get('/pages/:filename', function(req, res) {
	serve_static_file('pages/' + req.params.filename, res);
});
app.get('/pages/:dir/:filename', function(req, res) {
	serve_static_file('pages/' + req.params.dir + "/" + req.params.filename,
			res);
});

app.get('/monitor_header', function(req, res) {
	fs.readFile('./pages/monitor-header-test.html', function(err, contents) {
		if (err) {
			send_failure(res, 500, err);
			return;
		}

		contents = contents.toString('utf8');
		console.log(contents);
		var convertednTenjinTemplate = new tenjin.Template();
		var result = convertednTenjinTemplate.convert(contents);//编译html模板, 生成JavaScript函数
		
		res.writeHead(200, {
			"Content-Type" : "text/html"
		});
		res.end(result);
	});
});
app.get('/templates/:template_name', function(req, res) {
	serve_static_file("templates/" + req.params.template_name, res);
});
app.get('*', four_oh_four);

var sharedVariables = {
	header : "Header",
	header2 : "Header2",
	header3 : "Header3",
	header4 : "Header4",
	header5 : "Header5",
	header6 : "Header6",
	list : [ '1', '2', '3', '4', '5', '我是6', '7', '8', '9', ' 你好10' ],
	o : {
		a : [ '我是1啊', {
			b : {
				p : '我是p'
			}
		}, '3', '4', '5', '6', '7', '8', '9', ' 你好10' ]
	}
};
function four_oh_four(req, res) {
	res.writeHead(404, {
		"Content-Type" : "application/json"
	});
	res.end(JSON.stringify(helpers.invalid_resource()) + "\n");
}

function serve_static_file(file, res) {
	fs.exists(file, function(exists) {
		if (!exists) {
			res.writeHead(404, {
				"Content-Type" : "application/json"
			});
			var out = {
				error : "not_found",
				message : "'" + file + "' not found"
			};
			res.end(JSON.stringify(out) + "\n");
			return;
		}

		var rs = fs.createReadStream(file);
		rs.on('error', function(e) {
			res.end();
		});

		var ct = content_type_for_file(file);
		res.writeHead(200, {
			"Content-Type" : ct
		});
		rs.pipe(res);
	});
}

function content_type_for_file(file) {
	var ext = path.extname(file);
	switch (ext.toLowerCase()) {
	case '.html':
		return "text/html";
	case ".js":
		return "text/javascript";
	case ".css":
		return 'text/css';
	case '.jpg':
	case '.jpeg':
		return 'image/jpeg';
	default:
		return 'text/plain';
	}
}

app.listen(8080);
