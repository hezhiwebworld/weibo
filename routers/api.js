var express = require('express');

var router = express.Router();

var User = require('../models/User')
//统一的返回格式
router.use(function(req,res,next){
	responseData ={
		code:0,
		message:''
	};
	next();
})
//用户注册
//注册逻辑
	//1用户名不能为空2密码不能为空3两次输入的密码必须一致
	
	//判断用户是否注册   数据库查询
router.post('/user/register', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	var repassword = req.body.repassword;
	
	if(username == ''){
		responseData.code = 1;
		responseData.message = '密码不能为空';
		res.json(responseData);
		return;
	}
	if(password == ''){
		responseData.code = 2;
		responseData.message = '密码不能为空';
		res.json(responseData);
		return;
	}
	if(repassword != password){
		responseData.code = 3;
		responseData.message = '密码不能一样';
		res.json(responseData);
		return;
	}
		//数据库查询
		User.findOne({
			username:username
		}).then(function(userinfo){
			if(userinfo){
				responseData.code = 4;
				responseData.message = '被注册';
				res.json(responseData);
				return;
			}
				var user = new User({   //操作这个对象来保存数据到数据库
					username:username,
					password:password
				});
				return user.save();
			
		}).then(function(newuserinfo){
			
			responseData.message = '注册成功';
			res.json(responseData);
			return;
		});
		
		
});
//登录
router.post('/user/login',function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	if(username == '' || password == ''){
		responseData.code = 1;
		responseData.message = '用户密码不能为空';
		res.json(responseData);
		return;
	}
	//在数据亏中查询用户名和密码
	User.findOne({
			username:username,
			password:password
		}).then(function(userInfo){
			if(!userInfo){
				responseData.code = 2;
				responseData.message = '密码用户名错误';
				
				res.json(responseData);
				return;
			}
				responseData.message = '登录成功';
        responseData.userInfo = {
            _id: userInfo.id,
            username: userInfo.username,
            password: userInfo.password
        }
        //发送给浏览器保存
        req.cookies.set('userInfo', JSON.stringify(
            {
                _id: userInfo.id,
                username: userInfo.username,
                password: userInfo.password
            }
            )
        );
				res.json(responseData);
				return;
		
	});
});

//退出
router.get('/user/logout', function (req, res) {
    req.cookies.set('userInfo', null);
    responseData.messages = '退出成功';
    res.json(responseData);
    return;
})



module.exports = router;
