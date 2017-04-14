/*
    this file is found by cordova-lib when you attempt to
    'cordova platform add PATH' where path is this repo.
*/

/*jslint node: true */

var shell = require('shelljs');
var path = require('path');

var CordovaLogger = require('cordova-common').CordovaLogger;
var selfEvents = require('cordova-common').events;

var PLATFORM_NAME = 'testplatform';

function setupEvents(externalEventEmitter) {
    if (externalEventEmitter) {
        // This will make the platform internal events visible outside
        selfEvents.forwardEventsTo(externalEventEmitter);
        return externalEventEmitter;
    }

    // There is no logger if external emitter is not present,
    // so attach a console logger
    CordovaLogger.get().subscribe(selfEvents);
    return selfEvents;
}

function Api(platform, platformRootDir, events) {

    this.platform = platform || PLATFORM_NAME;
    this.root = path.resolve(__dirname, '..');

    this.locations = {
        platformRootDir: platformRootDir,
        root: this.root,
        www: path.join(this.root, 'assets/www'),
        res: path.join(this.root, 'res'),
        platformWww: path.join(this.root, 'platform_www'),
        configXml: path.join(this.root, 'res/xml/config.xml'),
        defaultConfigXml: path.join(this.root, 'cordova/defaults.xml'),
        build: path.join(this.root, 'build'),
        // NOTE: Due to platformApi spec we need to return relative paths here
        cordovaJs: 'bin/templates/project/assets/www/cordova.js',
        cordovaJsSrc: 'cordova-js-src'
    };

}

Api.createPlatform = function (dest, config, options, events) {

    //console.log("browser createPlatform !! dest:" + dest);

    events = setupEvents(events);
    var name = "HelloCordova";
    var id = "io.cordova.hellocordova";
    if(config) {
        name = config.name();
        id = config.packageName();
    }
    var result;
    try {

        var creator = require('../../lib/create');
        // console.log("creator = " + creator);
        result = creator.createProject(dest, id, name, options)
        .then(function () {
            // after platform is created we return Api instance based on new Api.js location
            // This is required to correctly resolve paths in the future api calls
            var PlatformApi = require(path.resolve(dest, 'cordova/Api'));
            return new PlatformApi('browser', dest, events);
        });
    }
    catch(e) {
        console.log("error : " + e);
        events.emit('error','createPlatform is not callable from the browser project API.');
        throw(e);
    }
    return result;


};


Api.updatePlatform = function (dest, options, events) {
    // console.log("test-platform:Api:updatePlatform");
    // todo?: create projectInstance and fulfill promise with it.
    return Promise.resolve();
};

Api.prototype.getPlatformInfo = function () {
    // console.log("browser-platform:Api:getPlatformInfo");
    // return PlatformInfo object
    return {
        "locations":this.locations,
        "root": this.root,
        "name": this.platform,
        "version": { "version" : "1.0.0" },
        "projectConfig": this._config
    };
};

Api.prototype.prepare = function (cordovaProject) {
    //console.log("browser-platform:Api:prepare");
    return Promise.resolve();
};

Api.prototype.addPlugin = function (plugin, installOptions) {
    //console.log("browser-platform:Api:addPlugin");
    return Promise.resolve();
};

Api.prototype.removePlugin = function (plugin, uninstallOptions) {
    //console.log("browser-platform:Api:removePlugin");
    return Promise.resolve();
};

Api.prototype.build = function (buildOptions) {
    var self = this;
    return require('./lib/check_reqs').run()
    .then(function () {
        return require('./lib/build').run.call(self, buildOptions);
    });
};

Api.prototype.run = function(runOptions) {
    return require('./lib/run').run(runOptions);
};

Api.prototype.clean = function(cleanOptions) {
    return require('./lib/clean').run(cleanOptions);
};

Api.prototype.requirements = function() {
    return require('./lib/check_reqs').run();
};

module.exports = Api;
