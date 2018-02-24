require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];

var getArtistNames = function(artist) {
  return artist.name;
};

if(command == 'my-tweets'){
	//show your last 20 tweets and when they were created
	var params = {screen_name: 'SarahCStauber'};
	client.get('statuses/user_timeline', params, function(error, tweets, response){
		if(!error){
			for(var i = 0; i < tweets.length && i < 20; i++){
				console.log("SarahCStauber Tweet: " + tweets[i].text + ";  Created: " + tweets[i].created_at);
			}	
		}
	});
}
else if (command == 'spotify-this-song') {
	//show the following info: Artist, SOng Name, Preview Link, albumclear
	//if no song is provided defautl to The Sign by Ace of BAse
	var nodeSong = process.argv;
	var song = "";
	for(var i =3; i < nodeSong.length; i++){
		song = song + " " + nodeSong[i];
	}
	
	
	if(song){
		//return song
		spotify.search({type: 'track', query: song}, function(err, data){
			if(err){
				return console.log("Error occurred: " + err);
			}
			console.log("Artist Name: " + data.tracks.items[0].album.artists[0].name + "\n Song Name: " + song + 
				"\n Preview Link: " + data.tracks.items[0].preview_url + "\n Album: " + data.tracks.items[0].album.name);
		});

	}
	else{
		//search Bye Bye Bye
		spotify.search({type: 'track', query: 'Bye Bye Bye'}, function(err, data){
			if(err){
				return console.log("Error Occurred: " + err);
			}
			console.log("Artist Name: " + data.tracks.items[0].album.artists[0].name + "\n Song Name: Bye Bye Bye \n Preview Link: " 
				+ data.tracks.items[0].preview_url + "\n Album: " + data.tracks.items[0].album.name);
		});
	}
}
else if (command == 'movie-this'){
	var nodeMovie = process.argv;
	var movie = "";

	for(var i = 3; i < nodeMovie.length; i++){
		movie = movie + "+" + nodeMovie[i];
	}
	var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

	if(movie){
		//return movie
		request(queryUrl, function(error, response, body){

			if (!error && response.statusCode === 200) {
		    console.log("Movie Title: " + JSON.parse(body).Title + "\n Year: " + JSON.parse(body).Year + "\n IMDB Rating: " 
		    	+ JSON.parse(body).imdbRating + "\n Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\n Country: " + JSON.parse(body).Country + "\n Lanugage: " + JSON.parse(body).Plot + "\n Actors: " + JSON.parse(body).Actors);
		  }
		});
	}
	else{
		//search for Gone in 60 seconds
		var queryUrl = "http://www.omdbapi.com/?t=gone+in+60+seconds&y=&plot=short&apikey=trilogy";

		request(queryUrl, function(error, response, body){

			if (!error && response.statusCode === 200) {
			console.log("Movie Title: " + JSON.parse(body).Title + "\n Year: " + JSON.parse(body).Year + "\n IMDB Rating: " 
		    	+ JSON.parse(body).imdbRating + "\n Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + 
		    	"\n Country: " + JSON.parse(body).Country + "\n Lanugage: " + JSON.parse(body).Plot + "\n Actors: " + JSON.parse(body).Actors);    
		  }
		});

	}
}
else if(command == 'do-what-it-says'){
	//read the random txt file and search for what it says
	fs.readFile("random.txt", "utf8", function(error, data){

		if (error){
			return console.log(error);
		}
		var dataArr = data.split(",");

		spotify.search({type: 'track', query: dataArr[1]}, function(err, data){
			if(err){
				return console.log("Error Occurred: " + err);
			}
			console.log("Artist Name: " + data.tracks.items[0].album.artists[0].name + "\n Song Name: " + dataArr[1] + "\n Preview Link: " 
				+ data.tracks.items[0].preview_url + "\n Album: " + data.tracks.items[0].album.name);
		});

	});
}

