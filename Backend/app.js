// const express = require('express');

// const app = express();

//app.use(express.json());

// const dotenv = require('dotenv');

//dotenv.config();

// const PORT = process.env.PORT || 4500
// const server = app.listen(PORT, ()=>{console.log(`Server is running...`)})

const WebSocket = require('ws');

const wss = new WebSocket.Server({port:8080});

wss.on('connection', function(connection){
console.log('Server is running at port: ' ,port)

    wss.on('error', console.error);

    wss.on('message', function message(data){
        console.log('recieved: %s' , data)
    })
})
