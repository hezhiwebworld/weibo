//应用程序入口文件

var express = require('express');
//加载模板模块
var swig = require('swig');

var mongoose = require('mongoose');

//加载body-parser ,用来处理post提交过来的数据
var bodyParser = require('body-parser');
//加载cookies模块
var Cookies = require('cookies');



//创建app应用=》 等同于服务端的对象Http.createServer()
var app = express();

//引入用户模型
var User = require('./models/User');
var Category = require('./models/Category');
//设置静态文件托管
app.use('/public', express.static(__dirname + '/public'));



//配置模板
//第一个参数：模板引擎的名称，同时也是模板文件的后缀  第二个参数表示用于解析处理模板内容的方法
app.engine('html',swig.renderFile);
//设置模板文件存放的目录
app.set('views','./views');
app.set('view engine','html');
//取消模板引擎的缓存机制，默认true，改成false
swig.setDefaults({cache:false});

app.use(bodyParser.urlencoded({extended:true}));
//会自动在后端req添加一个属性body，保存post的数据

app.use(function (req, res, next) {
    req.cookies = new Cookies(req, res);
    //用一个自定义对象来存储cookies
    req.userInfo = {};
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            //获取当前用户类型是否为管理员
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isadmin = Boolean(userInfo.isadmin);
                next();
            })

        } catch (e) {
            next();
        }
    } else {
        next();
    }


})


//根据不同功能划分模块
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));


//首页
app.get('/',function(req, res,next){
	//res.send('<h1>欢迎光临我的博客</h1>');
	
	// 读取views目录下制定的文件
	res.render('index')
})

//监听用户请求
//用户通过url访问


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/blog2',function(err){
	if(err){
		console.log('shibai')
	}else{
		console.log('success');
		
	}
}); 

app.listen(8081);

/* app.get('/main.css',function(req, res,next){
	res.setHeader('content-type','text/css');  //默认发送html文件  需要修改成css
	res.send('body{background:red;}')
}) */




//用户发送http请求-》url -》解析路由 -》找到匹配的规则-》执行指定绑定函数，返回对应得内容到用户

/* /public ->静态-》直接读取指定目录下的文件，返回给用户

/-> 动态- 》处理业务逻辑->加载模板->处理模板-》返回给用户
 */
















