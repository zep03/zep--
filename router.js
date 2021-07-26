var express = require('express')
var User = require('./models/user')
var Topic = require('./models/topic')
var Comment = require('./models/comment')
var md5 = require('blueimp-md5')

var router = express()



router.get('/', function(req, res) {
	res.render('index.html')
})


router.get('/login', function(req, res) {
	res.render('login.html')
})

router.get('/community', function(req, res) {
	// console.log(req.session.user)
	Topic.find(function(err, topicList) {
		if (err) {
			console.log(err)
			return res.status(500).send('Server error!')
		}
		res.render('community.html', {
			user: req.session.user,
			topicList: topicList
		})
	})
})

router.get('/communication', function(req, res) {
	Topic.find(function(err, topicList) {
		if (err) {
			console.log(err)
			return res.status(500).send('Server error!')
		}
	
		res.render('communication.html', {
			user: req.session.user,
			topicList: topicList
		})
	})
	
})

router.post('/login', function(req, res) {
	// 1.获取表单数据
	// 2.查询数据库用户名密码是否正确
	// 3.发送响应数据
	// console.log(req.body)
	var body = req.body
	User.findOne({
		email: body.email,
		password: md5(md5(body.password) + 'zep')
	}, function(err, user) {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: err.message
			})
		}

		if (!user) {
			return res.status(200).json({
				err_code: 1,
				message: 'email or password is invalid.'
			})
		}
		// 用户存在，登录成功，记录登陆状态
		/* var hour = 604800
		req.session.cookie.expires = new Date(Date.now() + hour) */
		req.session.user = user

		res.status(200).json({
			err_code: 0,
			message: 'OK'
		})

	})
	// res.render('login.html')
})

router.get('/register', function(req, res) {
	res.render('register.html')
})

router.post('/register', function(req, res) {
	// 1.获取表单提交的数据
	// 2.操作数据库
	//		判断该用户是否存在
	//		如果已存在，不允许注册
	//		如果不存在，则注册新建用户
	// 3.发送响应
	var body = req.body
	User.findOne({
		$or: [{
				email: body.email
			},
			{
				nickname: body.nickname
			}
		]
	}, function(err, data) {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '服务端错误'
			})
		}

		if (data) {
			// 邮箱或者昵称已存在
			return res.status(200).json({
				err_code: 1,
				message: '邮箱或者昵称已存在'
			})
			/* return res.render('register.html', {
				err_message: '邮箱或者昵称已存在',
				form: body
			}) */
		}

		// 对密码进行md5 重复加密
		body.password = md5(md5(body.password) + 'zep')

		new User(body).save(function(err, user) {
			if (err) {
				return res.status(500).json({
					err_code: 500,
					message: '服务端错误'
				})
			}
			// 注册成功，使用Session记录用户的登录状态
			req.session.user = user

			// Express 提供了一个响应方法：json()
			// 该方法接收一个对象作为参数，它会自动帮你把对象转为字符串在发送给浏览器
			res.status(200).json({
				err_code: 0,
				message: 'ok'
			})
		})
	})
})


router.get('/logout', function(req, res) {
	// 清除登录状态
	req.session.user = null
	// 重定向到登录页
	res.redirect('/login')
})


router.get('/topics', function(req, res) {
	var topic_id = req.query.topic_id.replace(/"/g, '')
	console.log(topic_id)
	Topic.findOne({
		_id: topic_id
	}, function(err, topic) {
		if (err) {
			console.log(topic)
			return res.status(500).send('Server error!')
		}
		
		// 查询评论
		Comment.find({
			article_id: topic_id
		}, function(err, comment) {
			if(err) {
				console.log(comment)
				return res.status(500).send('Server error!')
			}
			console.log(comment)
			res.render('topics/show.html', {
				topic: topic,
				user: req.session.user,
				comment: comment
			})
		})		
	})
})




router.get('/topics/show', function(req, res) {
	topic_id = req.session.topic_id
	Topic.findOne({
		_id: topic_id
	}, function(err, topic) {
		if (err) {
			return res.status(500).send('Server error!')
		}
		
		// 查询评论
		Comment.find({
			article_id: topic_id
		}, function(err, comment) {
			if(err) {
				console.log(comment)
				return res.status(500).send('Server error!')
			}
			console.log(comment)
			res.render('topics/show.html', {
				topic: topic,
				user: req.session.user,
				comment: comment
			})
		})
	})

})

router.get('/topics/edit', function(req, res) {
	if (req.query.id) {
		topic_id = req.query.id.replace(/"/g, '')
		console.log(topic_id)
		Topic.findOne({
			_id: topic_id
		}, function(err, topic) {
			if (err) {
				console.log(err)

				return res.status(500).send('Server error!')
			}
			res.render('topics/edit.html', {
				topic: topic,
				user: req.session.user
			})
		})
	} else {
		res.render('404.html')
	}
})


router.post('/topics/edit', function(req, res) {
	console.log(req.body)
	Topic.findByIdAndUpdate(req.session.topic_id, req.body, function(err) {
		if (err) {
			return res.status(500).send('Server error!')
		}
		res.status(200).json({
			err_code: 0,
			message: 'ok'
		})
	})
})




router.get('/topics/new', function(req, res) {
	res.render('topics/new.html', {
		user: req.session.user
	})
})

router.post('/topics/new', function(req, res) {
	/* res.render('topics/new.html') */
	var body = req.body
	body.email = req.session.user.email
	new Topic(body).save(function(err, topic) {
		console.log(err)
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '服务端错误'
			})
		}
		// console.log(topic.id)
		req.session.topic_id = topic.id
		// Express 提供了一个响应方法：json()
		// 该方法接收一个对象作为参数，它会自动帮你把对象转为字符串在发送给浏览器
		res.status(200).json({
			err_code: 0,
			message: 'ok'
		})
	})
})

router.get('/settings/admin', function(req, res) {
	res.render('settings/admin.html', {
		user: req.session.user
	})
})

router.get('/settings/profile', function(req, res) {
	// console.log(req.session.user)
	res.render('settings/profile.html', {
		user: req.session.user
	})
})


/* 修改密码 */
router.post('/settings/admin', function(req, res) {
	// console.log(req.body)
	var old_psd = md5(md5(req.body.old_psd) + 'zep')
	var new_psd = req.body.new_psd
	var new_psd2 = req.body.new_psd2
	console.log(old_psd)
	User.findOne({
		_id: req.session.user._id
	}, function(err, user) {
		if (err) {
			return res.status(500).send('Server error!')
		}
		console.log(user.password)
		// 判断用户输入的密码是否和数据库中保存的密码一致
		// 不一致则不能进行修改密码操作
		if (user.password != old_psd) {
			return res.status(500).json({
				err_code: 500,
				message: '密码错误'
			})
		}

		if (new_psd != new_psd2) {
			return res.status(200).json({
				err_code: 1,
				message: '两次输入的密码不一致'
			})
		}
		var obj = {}
		obj.password = md5(md5(new_psd) + 'zep')
		// obj.password = new_psd

		User.findByIdAndUpdate(req.session.user._id, obj, function(err) {
			if (err) {
				return res.status(500).send('Server error!')
			}
			res.status(200).json({
				err_code: 0,
				message: 'ok'
			})
		})
		/* res.render('topics/show.html', {
			topic:  topic
		}) */
	})

})

/* 删除用户 */
router.get('/deleteUser', function(req, res) {
	User.deleteOne({
		_id: req.session.user._id
	}, function(err, data) {
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '服务端错误'
			})
		}

		// 删除成功后需要把该用户发表的文章也删掉，即删除topic表中的该用户的数据
		Topic.deleteMany({
			email: req.session.user.email
		}, function(err, data) {
			if (err) {
				return res.status(500).json({
					err_code: 500,
					message: '服务端错误'
				})
			}

			console.log('删除topic成功')
		})


		res.status(200).json({
			err_code: 0,
			message: 'ok'
		})
		req.session.user = null
	})
	// res.render('settings/profile.html')
})


/* 评论 */
router.post('/comments', function(req, res) {
	/* res.render('topics/new.html') */
	
	// console.log(req.session.user.email)
	var body = req.body
	var email = req.session.user.email
	var commentContent = body.commentContent
	var topic_id = body.topic_id
	
	var body = {
		'email': email,
		'commentContent': commentContent,
		'article_id': topic_id
	}
	console.log(body)
	new Comment(body).save(function(err, id) {
		console.log(err)
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '服务端错误'
			})
		}
		// Express 提供了一个响应方法：json()
		// 该方法接收一个对象作为参数，它会自动帮你把对象转为字符串在发送给浏览器
		res.status(200).json({
			err_code: 0,
			message: 'ok'
		})
	})
	
	
	
})


/* router.post('/settings/profile', function(req, res) {
	// console.log(req.session.user)
	res.render('settings/profile.html', {
		user: req.session.user
	})
}) */


router.get('/show1', function(req, res) {

	res.render('topics/show1.html')

})

/* 模糊查询 */
router.post('/searchTopicList', function(req, res) {
	console.log(req.body)
	keyword = req.body.searchValue
	var _filter = {
		$or: [ // 多字段同时匹配
			{
				title: {
					$regex: keyword
				}
			},
			{
				content: {
					$regex: keyword,
					$options: '$i'
				}
			}, //  $options: '$i' 忽略大小写
			{
				email: {
					$regex: keyword,
					$options: '$i'
				}
			}
		]
	}
	Topic.find(_filter, function(err, topicList1) {
		console.log(topicList1)
		if (err) {
			return res.status(500).json({
				err_code: 500,
				message: '服务端错误'
			})
		}
		/* res.render('index1.html', {
		 	
		 	topicList: topicList1
		 }) */
		 return res.status(200).json({
		 	err_code: 200,
		 	message: topicList1
		 })
	})

})


module.exports = router
