const express=require('express');
const app=express();
const fs=require('fs');
// server
app.get('/', function(req, res){
  res.writeHead(200,{'Content-Type': 'video/mp4'});
  console.log(req.headers);
  var rstream=fs.createReadStream('OGAA7451.mp4');
  rstream.pipe(res);
});

//client
app.listen(3080,function(){
  console.log("The server is listening!");
});