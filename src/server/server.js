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

const users = [];


io.on("connection", (socket) => {
	console.log(`${socket.id} has connected`);

	socket.on("join-camp", (data, name) => {
		if(socket.oldCamp){
			socket.leave(socket.oldCamp);
			socket.oldCamp = null;
		}
		socket.join(data);
		socket.oldCamp = data;
		users.push({camp: data,
					user: name});
		console.log(users);
	});

	socket.on("send_message", (data) => {
		socket.to(data.camp).emit("receive_message", data);
	});

	socket.on("disconnect", () => {
    	console.log("User Disconnected", socket.id);
 	 });
});


server.listen(port, () => {
	console.log(`PORT ${port}`);
})