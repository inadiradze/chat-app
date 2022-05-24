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
		origin: "http://localhost:3000"
	}
});

io.on("connection", (socket) => {
	console.log(`${socket.id} has connected`);

	socket.on("join-camp", (data) => {
		if(socket.oldCamp){
			socket.leave(socket.oldCamp);
			socket.oldCamp = null;
		}
		socket.join(data);
		socket.oldCamp = data;
	});

	socket.on("sendMsg-camp", (data) => {
		socket.to(data.camp).emit("recieve-msg", data)
	});
});


server.listen(port, () => {
	console.log(`PORT ${port}`);
})