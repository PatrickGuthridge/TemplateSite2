const path = {
    ht: "./docs",
    index: "/index.html",
    404: "/errors/404.html"
}
const http = require(`http`);
const url = require(`url`);
const fs = require(`fs`);
let server = http.createServer((req, res) => {
    let q = url.parse(req.url, true);
    if (q.pathname == "/") {
        fs.readFile(`${path.ht}${path.index}`, (error, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            return res.end();
        });
    }
    else {
        fs.readFile(`${path.ht}${q.pathname}`, (error, data) => {
            if (error) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.write(`<h1>Not Found.</h1><br>The requested  URL ${q.pathname} was not found on this server.`);
                return res.end();
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            return res.end();
        });
    }
});
server.listen(80);