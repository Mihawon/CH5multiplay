import net from 'net';
import dotenv from 'dotenv';

//header
const TOTAL_LENGTH=4;
const PACKET_TYPE_LENGTH=1;
const PACKET_TYPE={
  PING:0,
  NORMAL:1,
  LOCATION:3
};

//event
const onConnection=function(socket){
  console.log(`Cilent connected from: ${socket.remoteAdress}:${socket.remotePort}`);
  socket.on('data',onData(socket));
  socket.on('end',onEnd(socket));
  socket.on('error',onError(socket));
};
const onData=function(socket){};
const onEnd=function(socket){};
const onError=function(socket){};

const server = net.createServer(onConnection);

// env 
dotenv.config();
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || '5555';

//check the connection
server.listen(PORT, HOST, function(){
  console.log(`Server is on ${HOST},${PORT}`);
});




