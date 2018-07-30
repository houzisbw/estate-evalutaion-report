var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//session
var session = require('express-session');
//session存储的位置
var MongoStore = require('connect-mongo')(session);
//网页端路由
var index = require('./routes/index');
var users = require('./routes/users');
var estate = require('./routes/estate');
var business_register = require('./routes/business_register');
var staff_arrange = require('./routes/house_arrange');
var normal_assesment = require('./routes/normal_assesment');
var house_arrangement_today = require('./routes/house_arrangement_today');
//微信登录路由
var wxLogin = require('./routes/wx_routes/wx_login');
//微信首页路由
var wxIndex = require('./routes/wx_routes/wx_index');
//微信详情页路由
var wxDetail = require('./routes/wx_routes/wx_detail');
//微信我的页面路由
var wxMine = require('./routes/wx_routes/wx_mine');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

//连接mongodb,线上部署时记得取消该注释
//mongoose.connect('mongodb://root:Sbw66620116@127.0.0.1:27017/estate_report?authSource=admin')
mongoose.connect('mongodb://127.0.0.1:27017/estate_report')
//监听:成功
mongoose.connection.on("connected",function(){
	console.log('mongodb connection success');
})
//监听:失败
mongoose.connection.on("error",function(){
	console.log('mongodb connection fail');
})

//微信小程序服务的session,只挂载到/wxApp下
app.use('/wxApp',session({
	//cookie的key值,默认connect.sid
	name:"kfzs_wxapp",
	//签名字符串
	secret:'sbwlqy',
	//session保存位置
	store: new MongoStore({
		//使用mongoose的链接来连接数据库,也可以启用新的链接
		mongooseConnection: mongoose.connection
	}),
	resave:true,
	//不保存未初始化的session,否则登录失败就会保存session
	saveUninitialized:false
}));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//设置静态文件目录,注意是2个，views是最终的打包结果
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

//路由中间件
app.use('/', index);
app.use('/users', users);
app.use('/estate',estate);
app.use('/business_register',business_register);
app.use('/staff_arrange',staff_arrange);
app.use('/normal_assesment',normal_assesment);
app.use('/house_arrangement_today',house_arrangement_today);
//微信路由,都挂载在wxApp下
//这个是微信服务登录统一拦截验证接口,放在wxLogin后面
var loginCheck = function(req,res,next){
	var username = req.session.username;
	if(username){
		//如果已登录，将控制权交给下一个中间件，不能少
		next();
	}else{
		//销毁session重新登录，此时可能是session过期或者用户退出小程序再登录
		res.json({
			status:-2
		})
	}
};
app.use('/wxApp',wxLogin,loginCheck,wxIndex,wxDetail,wxMine);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
