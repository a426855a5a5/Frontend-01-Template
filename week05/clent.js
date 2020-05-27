const net = require('net');
const parser = require('./parser.js')
const images = require('images')
const render = require('./render.js')

class Requset {
    // methhod, url = host + port + path
    // bode: k/v
    // headers
    constructor(optipns) {
        this.method = optipns.method || "GET";
        this.host = optipns.host || "GET";
        this.port = optipns.port || 80;
        this.path = optipns.path || '/';
        this.body = optipns.body || {};
        this.headers = optipns.headers || {};
        if (!this.headers["Content-Type"]) {
            this.headers["Content-Type"] = "application/x-www-form-urlencoded"
        }

        if (this.headers["Content-Type"] === 'application/json')
            this.bodyText = JSON.stringify(this.body);
        else if (this.headers["Content-Type"] === 'application/x-www-form-urlencoded')
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
        this.headers["Content-Length"] = this.bodyText.length;
    }

    toString() {
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
    }

    send(connection) {
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser;
            if (connection) {
                connection.write(this.toString());
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString());
                })
            }

            connection.on('data', (data) => {
                parser.receive(data.toString());
                if (parser.isFnishes) {
                    resolve(parser.response)
                }
                connection.end();
            });
            connection.on('error', (err) => {
                reject(erroe);
                connection.end();
            });

        })

    }
}

class Response {

}

class ResponseParser {
    constructor() {
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1;
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;
        this.WAITING_HEADER_BLOCK_END = 6;
        this.WAITING_BODY = 7;

        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";
        this.bodyParser = null;
    }
    get isFnishes() {
        return this.bodyParser && this.bodyParser.isFnishes;
    }
    get response() {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }
    receive(string) {
        for (let i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i));
        }
    }
    receiveChar(char) {
        if (this.current === this.WAITING_STATUS_LINE) {
            if (char === "\r") {
                this.current = this.WAITING_STATUS_LINE_END;
            } else if (char === "\n") {
                this.current = this.WAITING_HEADER_NAME;
            } else {
                this.statusLine += char;
            }
        } else if (this.current === this.WAITING_STATUS_LINE_END) {
            if (char === "\n") {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_NAME) {
            if (char === ":") {
                this.current = this.WAITING_HEADER_SPACE;
            } else if (char === "\r") {
                this.current = this.WAITING_HEADER_BLOCK_END;
                if (this.headers['Transfer-Encoding'] === 'chunked') {
                    this.bodyParser = new TrunkedParser();
                }

            } else {
                this.headerName += char;
            }
        } else if (this.current === this.WAITING_HEADER_SPACE) {
            if (char === " ") {
                this.current = this.WAITING_HEADER_VALUE;
            }
        } else if (this.current === this.WAITING_HEADER_VALUE) {
            if (char === "\r") {
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = "";
                this.headerValue = "";
            } else {
                this.headerValue += char;
            }
        } else if (this.current === this.WAITING_HEADER_LINE_END) {
            if (char === "\n") {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
            if (char === "\n") {
                this.current = this.WAITING_BODY;
            }
        } else if (this.current === this.WAITING_BODY) {
            this.bodyParser.receiveChar(char);
        }

    }
}

class TrunkedParser {
    constructor() {
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_TRUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;
        this.length = 0;
        this.content = [];
        this.isFnishes = false; // 因为一定以0为结尾
        this.current = this.WAITING_LENGTH;
    }
    receiveChar(char) {
        if (this.current === this.WAITING_LENGTH) {

            if (char === '\r') {
                if (this.length === 0) {
                    this.isFnishes = true;
                }
                this.current = this.WAITING_LENGTH_LINE_END;
            } else {

                this.length *= 16;
                this.length += parseInt(char, 16);
            }

        } else if (this.current === this.WAITING_LENGTH_LINE_END) {
            if (char === '\n') {
                this.current = this.READING_TRUNK;
            }
        } else if (this.current === this.READING_TRUNK) {
            this.content.push(char);
            var pattern = new RegExp("[\u4E00-\u9FA5]+");
            if (pattern.test(char)) {
                this.length = this.length - 3;
            } else {
                this.length--;
            }


            if (this.length === 0) {
                this.current = this.WAITING_NEW_LINE;
            }
        } else if (this.current === this.WAITING_NEW_LINE) {
            if (char === '\r') {
                this.current = this.WAITING_NEW_LINE_END;
            }
        } else if (this.current === this.WAITING_NEW_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_LENGTH;
            }
        }
    }
}

void async function () {
    let requset = new Requset({
        method: 'POST',
        host: "127.0.0.1",
        port: '8088',
        path: '/',
        headers: {
            ["X-Foo2"]: "bar"
        },
        body: {
            name: "winter"
        }
    })

    let response = await requset.send();
    let dom = parser.parseHTML(response.body);
    console.log(dom, '---->')
    // console.log(dom, '---->', dom.children[0].children[3].children[1].children[3]);

    let viewport = images(800, 600);

    render(viewport, dom);

    viewport.save("viewportss.jpg");
}();

/* const client = net.createConnection({
    host: '127.0.0.1',
    port: 8088
}, () => {
    // 'connect' listener.
    console.log('connected to server!');
    let requset = new Requset({
        method: 'POST',
        host: "127.0.0.1",
        port: '8088',
        path: '/',
        headers: {
            ["X-Foo2"]: "bar"
        },
        body: {
            name: "winter"
        }
    })
    console.log(requset.toString())
    client.write(requset.toString());
    //   client.write(`
    // POST / HTTP/1.1\r
    // Content-Type: application/x-www-form-urlencoded\r
    // Content-Length: 11\r
    // \r
    // name=winter`);
});
client.on('data', (data) => {
    console.log(data.toString());
    client.end();
});
client.on('end', () => {
    console.log('disconnected from server');
});
*/