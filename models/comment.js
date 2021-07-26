var mongoose = require('mongoose')
// 连接数据库
mongoose.connect('mongodb://admin:admin@127.0.0.1:27017/blob?authSource=admin',{ useNewUrlParser: true })
var Schema = mongoose.Schema

var commentSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	commentContent: {
		type: String,
		required: true
	},
	// 被评论的文章ID
	article_id: {
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
	}
})




module.exports = mongoose.model('Comment', commentSchema)