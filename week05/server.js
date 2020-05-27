const http = require('http')
const server = http.createServer((req, res) => {
    console.log("被访问了！")
    console.log(req.headers)
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo', 'bar');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`<html maaa=a >
<head>
<style>
#container {
    width:500px;
    height: 300px;
    display:flex;
    background-color:rgb(255,255,255);
}    
#container #myid {
    width: 200px;
    height: 100px;
    background-color:rgb(255,0,0);
}
#container .c1 {
    flex:1;
    background-color:rgb(255,255,0);
}
</style>
</head>
<body>
    <div id="container">
        <div id="myid"></div>
        <div class="c1"></div>
    </div>
</body>
</html>`);

});

server.listen('8088');
/** /`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <h1>解析</h1>

</body>
</html>`*/

