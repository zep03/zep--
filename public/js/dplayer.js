var dp1;
var dp2;
var dp3;
var dp4;
var dp0;

$(function() {
	dp0 = new DPlayer({
		container: document.getElementById('dplayer0'),
		video: {
			url: 'http://vjs.zencdn.net/v/oceans.mp4',
			pic: '/public/img/share/s1.jpg',
			mutex: true,
		},
		danmaku: {
			id: "2121021212",
			api: 'https://dplayer.moerats.com/'
		},
	});
	
	dp1 = new DPlayer({
		container: document.getElementById('dplayer1'),
		video: {
			url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
			pic: '/public/img/share/s2.png',
			mutex: true,
		},
		danmaku: {
			id: "212121212",
			api: 'https://dplayer.moerats.com/'
		},
	});

	dp2 = new DPlayer({
		container: document.getElementById('dplayer2'),
		video: {
			url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
			pic: '/public/img/share/s3.png',
			mutex: true,
		},
		danmaku: {
			id: "21213212sa2188212",
			api: 'https://dplayer.moerats.com/'
		},
	});

	dp3 = new DPlayer({
		container: document.getElementById('dplayer3'),
		video: {
			url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
			pic: '/public/img/share/s3.png',
			mutex: true,
		},
		danmaku: {
			id: "2177212812dsdsds12",
			api: 'https://dplayer.moerats.com/'
		},
	});

	dp4 = new DPlayer({
		container: document.getElementById('dplayer4'),
		video: {
			url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
			pic: '/public/img/share/s2.png',
			mutex: true,
		},
		danmaku: {
			id: "2162121dsdsdsds212",
			api: 'https://dplayer.moerats.com/'
		},
	});
})
