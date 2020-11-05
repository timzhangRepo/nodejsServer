var express = require('express');
var cors = require('cors');
const https = require('https')


var app = express();
app.use(cors());

var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('index.html');

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};


app.get('/', function (req, res) {
    res.json({msg: '200'})
})

app.get('/search/:stock', function (req, res) {
    var symbol = req.params.stock;
    var data = '';
    var url = searchUrl+symbol+'&'+token;
    https.get(url,function (response){
        var body = '';
        response.on('data', function(chunk){
            body += chunk;
        });
        response.on('end', function(){
            data = JSON.parse(body);
            res.send(data);
        });
    })
})

var server = http.createServer(function (req, res) {
    if (req.method === 'POST') {
        var body = '';

        req.on('data', function(chunk) {
            body += chunk;
        });

        req.on('end', function() {
            if (req.url === '/') {
                log('Received message: ' + body);
            } else if (req.url = '/scheduled') {
                log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            }

            res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
            res.end();
        });
    } else {
        res.writeHead(200);
        res.write(html);
        res.end();
    }
});

// Listen on port 3000, IP defaults to 127.0.0.1
app.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');
