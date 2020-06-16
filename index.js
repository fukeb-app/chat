const render = (response , path , data = {}) => require('ejs').renderFile(`./Views/${path}` , data)
	.then(html => response.send(html))
const express = require('express');
const path = require('path');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.use('/static' , express.static("static"))

const users = [
	{
		id : "hX9hgfvZS9JHGutER785gCF57",
		name : "Yasin"
	},
	{
		id : "JKvffgyDFgFXSYRKbH6s5rUfga", 
		name : "Furkan"
	}
] 


const getNameById = id => users.find(user => user.id == id).name;
let messages = [];

setInterval(() => {
	messages = [];
} , 1000*60*60)

io.on('connection' , socket => {

	socket.on('msg' , data => {
		if (isNaN(data.msg)) {
			messages.push({
			name : users.find(user => user.id == data.id).name,
			msg : data.msg,
			id : data.id
		});
		io.emit('msg' , {
			name : users.find(user => user.id == data.id).name,
			msg : data.msg,
			id : data.id 
		});
		}
	})
	
	socket.on('disconnect' , () => console.log(socket.id))
})





app.get('/' , (req , res) => {	
	let id = req.query.id;
	let name = getNameById(id);
	let initialMessages = messages;
	render(res , "index.ejs" , {name , id , initialMessages})
})

app.get('/del' , () => messages = []);


const PORT = process.env.PORT || 3000;
http.listen(PORT);