const express = require("express");// use express to serve up the UI page
const app = express();
const http = require("http").Server(app);// Socket.IO uses a http server
const io = require("socket.io")(http);
// const maxApi = require("max-api");


const port = 3000;



// io.on("connection",function (socket) {
//     io.emit("max-message","a user connected");

//     socket.on('setName',function (data) {
//         socket.name = data;
//         socket.broadcast.emit("setName",socket.name)
//         //console.log(socket.name)
//     });
//     socket.on("max-message", (msg) => {
//     	//console.log(msg);
//         socket.broadcast.emit("max-message", msg);
// 	});

//     socket.on("disconnect", function(){
//         //console.log('user disconnect')
//         socket.broadcast.emit("max-message","a user quite");
//     } );
    
// });
var usocket = {},user = [];

io.on('connection', (socket) => {


	socket.on('new user', (username) => {
		if(!(username in usocket)) {
			socket.username = username;
			usocket[username] = socket;
			user.push(username);
			//socket.emit('login',user);
			io.emit('user joined',username,(user.length-1));
			io.emit("user",user);
			//console.log(user.length);
		}
	})

	socket.on('send private message', function(res){
		console.log(res);
		if(res.towhere in usocket) {
			usocket[res.towhere].emit('receive private message', res);
		}
	});

	socket.on("max-message", (msg) => {
    	//console.log(msg);
        socket.broadcast.emit("max-message", msg);
	});

	socket.on('disconnect', function(){
		//移除
		if(socket.username in usocket){
			delete(usocket[socket.username]);
			user.splice(user.indexOf(socket.username), 1);
		}
		//console.log(user);
		io.emit("user",user);
		io.emit('user left',socket.username)
	})
	socket.on('reset', function(){
		user.splice(0,user.length);
		socket.removeAllListeners(); 
		io.emit("user",user);
		

    });
    socket.on('userlist', function() {
	    io.emit("user",user); 
	    //console.log(user)

    });

});



http.listen(port, function () {
	console.log("listening on *:" + port);
});