var spawn = require('child_process').spawn,
    shell = require('shelljs'),
    fs = require('fs'),
    path = require('path'),
    exec = require('./exec'),
    Q = require('q'),
    http = require('http'),
    url = require('url'),
    mime = require('mime'),
    zlib = require('zlib');

/**
 * Launches the specified browser with the given URL.
 * Based on https://github.com/domenic/opener
 * @param {string} target Browser target to launch.
 * @param  {string} url
 * @return {Q} Promise to launch the specified browser
 */
exports.runBrowser = function (target, url) {
    return mapTarget(target).then(function (browser) {
        var args;
        switch (process.platform) {
            case 'darwin':
                args = ['open'];
                if (target == 'chrome') {
                    // Chrome needs to be launched in a new window. Other browsers, particularly, opera does not work with this.        
                    args.push('-n');
                }
                args.push('-a', browser);            
                break;
            case 'win32':
                // On Windows, we really want to use the "start" command. But, the rules regarding arguments with spaces, and 
                // escaping them with quotes, can get really arcane. So the easiest way to deal with this is to pass off the 
                // responsibility to "cmd /c", which has that logic built in. 
                // 
                // Furthermore, if "cmd /c" double-quoted the first parameter, then "start" will interpret it as a window title, 
                // so we need to add a dummy empty-string window title: http://stackoverflow.com/a/154090/3191 
                args = ['cmd /c start ""', browser];
                break;
            case 'linux':
                // if a browser is specified, launch it with the url as argument
                // otherwise, use xdg-open.
                args = [browser];
                break;
        }
        args.push(url);
        var command = args.join(" ");
        console.log("Executing comamnd: " + command);
        return exec(command);
    });
}

function mapTarget(target) {
    var chromeArgs = ' --user-data-dir=/tmp/temp_chrome_user_data_dir_for_cordova_browser';
    var browsers = {
        'win32': {
            'ie': 'iexplore',
            'chrome': 'chrome --user-data-dir=C:/Chromedevsession',
            'safari': 'safari',
            'opera': 'opera',
            'firefox': 'firefox',
        },
        'darwin': {
            'chrome': '"Google Chrome" --args' + chromeArgs,
            'safari': 'safari',
            'firefox': 'firefox',
            'opera': 'opera',
        },
        'linux' : {
            'chrome': 'google-chrome' + chromeArgs ,
            'chromium': 'chromium-browser' + chromeArgs,
            'firefox': 'firefox',
            'opera': 'opera',
        }
    }
    target = target.toLowerCase();
    if (target in browsers[process.platform]) {
        return Q(browsers[process.platform][target]);
    }
    return Q.reject("Browser target not supported: " + target);
}

function launchServer(projectRoot, port) {
    var server = http.createServer( function(request, response) {
        function do404() {
            console.log('404 ' + request.url);
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.write('404 Not Found\n');
            response.end();
            return '';
        }
        function do302(where) {
            console.log('302 ' + request.url);
            response.setHeader('Location', where);
            response.writeHead(302, {'Content-Type': 'text/plain'});
            response.end();
            return '';
        }
        function do304() {
            console.log('304 ' + request.url);
            response.writeHead(304, {'Content-Type': 'text/plain'});
            response.end();
            return '';
        }
        function isFileChanged(path) {
            var mtime = fs.statSync(path).mtime,
                itime = request.headers['if-modified-since'];
            return !itime || new Date(mtime) > new Date(itime);
        }

        var urlPath = url.parse(request.url).pathname,
            filePath = path.join(projectRoot, urlPath);

        fs.exists(filePath, function(exists) {
            if (!exists) {
                return do404();
            }
            if (fs.statSync(filePath).isDirectory()) {
                if (!/\/$/.test(urlPath)) {
                    return do302(request.url + '/');
                }
                console.log('200 ' + request.url);
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write('<html><head><title>Directory listing of '+ urlPath + '</title></head>');
                response.write('<h3>Items in this directory</h3>');
                var items = fs.readdirSync(filePath);
                response.write('<ul>');
                for (var i in items) {
                    var file = items[i];
                    if (file) {
                        response.write('<li><a href="'+file+'">'+file+'</a></li>\n');
                    }
                }
                response.write('</ul>');
                response.end();
            } else if (!isFileChanged(filePath)) {
                do304();
            } else {
                var mimeType = mime.lookup(filePath);
                var respHeaders = {
                    'Content-Type': mimeType
                };
                var readStream = fs.createReadStream(filePath);

                var acceptEncoding = request.headers['accept-encoding'] || '';
                if (acceptEncoding.match(/\bgzip\b/)) {
                    respHeaders['content-encoding'] = 'gzip';
                    readStream = readStream.pipe(zlib.createGzip());
                } else if (acceptEncoding.match(/\bdeflate\b/)) {
                    respHeaders['content-encoding'] = 'deflate';
                    readStream = readStream.pipe(zlib.createDeflate());
                }

                var mtime = new Date(fs.statSync(filePath).mtime).toUTCString();
                respHeaders['Last-Modified'] = mtime;
                
                console.log('200 ' + request.url + ', ' + mimeType + ', ' + mtime + ', ' + filePath);

                response.writeHead(200, respHeaders);
                readStream.pipe(response);
            }
            return '';
        });
    });

    server.listen(port);

    return server;
}

/**
 * Launches a server of the specified path and returns the URL that will access the path.
 * Based on subset of `cordova serve`
 * @param  {string} path to serve over http
 * @param  {number} port to serve http on
 * @return {Q} Promise to URL that will access the path
 */
exports.runHttpServer = function (path, port) {

    var server = launchServer(path, port),
        urlRoot = 'http://localhost:' + port + '/',
        deferred = Q.defer();

    server.on('listening', function () {
        deferred.resolve(urlRoot);
    }).on('error', function (e) {
        deferred.reject(e);
    });

    return deferred.promise;
}
