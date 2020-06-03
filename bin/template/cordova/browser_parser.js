/**
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const CordovaError = require('cordova-common').CordovaError;
const events = require('cordova-common').events;
const FileUpdater = require('cordova-common').FileUpdater;

function dirExists (dir) {
    return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}

function browser_parser (project) {
    if (!dirExists(project) || !dirExists(path.join(project, 'cordova'))) {
        throw new CordovaError('The provided path "' + project + '" is not a valid browser project.');
    }
    this.path = project;
}

module.exports = browser_parser;

browser_parser.prototype.www_dir = function () {
    return path.join(this.path, 'www');
};

/**
 * Logs all file operations via the verbose event stream, indented.
 */
function logFileOp (message) {
    events.emit('verbose', '  ' + message);
}

// Replace the www dir with contents of platform_www and app www.
browser_parser.prototype.update_www = function (cordovaProject, opts) {
    const platform_www = path.join(this.path, 'platform_www');
    const my_www = this.www_dir();
    // add cordova www and platform_www to sourceDirs
    const sourceDirs = [
        path.relative(cordovaProject.root, cordovaProject.locations.www),
        path.relative(cordovaProject.root, platform_www)
    ];

    // If project contains 'merges' for our platform, use them as another overrides
    const merges_path = path.join(cordovaProject.root, 'merges', 'browser');
    if (fs.existsSync(merges_path)) {
        events.emit('verbose', 'Found "merges/browser" folder. Copying its contents into the browser project.');
        // add merges/browser to sourceDirs
        sourceDirs.push(path.join('merges', 'browser'));
    }

    // targetDir points to browser/www
    const targetDir = path.relative(cordovaProject.root, my_www);
    events.emit('verbose', 'Merging and updating files from [' + sourceDirs.join(', ') + '] to ' + targetDir);
    FileUpdater.mergeAndUpdateDir(sourceDirs, targetDir, { rootDir: cordovaProject.root }, logFileOp);
};

browser_parser.prototype.config_xml = function () {
    return path.join(this.path, 'config.xml');
};

browser_parser.prototype.update_project = async function (cfg) {
    // Copy munged config.xml to platform www dir
    shell.cp('-rf', this.config_xml(), this.www_dir());
};
