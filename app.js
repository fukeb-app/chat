const render = (response, path, data = {}) => require('ejs').renderFile(`./Views/${path}`, data)
	.then(html => response.send(html))
const express = require('express');
const path = require('path');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.use('/static', express.static("static"))

const users = [{
	id: "hX9hgfvZS9JHGutER785gCF57",
	name: "Yasin"
}, {
	id: "JKvffgyDFgFXSYRKbH6s5rUfga",
	name: "Furkan"
}, {
	id: "denemeid",
	name: "test"
},
	{
		name : "Onur",
		id : "hwS4mcgJodH96OknYuN7"
	}
]


let online = 0;

const getNameById = id => users.find(user => user.id == id).name;
let messages = [];

setInterval(() => {
	messages = [];
}, 1000 * 60 * 60 * 6)

const updateOnline = on => {
	let onlineUsers = [];
	for (let i = 0; i < users.length; i++) {
		onlineUsers.push({
			name: users[i].name,
			online: users[i].online ? true : false
		})
	}
	io.emit('online', {
		online,
		onlineUsers
	})
}

io.on('connection', socket => {

	online++;

	users.forEach(function(user, index) {
		if (user.id == socket.handshake.query.id) {
			users[index].online = true;
			users[index].sid = socket.id;
		}
	});

	updateOnline();


	socket.on('msg', data => {
		if (isNaN(data.msg)) {
			messages.push({
				name: users.find(user => user.id == data.id).name,
				msg: data.msg,
				id: data.id
			});
			io.emit('msg', {
				name: users.find(user => user.id == data.id).name,
				msg: data.msg,
				id: socket.id
			});
		}
	})



	socket.on('disconnect', () => {
		online--;
		users.forEach((user, index) => {
			if (user.sid == socket.id) {
				user.sid = undefined;
				user.online = false;
				return;
			}
		});
		updateOnline();
	})
})

// setInterval(() => {console.log(online.length)} , 1000)


app.get('/', (req, res) => {
	let id = req.query.id;
	let name = getNameById(id);
	let initialMessages = messages;
	render(res, "index.ejs", {
		name,
		id,
		initialMessages,
		users,
		online
	})
})

app.get('/del', (req, res) => {
	messages = []
	res.end();
});

app.get('/msgs', (req, res) => res.json(messages));

app.get('/users', (req, res, next) => {
	if (req.query.p == "allow") {
		res.json(users)
	} else next();
})

// app.get("/*" , (req , res) => {
// 	res.status(404);
// 	res.send("NOT FOUND");
// })

const PORT = process.env.PORT || 3000;
http.listen(PORT);