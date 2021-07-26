var mongoose = require('mongoose')
// 连接数据库
mongoose.connect('mongodb://admin:admin@127.0.0.1:27017/blob?authSource=admin',{ useNewUrlParser: true })
var Schema = mongoose.Schema

var userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	nickname: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	created_time: {
		type: Date,
		// 注意：这里不要写Date.now（）  因为会即刻调用
		//		这里直接给了一个方法：Date.now
		//		当你去new model的时候，如果你没有传递create_time，
		//		则mongoose就会调用default指定的Date.now方法，使用它的
		//		返回值作为默认值
		default: Date.now	
	},
	last_modified_time: {
		type: Date,
		default: Date.now
	},
	avatar: {
		type: String,
		default: '/public/img/avatar-default.png'
	},
	bio: {
		type: String,
		default: '开心敲代码'
	},
	gender: {
		type: Number,
		enum: [-1, 0, 1],
		default: -1 // 保密
	},
	birthday: {
		type: Date,
		default: '1999-07-14'
	},
	status: {
		type: Number,
		// 0 没有权限限制
		// 1 不可以评论
		// 2 不可以登录
		enum: [0, 1, 2],
		default: 0
		
	}
})




module.exports = mongoose.model('User', userSchema)