var express = require('express'),
	routes = require('./route'),
	http = require('http'),
	path = require('path'),
	app = express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server),
	Timer = require('./timer.js').Timer,
	timer = new Timer();
var cons = require('consolidate');

// all environments
app.set('port', process.env.PORT || 3000);
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/:username',routes.index)

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function(socket) {

	socket.emit('currentEndTime', {time: timer.getEndTime() });
	
	socket.on('setTimer', function(data) {
		timer.setEndTime(data.time);
		socket.broadcast.emit('currentEndTime', {time: timer.getEndTime() });
	});
});