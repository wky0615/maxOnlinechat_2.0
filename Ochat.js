const maxApi = require('max-api');
const io = require('socket.io-client');
//const socket = io("192.168.3.17:3000");
//const socket = io("http://wangkeyu.tech:3000");
const socket = io("http://localhost:3000");

var from


socket.on("connect", (res) => {
	// print when connection to socket.io is successful
    console.log("connection: " + socket.connected);
});

socket.on("max-message", (msg) => {
    maxApi.outlet("broadcast", msg, );
});

socket.on('receive private message', (res) =>{
	maxApi.outlet("private",res);
})

socket.on('user joined', (msg) => {
	//console.log(msg)
    maxApi.outlet("setName", msg,"joined");
});

socket.on("user left", (msg) =>{
	maxApi.outlet("setName",msg, "left");
})

socket.on("user", (msg) =>{
	maxApi.outlet("user", msg);
})




maxApi.addHandlers({
    broadcast: (dir) => {
        socket.emit("max-message", dir);
    },
    setName: (dir) =>{
        from = dir;
    	socket.emit('new user', dir);
    },
    private: (dir,msg) => {
        var res = {message: msg, towhere: dir, fromwhere:from};
    	socket.emit('send private message',res)
        //maxApi.outlet(res)
    },
    reset: (dir) => {
	    socket.emit('reset',dir)
    },
    userlist: (dir) => {
	    socket.emit('userlist',dir)
    },
});


