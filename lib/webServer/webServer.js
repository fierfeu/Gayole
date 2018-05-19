http = require ('http');

let webServerHandler = (req, res) => {
    res.statusCode=200
    res.end();
}

let webserver;

exports.start = (port) => {
    webserver=http.createServer(webServerHandler);
    webserver.listen(port);
};

exports.stop = () => {
    webserver.close();
};
