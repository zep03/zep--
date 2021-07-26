$(function() {
	$("[data-toggle='popover']").popover({
		animation: true, //淡入淡出
		html: true, //content中插入html代码
		container: "body",
		content: "<div style='width: 20px; height: 20px;'><img src='/public/img/erweima.jpg' style='width:30px; height: 50px'></div>", //插入图片的路径 及 样式
	});



	/* 轮播图特效 */

	var ptimer = null;
	var i = 0; // 指定一个序号
	var sum = $('#lunbo a').length;

	// 开启轮播函数，用来切换图片
	function startLunbo() {
		var pbgcolor = $("#lunbo>a").eq(i).attr("data-color");

		$("#lunbo>a").eq(i).fadeIn().siblings().fadeOut(900, function() {
			// 根据当前播放的是哪张图片来设置背景颜色
			$("#player").css("backgroundColor", pbgcolor)
		});

		// 列表也同时进行轮播
		$("#rlist>a").eq(i).addClass("z-Sel text-white").removeClass("text-muted").siblings().addClass(
			"text-muted").removeClass("z-Sel");


	}

	// 鼠标悬浮在轮播图片上时停止轮播，鼠标离开时开始轮播
	$("#lunbo>a").hover(function() {
		clearInterval(ptimer);
	}, function() {
		iLunbo();
	})


	// 自动播放函数
	function iLunbo() {
		clearInterval(ptimer);
		ptimer = setInterval(function() {
			i++;

			if (i == sum) {
				i = 0;
			}

			// 开启轮播函数，用来切换图片
			startLunbo();
		}, 2000);
	}

	// 初始化列表的第一个li带上三角图标,并且移除文字的灰色
	$("#rlist>a").eq(0).addClass("z-Sel text-white").removeClass("text-muted")

	// 初始化第一个图的背景颜色
	var pbgcolor = $("#lunbo>a").eq(0).attr("data-color");
	$("#player").css("backgroundColor", pbgcolor)

	// 开始自动轮播
	iLunbo();

	// 小定时器，用来判断鼠标是停留在li上了，还是只是经过了li
	var htimer = null;

	// 鼠标放到列表项上时，自动切换到对应的轮播图片
	$("#rlist>a").mouseover(function() {
		$(this).addClass("text-danger");

		var obj = $(this);
		htimer = setTimeout(function() {
			// 鼠标选择哪个列表项超过5秒钟，就把这个下标赋值给i
			clearInterval(ptimer);
			i = obj.index();
			startLunbo();
		}, 500)

	}).mouseout(function() {
		clearInterval(htimer);
		// 鼠标离开时，启动轮播
		$(this).removeClass("text-danger");
		iLunbo();
	})


	/* title部分的图片切换 */
	$('.news_s img').mouseover(function() {
		img_src = $(this).attr('src')
		// console.log(img_src)
		$('#swiperBox').attr('src',img_src)
		$(this).addClass('z-Sel ')
	})
	
	/* 免费好课 */
	$('.free').mouseover(function() {
		$(this).find('.sy_mask').css('visibility','visible');
		$(this).siblings().find('.sy_mask').css('visibility','hidden');
	})
	
	$('.free').mouseleave(function() {
		$(this).find('.sy_mask').css('visibility','hidden');
		
	})
	
	
	/* 鼠标悬浮在学长学姐分享图片上时隐藏标题 */
	$('.share').hover(function() {
		$(this).children('.shareTitle').css('visibility','hidden')
		
	},function() {
		$(this).children('.shareTitle').css('visibility','visible')
	})
	
	/* 对标培训  */
	$("#pk").children('.row').hover(function() {
		$(this).css("background","#AAA")
	}, function() {
		$(this).css("background","#FFF")
	})
})
