const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require("./modules/replaceTemplate");

///////////////////////////////////////
// Blocking, synchronous way

// templates 
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

// data
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

///////////////////////////////
// Server
    const server = http.createServer((req, res) => { 
    const { query, pathname } = url.parse(req.url, true);

    // Overview Page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const cardsHtml = dataObj.map(el => replaceTemplate (tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output)

    // Product Page
    } else if(pathname === '/product') {
        const product = dataObj[query.id];
        res.writeHead(200, { 'Content-type': 'text/html' });
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    // API
    } else if (pathname === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);

    // Not Found
    }else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        })
        
        res.end('<h1>Page not found!</h1>')
    }

});

///////////////////////////////
// Server Listen
server.listen(8080, '127.0.0.1', () => {
    console.log('Server running at http://localhost:8080/');
});