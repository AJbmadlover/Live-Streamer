

// const app = express();

//app.use(express.json());

// const dotenv = require('dotenv');

//dotenv.config();

// const PORT = process.env.PORT || 4500
// const server = app.listen(PORT, ()=>{console.log(`Server is running...`)})

const express = require('express');
const app = express();
const http = require('http')
const server = http.createServer(app)
const path = require('path');
const fs = require('fs');
const cors = require('cors')




const WebSocket = require('ws');

const wss = new WebSocket.Server({noServer:true});
const outputFile = path.join(__dirname, 'publisher_liveStream', 'streamA.webm');
const writeStream = fs.createWriteStream(outputFile, { flags: 'a' });

wss.on('connection', function(ws){

    console.log('Server is running at port: 8080')

    ws.on('error', console.error);

    ws.on('message', function message(data,isBinary){
        if(!isBinary){
            console.log('recieved: %s' , data)
            console.log('client sent us a message')
        }else{
          writeStream.write(data);
        }
    })
});

server.on('upgrade', function upgrade(request, socket, head) {
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
});


// Folder where all publishers’ live streams are stored
const PUBLISH_DIR = path.join(__dirname, 'publisher_liveStream');


app.use(cors({
  origin: 'http://localhost:3000'
}));

app.get('/live/:publisherId.webm', (req, res) => {
  const filePath = path.join(PUBLISH_DIR, `${req.params.publisherId}.webm`);

  // Helper to stream file when it exists
  function streamFile() {
    res.writeHead(200, {
      'Content-Type': 'video/webm',
      'Cache-Control': 'no-cache',
      'Transfer-Encoding': 'chunked',
      'Accept-Ranges': 'bytes',
    });

    const readStream = fs.createReadStream(filePath, { start: 0 });
    readStream.pipe(res);
    req.on('close', () => readStream.destroy());
  }

  // If file exists, stream immediately
  if (fs.existsSync(filePath)) {
    streamFile();
    return;
  }

  // If file doesn't exist yet, wait for it to be created
  let waited = 0;
  const maxWait = 10000; // 10 seconds
  const interval = setInterval(() => {
    if (fs.existsSync(filePath)) {
      clearInterval(interval);
      streamFile();
    } else {
      waited += 250;
      if (waited >= maxWait) {
        clearInterval(interval);
        res.status(404).send('Stream not found');
      }
    }
  }, 250);
});


// Endpoint to return the video URL for a given publisher
app.get('/video-url/:publisherId', (req, res) => {
  const { publisherId } = req.params;
  const filePath = path.join(PUBLISH_DIR, `${publisherId}.webm`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Publisher live stream not found' });
  }

  // Construct URL that frontend can use in <video src="...">
  const videoUrl = `${req.protocol}://${req.get('host')}/live/${publisherId}.webm`;

  res.json({ publisherId, url: videoUrl });
});


server.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});