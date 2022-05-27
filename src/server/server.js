const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const port = 4000 || process.env.PORT;
const {Server} = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
	    origin: "http://localhost:3000",
	    methods: ["GET", "POST"],
 	 },
});

let users = [];


io.on("connection", (socket) => {
	console.log(`${socket.id} has connected`);

	socket.on("join-camp", (data, user) => {
		let username = user;
		let campname = data;
		const found = users.some(el => el.user === user && el.camp === data);
		if(socket.oldCamp){
			socket.leave(socket.oldCamp);
			socket.oldCamp = null;
		}
		if(!found){
			socket.join(data);
			socket.oldCamp = data;
			users.push({id: socket.id,camp: data, user: user});
			console.log(users);
		}else{
			console.log("TAKEN");
			socket.emit("user-taken");
		}
	});

	socket.on("send_message", (data) => {
		socket.to(data.camp).emit("receive_message", data);
		console.log(data.message);

	});

	socket.on("disconnect", () => {
		socket.emit("left");
    	console.log("User Disconnected", socket.id);
 	 });
});


server.listen(port, () => {
	console.log(`PORT ${port}`);
})