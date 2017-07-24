//Use request to grab data from OMDB
var request = require('request');

var fs = require('fs');

//Keys needed to use Twitter and Spotify packages
var keys = require("./keys");

//Require the Twitter package, create a new twitter object, and assign keys to it
var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
    consumerKey: keys.twitterKeys.consumer_key,
    consumerSecret: keys.twitterKeys.consumer_secret,
    accessToken: keys.twitterKeys.access_token_key,
    accessTokenSecret: keys.twitterKeys.access_token_secret,
});

//Require the spotify package, create a new spotify object, and assign keys to it
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
   id: keys.spotifyKeys.id,
   secret: keys.spotifyKeys.secret,
});

//Variable to store the action specified by the user
var action = process.argv[2];

/****EVENTS****/

//Execute functions dependent on the action specified by the user
if (action === 'my-tweets') {
    console.log('Show tweets');
    getTweets();
} 
else if (action === 'spotify-this-song') {
    if (process.argv[3] === undefined) {
        getDefaultSongData();
    } else {
        title = process.argv[3];
        searchSpotify();
    };
} 
else if (action === 'movie-this') {
    if (process.argv[3] === undefined) {
        getDefaultMovieData();
    } else {
        title = process.argv[3];
        callMovieApi();
    }
} 
else if (action === 'do-what-it-says') {
    getDataFromTextFile();  
} 
else {
    console.log('That\'s not a recognized command!')
};



/****FUNCTIONS****/

//Read text in the random.txt file and execute the appropriate function based on its content
function getDataFromTextFile(){
    fs.readFile("random.txt", "utf8", function(error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        //Split text string in data file into an array
        var dataArr = data.split(",");
        action = dataArr[0];
        title = dataArr[1];

        if (action === 'my-tweets') {
            console.log('Show tweets');
            getTweets();
        } 
        else if (action === 'spotify-this-song') {
            if (title === undefined) {
                getDefaultSongData();
            } else {
                searchSpotify();
            }
        } 
        else if (action === 'movie-this') {
            if (title === undefined) {
                getDefaultMovieData();
            } else {
                callMovieApi();
            }
        } 
    });
}

//Call the Twitter API and return tweets (still trying to get this to work)
function getTweets() {
    twitter.statuses('home_timeline', {
            count: '20',
            screen_name: 'nustudent319'
        },
        twitter.accessToken,
        twitter.accessTokenSecret,
        function(error, data, response) {
            if (error) {
                console.log('There\'s an error.'); 
            } else {
                console.log(response);
            }
        }
    );
}

//Return default song data if the user specifies the spotify action but no song title
function getDefaultSongData() {
    title = 'The Sign Ace of Base';
    searchSpotify();
};

//Search spotify for the user's song choice
function searchSpotify() {
    spotify.search({type: 'track', query: title}, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log('\nArtist(s): ' + data.tracks.items[0].artists[0].name +
                    '\nSong Name: ' + data.tracks.items[0].name +
                    '\nSpotify Preview Link: ' + data.tracks.items[0].preview_url +
                    '\nAlbum: ' + data.tracks.items[0].album.name);
    });
}

//Show default movie data for "Mr. Nobody" if the user chooses the movie action but no movie title
function getDefaultMovieData() {
    title = 'Mr. Nobody';
    console.log('\nIf you haven\'t watched "Mr. Nobody," then you should: http//www.imdb.com/title/tt0485947/'
        + '\nIt\'s on Netflix!');
    callMovieApi(); 
};

//Request movie data from OMDB using the movie title specified by the user
function callMovieApi() {
    var queryUrl = "http://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=40e9cece";
    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log('\nTitle: ' + JSON.parse(body).Title + 
                        '\nYear: ' + JSON.parse(body).Year +
                        '\nIMDB Rating: ' + JSON.parse(body).Ratings[0].Value +
                        '\nRotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value +
                        '\nCountry of Production: ' + JSON.parse(body).Country +
                        '\nPlot: ' + JSON.parse(body).Plot +
                        '\nActors: ' + JSON.parse(body).Actors
            );
        };
    });
};












