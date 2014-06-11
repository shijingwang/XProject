var tenjin = require('tenjin');
var v = tenjin.render('Hello #{it.name}!', {
	name : 'nTenjin'
});
console.log(v);
