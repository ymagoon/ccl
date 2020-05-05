const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

let fileread = function(filename) {
	let contents = fs.readFileSynch(filename);
	return contents;
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);

  let path = 'C:\\ccl\\Millennium Request Analyzer\\sup.txt';

  fs.readFile(path, 'utf8', function (err,data) {
  	if (err) {
  		console.log(err);
  	}

  	console.log(data);
  });
});