//imports 
var app = require('http').createServer(handler)
    , twitter = require("ntwitter") 
    , fs = require('fs')
    , io = require('socket.io').listen(app);
    
var num_tweets = 0;     
    
var twit = new twitter({
      consumer_key: 'xTRQGotkLQFG1JTFAOTRQ',
      consumer_secret: 'LqDuZtfiWreExZzZp1t2RLVvNyr6OkbgDdtgmy10',
      access_token_key: '9781412-Z0FYhGjkL3WTRTAXBUyZNAWWN5pMXJsnBZdUeGo40',
      access_token_secret: 'vpfDtBHrtTAELXlxzOJS9KrZcFuGm0VGOLqkOZxOQ'
    }); 
    
    //socket operations
 io.sockets.on('connection', function (socket) {  
    
    twit.stream('statuses/filter', {'track':'christmas'}, function(stream) {
      stream.on('data', function (data) {
        num_tweets++; 
        
        //throttle emits. 
        if(num_tweets % 10 == 0) {
          socket.emit('tweet', {data: data.text}); 
          
          console.log(data.text);
          console.log(num_tweets); 
          console.log("------------------------------"); 
        } 
        
      });
      stream.on('error', function(data) { 
        console.log(data); 
      }); 
      //stream.on('end', 
      
    });
    
    socket.on('disconnect', function () {
      console.log("Client Disconnected");
      
      //need to figure out how to kill the twitter stream. .destroy doesn't seem to do it. 
    }); 
 
  });
  
  
   
   /*     
  twit.stream('direct', {track:'nodejs'}, function(stream) {
      stream.on('data', function (data) {
        console.log(console.dir(data));
      });
      stream.on('end', function (response) {
        // Handle a disconnection
      });
      stream.on('destroy', function (response) {
        // Handle a 'silent' disconnection from Twitter, no end/error event fired
      });
      // Disconnect stream after five seconds
      setTimeout(stream.destroy, 5000);
    });     
    
    
    twit.stream('statuses/filter', {'track':'drupal'}, function(stream) {
      stream.on('data', function (data) {
        console.log(data.text);
        console.log("------------------------------"); 
      });
    });
    */
    
    //handle regular URL requests
app.listen(8080);

function handler(req, res) {
        serve_static_file(req, res);
}

function serve_static_file(req, res) {
    var url = req.url;
    if (url == '/') {
        url = '/index.html';
    }

    fs.readFile(__dirname + '/frontend' + url,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading static file: ' + err);
            }

            res.writeHead(200);
            res.end(data);
        }
    );
}
