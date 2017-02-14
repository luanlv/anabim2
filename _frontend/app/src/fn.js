import moment from 'moment'

export default {
	
	time: function(timestamp) {
		return moment.unix(timestamp/1000).fromNow();
	},
	
	secondToMinuteSecond: function(time){
		function str_pad_left(string,pad,length) {
			return (new Array(length+1).join(pad)+string).slice(-length);
		}
		
		var minutes = Math.floor(time / 60);
		var seconds = time - minutes * 60;
		console.log(minutes)
		var finalTime = str_pad_left(minutes,'0',2)+':' + str_pad_left(seconds,'0',2);
		return finalTime;
	},
	
	numberWithCommas: function(x) {
		var parts = x.toString().split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parts.join(".");
	},
	
	findUrlVideoBySlug: function(videos, url){
		var len = videos.length;
		if(url === undefined){
			for (var i = 0; i < len; i++){
				if(videos[i].url === "null") return videos[i].link;
			}
		} else {
			for (var i = 0; i < len; i++){
				if(videos[i].url === url) return videos[i].link;
			}
		}
		
		return "";
	},
	
	findVideoBySlug: function(videos, url){
		var len = videos.length;
		if(url === undefined){
			for (var i = 0; i < len; i++){
				if(videos[i].url === "null") return videos[i];
			}
		} else {
			for (var i = 0; i < len; i++){
				if(videos[i].url === url) return videos[i];
			}
		}
		
		return "";
	},
	
	findById: function(data, id){
		var len = data.length;
		for(var i=0; i < len; i++){
			if(data[i].id === id) return data[i]
		}
		return data[0];
	},

	fixVideo: function(video){
		video = video.replace(/\.mp4/g, '_\.m3u8');
		video = video.replace(/\.flv/g, '_\.m3u8');
		console.log(video)
		return video;
	}
	
	
}

