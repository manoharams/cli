function getYouTube(playlist) {
    var browserKey = "AIzaSyCHK8jGuwDMvRQOoPaxKvKyJIFoEScB8vk";
    
    var youtubeAPI = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId="+playlist+"&key="+browserKey+"&maxResults=50";
    
    $.get(youtubeAPI, function(data) {
        
        var videos = data.items.map(function(item){
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                published = new Date(item.snippet.publishedAt),
                day = published.getDate(),
                month = published.getMonth(),
                year = published.getFullYear(),
                publishDate = months[month] + " " + day + ", " + year;

            return {
                videoId: item.snippet.resourceId.videoId,
                playlistId: item.snippet.playlistId,
                title: item.snippet.title,
                description: item.snippet.description,
                published: publishDate,
                channelTitle: item.snippet.channelTitle,
                thumbnails: item.snippet.thumbnails
            };
        });
        
        var tmplFn = window.tmpl(
            '<div class="media" data-videoId="<%= video.videoId %>">' +
                '<div class="media-left media-top">' +
                    '<a href="?vid=<%= video.videoId %>#videoPlayer" class="thumbnail">' +
                        '<img class="media-object" src="<%= video.thumbnails.medium.url %>" alt="<%= video.title %>">' +
                    '</a>' +
                '</div>' +
                '<div class="media-body">' +
                    '<h4 class="media-heading">' +
                        '<a href="?vid=<%= video.videoId %>#videoPlayer"><%= video.title %></a>' +
                        '<div class="media-meta"><small><%= video.published %></small></div>' +
                    '</h4>' +
                    '<div class="media-description"><%= video.description %></div>' +
                '</div>' +
            '</div>'
        );
        
        $(".video-list-wrapper")[0].outerHTML = videos.map(function(item){
            return tmplFn({ video: item });
        }).join("\n");
        
        var specificVideo = getUrlParameter("vid"),
            videoIndex = -1;
        
        for(var i = 0; i < videos.length; i++){
            if (hasValue(videos[i], "videoId", specificVideo)) {
                videoIndex = i;
                break;
            }
        }
        
        if (videoIndex >= 0) {
            loadVideo(videos[videoIndex], true);
        } else {
            loadVideo(videos[0], false);
        }
        
    });
};

function loadVideo(video, autoplay) {
    var videoId = video.videoId,
        playlistId = video.playlistId,
        autoPlay = (autoplay == undefined || !!autoplay) ? "1" : "0",
        videoPlayer = document.getElementById("videoPlayer");
    
    document.title += ": "+video.title;
    return videoPlayer.src = "https://www.youtube.com/embed/"+videoId+"?listType=playlist&list="+playlistId+"&autoplay="+autoPlay;
};

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function hasValue(obj, key, value) {
    return obj.hasOwnProperty(key) && obj[key] === value;
}
