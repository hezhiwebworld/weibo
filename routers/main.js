var express = require('express');

var router = express.Router();

//数据库的接口，通过User和Category 可以操作数据库
var User = require('../models/User');
var Category = require('../models/Category');

router.get('/', function(req, res, next) {

    //读取所有的分类信息
    Category.find().then(function (categories) {

        res.render('main/index', {
            userInfo: req.userInfo,
            categories: categories
        });
    })

});
module.exports = router;