
//NPM packages required
var request = require('request');
var twitterAPI = require('node-twitter-api');
var fs = require("fs");

//Global variables
var action = '';
var title = '';

/****EVENTS****/

defineAction();
console.log(action);

if (action === 'my-tweets') {
    console.log('Show 20 tweets');
} 
else if (action === 'spotify-this-song') {
    console.log('Spotify!');
} 
else if (action === 'movie-this') {
    if ((process.argv[2] === 'movie-this') && (process.argv[3] === undefined)) {
        getDefaultMovieData();
    } else {
        callMovieApi();
    }
} 
// else if (action === 'do-what-it-says') {
//     console.log('Do what it says!')
// } 
// else {
//     console.log('That\'s not a recognized command!')
// };



//FUNCTIONS

//Determine which action will be executed
function defineAction() {
    if (process.argv[2] === 'do-what-it-says') {
        getDataFromTextFile();
    } else {
        action = process.argv[2];
        title = process.argv[3];
    }
}

function getDataFromTextFile(){
    fs.readFile("random.txt", "utf8", function(error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        action = dataArr[0];
        title = dataArr[1];
        console.log('\nAction: ' + action + '\nTitle: ' + title);
    });
}

//Show data for the movie "Mr. Nobody" without user movie title input
function getDefaultMovieData() {
    title = 'Mr. Nobody';
    console.log('\nIf you haven\'t watched "Mr. Nobody," then you should: http//www.imdb.com/title/tt0485947/'
        + '\nIt\'s on Netflix!');
    callMovieApi(); 
};

//Request movie data from OMDB
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









//TWITTER

// var twitter = new twitterAPI({
//     consumerKey: exports.twitterKeys.consumer_key,
//     consumerSecret: exports.twitterKeys.consumer_secret,
// });

// console.log(twitter.consumerKey);

// twitter.statuses("update", {
//         status: "Hello world!"
//     },
//     accessToken,
//     accessTokenSecret,
//     function(error, data, response) {
//         if (error) {
//             // something went wrong 
//         } else {
//             // data contains the data sent by twitter 
//         }
//     }
// );


