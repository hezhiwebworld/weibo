var express = require('express');

var router = express.Router();

router.get('/', function(req, res, next) {
	
	
	res.send('这是首页')

	/*var date = new Date();
	var folder = '/' + date.getFullYear() + (date.getMonth() + 1);

  	upyun.listDir(folder, 20, 'asc', 20, function(err, result) {
		
		if(err) {
			res.render('result', {'message': '!'});
		}

		res.render('index', {
			'result': result.data.files,
			'folder': folder
		});
	});*/ 
	
});
module.exports = router;