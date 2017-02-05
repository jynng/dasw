var http = require('http');
var server = http.createServer(function(request, response) {});

server.listen(1234, function() {
    console.log((new Date()) + ' Server is listening on port 1234');
});

var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
    httpServer: server, 
	path: '/quadrobrancoendpoint',
	maxReceivedFrameSize: 131072,});

var count = 0;
var clients = {};

wsServer.on('request', function(r){
    // Code here to run on connection
	var connection = r.accept(null, r.origin);

	// Specific id for this client & increment count
	var id = count++;
	// Store the connection method so we can loop through & contact all clients
	clients[id] = connection

	console.log((new Date()) + ' Connection accepted [' + id + '] - ' + r.origin);

	// Create event listener
	connection.on('message', function(message) {
		// Loop through all clients
		for(var i in clients){
			if (message.type === 'utf8') {
				console.log('Received Message: ' + message.utf8Data + ', from: ' + this.);
				clients[i].sendUTF(message.utf8Data);
			}
			else if (message.type === 'binary') {
				console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
				clients[i].sendBytes(message.binaryData);
			}
		
		}

	});

	connection.on('close', function(reasonCode, description) {
		delete clients[id];
		console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.' + reasonCode +' - '+description);
	});

	
})


