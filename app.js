const http = require('http');
const _ = require('lodash');
const request = require('request');
const express = require('express');
const app = module.exports.app = express();
const server = http.createServer(app);
server.listen(9000,function(){
    console.log("server node socket agent port 9000 starting")
});
const hasOwnProperty = Object.prototype.hasOwnProperty;
const bodyParser = require('body-parser');
const io = require('socket.io').listen(server);
const async = require('async');
// ------ redis config
const redis = require("redis");
const client = redis.createClient({
    host:"localhost",
    port:"6379",
    db:1
});

// ------ Config for access mongoDB
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017";

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj === null)
        return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)
        return false;
    if (obj.length === 0)
        return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object")
        return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key))
            return false;
    }

    return true;
}

// end function
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/socket-agent', express.static('public'));

//Handle Index Url
app.get('/',function(req,res){
    res.sendfile(__dirname + '/views/index.html')
})

// Handling List Queue Msisdn to Agent
app.get('/check-redis',function(req,res){

    client.keys("line_queue/*",function(e,keys){
        out = []

        async.forEachOf(keys,(value,key,callback) => {
            client.get(value,function(err,val){
                out[key] = JSON.parse(val)
                callback()
                
            });
        }, (err) =>{
            if (err) console.error(err.message);
            res.send(out);
        });
    });
});

//Handling Get History Chat From Mongo
app.get('/history/detail',function(req,res){
    if(!isEmpty(req.query)){
        MongoClient.connect(url,function(err,db){
            if(err) throw err;
            var dbo = db.db('live_agent');
            var table = 'history_'+req.query.msisdn;
            dbo.collection(table).find().toArray(function(err,result){
                if(err) throw err;
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result))
                db.close();
            });
        });
    }else{
        res.sendfile(__dirname + '/views/index.html')
    }
});

//Handling Chat Interface
app.get('/agent-chat',function(req,res){
    //res.sendfile(__dirname + '/views/agent.html')
    res.sendfile(__dirname + '/views/index.html')
});

//Handling Chat Interface from Aris
app.get('/agent-chat-new',function(req,res){
    res.sendfile(__dirname + '/views/chat.html')
});

//Handling Chat Interface Whatsapp
app.get('/wa',function(req,res){
    res.sendfile(__dirname + '/views/whatsapp.html')
});

//Index for callback from backend chat/python
app.post('/callback',function(req,res){
    console.log("--- receiver from task celery ---")
    console.log(req.body)
    sendToClient(req.body.socketid,req.body.msg,req.body.type,req.body.data)
});

function sendToClient(socketid,msg,type,data){
    //io.to(socketid).emit('updatechat','user testing',msg,1)
    io.sockets.in(data).emit('updatechat','user testing',msg,1)
}

function sendToBackend(socketid,msg){
    return request({
        url:'http://localhost:8006/agent',
        method: 'POST',
        json:{
            type:'message',
            microsite_catcher:[{
                socketid:socketid,
                msg:msg
            }]
        }
    },function(err,res,body){
        if(err){
            console.log(err);
        }else{
            console.log(res.statusCode,body);
        }
    });
}

//Socket Connection Open
io.sockets.on('connection',function(socket){
    socket.on('sendchat',function(data){
        var data = {
            id_line:data.id_line,
            ask:data.ask
        }
        console.log(data);
        sendToBackend(socket.id,data);
        socket.join(data.id_line);
        socket.broadcast.emit('updatechat', 'adevshankar', data.ask, 0);
        socket.emit('updatechat', 'adevshankar', data.ask, 0);
    });
    socket.on('started',function(data){
        var data = {
            id_line:data,
            ask:"started for connect with agent 00001111$%--==="
        }
        sendToBackend(socket.id,data);
    });
});

//webhook callback
