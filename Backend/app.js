// const express = require('express');

// const app = express();

import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({port:8080});

wss.on('connection', function(connection){
    wss.on('error', console.error);

    wss.on('message', function message(data){
        console.log('recieved: %s' , data)
    })
})
