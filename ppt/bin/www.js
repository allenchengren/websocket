var app = require('../app');
var debug = require('debug')('ppt:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(socket) {

    // 用户上线
    socket.on('online', function(data) {
        socket.broadcast.emit("onlines", data);
    });

    //广播聊天内容
    socket.on('chats', function(data) {

        // 广播给除自己之外的所有人
        // socket.broadcast.emit("chat", data);
        
        io.sockets.emit('chat', data);
    });

    socket.on('prev', function(data) {
        socket.broadcast.emit("prev", {
            text: "prev"
        });
        console.log("prev");
    });

    socket.on('next', function(data) {
        socket.broadcast.emit("next", {
            text: "next"
        });
        console.log("next");
    });

    socket.on('event', function(data) {
        console.log("event");
    });

    socket.on('disconnect', function() {
        console.log("disconnect");
    });

});


/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, function() {
    console.log('Listening on porting %', app.get('port'));
});
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
