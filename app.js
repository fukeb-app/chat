const io = require('socket.io')(3000)

let messages = [];

const MAX_MESSAGE_COUNT = 100;

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

io.on('connection' , socket => {

	socket.on("get-name" , data => {
		console.log(data.ID)
		socket.emit('your-name' , users.find(user => user.id == data.ID).name)
	})

	socket.on('msg' , data => {

		messages.push({
			name : users.find(user => user.id == data.id).name,
			msg : data.msg
		})

		io.emit('msg' , messages );

	})
})


