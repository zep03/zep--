var express = require('express')
var path = require('path')
var router = require('./router')

var bodyParser = require('body-parser')
var session = require('express-session')

var app = express()

/* 开放public 和 node_modules目录 */
app.use('/public/', express.static(path.join(__dirname,'./public/')))
app.use('/node_modules/', express.static(path.join(__dirname,'./node_modules/')))

// 在Node中，有很多第三方模板引擎都可以使用
// 设置模板引擎的后缀名为html
app.engine('html', require('express-art-template'))
// render()默认会去views目录下找文件，这是手动再设置一下是为了提醒，
// 后面想要它不去views目录找，可以按照下面的代码手动配置
app.set('views', path.join(__dirname, './views/'))

/* app.get('/', function(req, res) {
	res.render('index.html')
}) */

// 配置解析表单 POST 请求体插件
// （注意：一定要在app.use(router)之前配置）
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 在Express 这个框架中，默认不支持Session和Cookie
// 但是我们可以使用第三方中间件： express-session来解决
// 1. npm install express-session
// 2. 配置 (注意：一定要在app.use(router)之前配置）
// 3. 使用
//		当把这个插件配置好之后，我们就可以通过 req.session来访问和设置Session成员了
//		添加Session数据：req.session.foo = 'bar'
//		访问Session数据：req.session.foo
app.use(session({
	//配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
	// 目的是为了增加安全性，防止客户端恶意伪造
	secret: 'zep cat',
	resave: false,
	saveUninitialized: true // 无论你是否使用Session,来请求数据，我都默认给你分配一把钥匙
}))


// 把路由挂载到app中
app.use(router)

app.listen(5000, function() {
	console.log('running on port 5000...')
})
