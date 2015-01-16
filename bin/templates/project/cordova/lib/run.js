var spawn = require('child_process').spawn,
    shell = require('shelljs'),
    fs = require('fs'),
    exec = require('./exec'),
    Q = require('q');

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
    var chromeArgs = ' --disable-web-security --user-data-dir=/tmp/temp_chrome_user_data_dir_for_cordova_browser';
    var browsers = {
        'win32': {
            'ie': 'iexplore',
            'chrome': 'chrome --disable-web-security --user-data-dir=C:/Chromedevsession',
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
