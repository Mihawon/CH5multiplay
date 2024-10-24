import net from 'net';
import dotenv from 'dotenv';
// proto
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import protobuf from 'protobufjs';

const packetNames = {
  common:{Packet:'common.Packet'},
  initial:{InitalPayload:'initial.InitailPayload'},
  game:{LocationUpdatePayload:'game.LocationUpdatePayload'},
  response:{Response:'response.Response'},
  gameNotification:{LocationUpdate:'gameNotification.locationUpdate'}
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const protoDir = path.join(__dirname,'../proto');
const protoMessages = {};
const getAllProtoFiles = function(dir,fileList=[]){
  const files = fs.readdirSync(dir);

  files.forEach(function(file){
    const filePath = path.join(dir,file);
    if(fs.statSync(filePath).isDirectory()){getAllProtoFiles(filePath,fileList);}
    else if(path.extname(file)==='.proto'){fileList.push(filePath);}
  });
};
const protoFiles =getAllProtoFiles(protoDir);

const loadProtos = async function(){
  try{
    const root = new protobuf.Root();
    await Promise.all(protoFiles.map((function(file){root.load(file);})));	 
    for(const[packetName,types]of Object.entires(packetNames)){
      protoMessages[packetName]={};
      for(const[packetName,types]of Object.entires(packetName)){
        protoMessages[packetName][type]=root.lookupType(typeName);
      }
    };
    console.log('protobuf Loaded!');
  }
  catch(e){
    console.error('protobuf Error!');	  
  }	  
};

const getProtoMessages = function(){
  return {...protoMessages};
};

// header
const TOTAL_LENGTH=4;
const PACKET_TYPE_LENGTH=1;
const PACKET_TYPE={
  PING:0,
  NORMAL:1,
  LOCATION:3
};
const HANDLER_IDS={
  INITIAL:0,
  LOCATION_UPDATE:2,
}
const RESPONSE_SUCESS_CODE=0;

// event
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

// index 
const initServer=async function(){
  await loadProtos();
};

// env 
dotenv.config();
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || '5555';

//check the connection
initServer().then(function(){
  server.listen(PORT, HOST, function(){
    console.log(`Server is on ${HOST},${PORT}`);
  });
}).catch(function(e){
  console.error(e);
  process.exit(1);
});




