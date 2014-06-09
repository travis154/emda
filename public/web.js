$(function(){
	var url = "https://graph.facebook.com/v2.0/294678554035358/posts?fields=likes.limit(1).summary(true),message,shares,picture&access_token=312876022197325|gDpu22u-NcP2jLEdDxEp61OteFA&limit=1000";
	var all = [];

	//get all posts
	async.forever(
		function(next){
			if(url){
				$.getJSON(url, function(res){
					var data = res.data;
					all = all.concat(data)
					if(res.paging && res.paging.next){
						url = res.paging.next;
						next(null);
					}else{
						url = undefined;
						next(new Error("s"))
					}
				});
			}
		},
		function(err){
			//parsing
			$("#fbmsg").hide();
			var map = _.map(all,function(post){
				var score=0;
				if(post.likes){
					score = post.likes.summary.total_count;
				}
				if(post.shares){
					score = score + (post.shares.count * 3);
				}
				post.score = score;
				return post;
			});
			var sorted = _.sortBy(map, function(post){
				return post.score;
			}).reverse();
			var ord = 1;
			sorted = sorted.splice(0,50);
			sorted.forEach(function(post){
				var el = $("<section />");
				el.attr("style", "padding: 10px;background: #F7F7F7;margin-bottom:10px;margin-right:5px;")
				el.addClass("col-md-8 col-sm-12")
				if(!post.message){
					return;
				}
				var name = post.message.split("\n")[0];
				el.append("<div class='row'><div class='col-md-3'><h1>#"+ord+"</h1><img class='img-circle img-responsive' src='"+post.picture+"' /></div><div class='col-md-9'><h1>"+name+"</h1><hr /><h2>"+post.score+" points</h2><h4>"+post.likes.summary.total_count+" likes / "+(post.shares ? post.shares.count : 0)+" shares</h4></div></div>")
				$("#stuff").append(el);
				ord++;
			})
		}
	);
});

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');			
ga('create', 'UA-36973691-1', 'iulogy.com');
ga('send', 'pageview');