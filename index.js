let express = require("express");
let app = express();

app.get('/', function(req, res) {
	app.use(express.static(__dirname + "/static"));
	res.sendfile("static/index.html");
});

app.get('/avt', function(req, res) {
	app.use(express.static(__dirname + "/static"));
	res.sendfile("static/index.html");
});

app.get('/reg', function(req, res) {
	app.use(express.static(__dirname + "/static"));
	res.sendfile("static/index.html");
});

app.get('/profile', function(req, res) {
    app.use(express.static(__dirname + "/static"));
    res.sendfile("static/index.html");
});

app.get('/game_with_computer', function(req, res) {
    app.use(express.static(__dirname + "/static"));
    res.sendfile("static/index.html");
});

app.get('/my_results', function(req, res) {
    app.use(express.static(__dirname + "/static"));
    res.sendfile("static/index.html");
});

app.get('/top_of_players', function(req, res) {
    app.use(express.static(__dirname + "/static"));
    res.sendfile("static/index.html");
});

app.get('/two_players_game', function(req, res) {
    app.use(express.static(__dirname + "/static"));
    res.sendfile("static/index.html");
});

let port = process.env.PORT || 5000;
app.listen(port);

console.log("Server works on port " + port);
