$(document).ready(function() {
var apiPuller = {
	
	topicsArray: ["Guinea Pig","Gerbil","Corgi","Shiba Inu","Husky"],
	

	populateButtons: function () {
		$("#button-container").empty();
		for(var i=0; i<this.topicsArray.length; i++) {
			var newBtn = $("<button>");
			newBtn.addClass("btn btn-secondary");
			newBtn.attr("data-topic",this.topicsArray[i]);
			newBtn.text(this.topicsArray[i]);
			$("#button-container").append(newBtn);
		}
	},

	addNewButton: function () {
		event.preventDefault();
		var newTopic = $("#topic-input").val().trim();
		apiPuller.topicsArray.push(newTopic);
		apiPuller.populateButtons();
	},

	pullFromAPIs: function () {
		var topic = $(this).attr("data-topic");
		var gifQueryURL = "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=dc6zaTOxFJmzC&limit=10"
		var tweetQueryURL = 

		$.ajax({
			url: gifQueryURL,
			method: "GET"
		}).done(function(response) {
			apiPuller.applyGifSpecification(response);
		});

		$.ajax({
			url: "https://www.googleapis.com/youtube/v3/search?&part=snippet&order=viewCount&&maxResults=10&q=" + topic + "&type=video&videoDefinition=high&key=AIzaSyA1JFCgQgVEnpjwp8YCvgh9Tzgl55aTqH4",
			method: "GET"
		}).done(function(response) {
			console.log(response);
			apiPuller.applyYouTubeSpecification(response);
		})
	},

	applyYouTubeSpecification: function (response) {
		$("#yt-box").empty();
		for(var i=0; i<response.items.length;i++){
			var ytDiv = $("<iframe>");
			var ytURL = "https://www.youtube.com/embed/" + response.items[i].id.videoId;
			console.log(ytURL);
			ytDiv.attr("src",ytURL);
			ytDiv.addClass("img-thumbnail my-1")
			$("#yt-box").append(ytDiv);
		}
	},

	applyGifSpecification: function (response) {
		$("#gif-box").empty();
		for(var i=0; i<response.data.length; i++){
			var gifDiv = $("<img>");
			var gifURL = response.data[i].images.fixed_height_still.url
			gifDiv.attr("src",gifURL);
			gifDiv.attr("data-state","still");
			gifDiv.attr("data-animate",response.data[i].images.fixed_height.url)
			gifDiv.attr("data-still",response.data[i].images.fixed_height_still.url)
			gifDiv.addClass("my-1 d-block mx-auto img-thumbnail")
			$("#gif-box").append(gifDiv);
		}
	},

	changeGifDisplay: function() {
		var state = $(this).attr("data-state");
		var animateValue = $(this).attr("data-animate");
		var stillValue = $(this).attr("data-still");

		if(state === "still"){
			$(this).attr("src",animateValue);
			$(this).attr("data-state","animate")
		}else{
			$(this).attr("src",stillValue);
			$(this).attr("data-state","still");
		}
	}

}

apiPuller.populateButtons();
$("#add-topic").on("click",apiPuller.addNewButton);
$(document).on("click",".btn-secondary",apiPuller.pullFromAPIs);
$(document).on("click","img",apiPuller.changeGifDisplay);

})