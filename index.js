/*
*  RESTful JSON API for /hello route
*/

// Dependencies
var http = require('http');
var url = require('url');
var config = require('./config');
var stringDecoder = require('string_decoder').StringDecoder;

// creating server
var server = http.createServer(function(req,res){

    // parsing the request url using url module parse method. 2nd arg true which uses queryString module internally to parse
    // queryString into a seperate object calles query.
    var parsedUrl = url.parse(req.url,true);
    
    // getting the exact requested pathname
    var path = parsedUrl.pathname;
    var pathName = path[path.length -1] == '/' ? path.substring(1,path.length-1) : path.substring(1,path.length);

    var requestMethod = req.method;
    var headers = req.headers;
   
    // getting the payload if any from POST request
    var payload = '';
    var decoder = new stringDecoder('utf-8');
    
    // listening for data and end event on request stream
    req.on('data',(data)=>{
        payload += decoder.write(data);
    });    

    // when request finishes get all the request data and append it as a property of payload from handler then stringify it
    // and send back in response the whole data 
    req.on('end',()=>{
        
        var data = {
            'Method':requestMethod,
            'PathName':pathName,
            'Payload':payload
        };
    
        var requestedHandler = typeof(router[pathName]) != 'undefined' ? router[pathName] : handler.notFound;
        requestedHandler(data,function(statusCode,response){
        
            var resp = response;
            resp['reqInfo'] = data;
            var responseToSend = JSON.stringify(resp);
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
    
            res.end(responseToSend);
    
        });
    });
});

server.listen(config.port,()=>{
    console.log(`Server Listening at port ${config.port}`);
});


// setting up the request routing
var handler = {};

handler.helloRoute = function(data,callback){
    callback(200,{'message':'Success :) Hello from Node!'});
}

handler.notFound = function(data,callback){
    callback(404,{'message':'404 Error :( Requested path doesn\'t exists!!!) '});
}

var router = {
    'hello':handler.helloRoute
}
