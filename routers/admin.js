var express = require('express');

var router = express.Router();

var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

router.use(function (req, res, next) {

    if (!req.userInfo.isadmin) {
        res.send('sorry,只有管理员才可以进入后台管理');
        next()
    }

    next();


});
//首页
router.get('/', function (req, res, next) {

    res.render('admin/index', {
        userInfo: req.userInfo
    })
});
//用户管理
router.get('/user', function (req, res, next) {
    //读取用户列表
    //limit(number) 限制获取的数据条数
    //忽略数据的条数
    //skip（2）   console.log(req.query.page);

    var page = Number(req.query.page || 1);

    var limit = 2;

    //获取数据库总条数
    User.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);

        var skip = (page - 1) * limit;

        User.find().limit(limit).skip(skip).then(function (users) {

            res.render('admin/userlist', {
                userInfo: req.userInfo,
                users: users,
                pages: pages,
                count: count,
                limit: limit,
                page: page
            });


        })

    })

});
//分类首页 路由
router.get('/category', function (req, res, next) {

    //分类首页分页
    var page = Number(req.query.page || 1);

    var limit = 15;

    //获取数据库总条数
    Category.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);

        var skip = (page - 1) * limit;

        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function (categories) {

            res.render('admin/categorylist', {
                userInfo: req.userInfo,
                categories: categories,
                pages: pages,
                count: count,
                limit: limit,
                page: page
            });


        })

    })
});
//分类首页下面的分类添加  子路由
router.get('/add', function (req, res, next) {


    res.render('admin/add', {
        userInfo: req.userInfo
    })
});

router.post('/add', function (req, res) {
    //提交数据到本业面console.log(req.body)
    var categoryname = req.body.categoryname;
    if (categoryname == '') {
        res.render('admin/404', {
            userInfo: req.userInfo,
            url: '/admin',
            message: '名字不能为空',
        })
        return;
    }
    //查询数据是否有同名存在
    Category.findOne({
        categoryname: categoryname
    }).then(function (re) {
        if (re) {
            res.render('admin/404', {
                userInfo: req.userInfo,
                url: '/admin',
                message: '分类已存在'
            });
            return promise.reject();
        } else {
            var category = new Category({
                categoryname: categoryname
            });
            return category.save();
        }
    }).then(function (newc) {
        // console.log(newc)
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '添加分类成功',
            url: '/admin/add'
        })
    })

});

//分类修改与删除
router.get('/edit', function (req, res, next) {

    var id = req.query.id;
    //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.render('admin/404', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            })
        } else {
            res.render('admin/edit', {

                userInfo: req.userInfo,
                category: category

            });

        }
    });

});


//添加修改并存
router.post('/edit', function (req, res) {

    //提交数据到本业面console.log(req.body)
    var categoryname = req.body.categoryname;
    if (categoryname == '') {
        res.render('admin/404', {
            userInfo: req.userInfo,
            url: '/admin',
            message: '名字不能为空',
        })
        return;
    }
    //查询数据是否有同名存在
    Category.findOne({
        categoryname: categoryname
    }).then(function (re) {
        if (re) {
            res.render('admin/404', {
                userInfo: req.userInfo,
                url: '/admin',
                message: '分类名已存在'
            });

        } else {
            var category = new Category({
                categoryname: categoryname
            });
            return category.save();
        }
    }).then(function (newc) {
        // console.log(newc)
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        })
    })

});


//分类删除
router.get('/delete', function (req, res, next) {


    var id = req.query.id || '';

    Category.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        });
    });

});


//博客内容
router.get('/content', function (req, res, next) {

    var page = Number(req.query.page || 1);

    var limit = 15;

    //获取数据库总条数
    Content.count().then(function (count) {
        //计算总页数
        pages = Math.ceil(count / limit);
        page = Math.min(page, pages);
        page = Math.max(page, 1);

        var skip = (page - 1) * limit;

        Content.find().sort({_id: -1}).limit(limit).skip(skip).then(function (contents) {

            res.render('admin/content', {
                userInfo: req.userInfo,
                contents: contents,
                pages: pages,
                count: count,
                limit: limit,
                page: page
            });


        })

    })
});


//内容添加
router.get('/addcont', function (req, res, next) {

    //从数据库中获取所有分类
    Category.find().sort({_id: -1}).then(function (cates) {
        res.render('admin/addcont', {
            userInfo: req.userInfo,
            categories: cates
        })
    });

});
//内容保存
router.post('/addcont', function (req, res, next) {

    //从数据库中获取所有分类console.log(req.body)
    if (!req.body.category) {
        res.render('admin/404', {
            userInfo: req.userInfo,
            message: '分类不能为空'
        });
        return;
    }
    if (!req.body.title) {
        res.render('admin/404', {
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        });
        return;
    }
    //获取所有内容
    var content = new Content({
        category: req.body.category,
        title: req.body.title,
        miaoshu: req.body.miaoshu,
        content: req.body.content
    }).save().then(function (rd) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/addcont'
        });
    });


});


//不想管理首页 路由
router.get('/bxgl', function (req, res, next) {

    res.render('admin/bxgl', {
        userInfo: req.userInfo
    })
});

//不想学习首页 路由
router.get('/bxxx', function (req, res, next) {

    res.render('admin/bxxx', {
        userInfo: req.userInfo
    })

});
module.exports = router;