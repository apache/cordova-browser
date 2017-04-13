#!/usr/bin/env node

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var fs = require('fs'),
    shell = require('shelljs'),
    args = process.argv,
    path = require('path'),
    ROOT    = path.join(__dirname, '..', '..'),
    check_reqs = require('./check_reqs');

module.exports.createProject = function(project_path,package_name,project_name){

    console.log("ROOT = " + ROOT);
    console.log("browser :: createProject",project_path,package_name,project_name);


/*
    // create the dest and the standard place for our api to live
    // platforms/platformName/cordova/Api.js

    // TODO: other platforms emit log info
    events.emit('log', 'Creating Cordova project for cordova-browser:');
    events.emit('log', '\tPath: ' + dest);
    events.emit('log', '\tName: ' + projectName);

*/

    var VERSION = fs.readFileSync(path.join(ROOT, 'VERSION'), 'utf-8');

    // Set default values for path, package and name
    project_path = project_path || "CordovaExample";

    // Check if project already exists
    if (fs.existsSync(project_path)) {
        console.error('Project already exists! Delete and recreate');
        process.exitCode = 2;
        return;
    }

    // Check that requirements are met and proper targets are installed
    if (!check_reqs.run()) {
        // TODO: use events.emit
        console.error('Please make sure you meet the software requirements in order to build a browser cordova project');
        process.exitCode = 2;
        return;
    }

    //copy template directory ( recursive )
    //shell.cp('-r', path.join(ROOT, 'bin/templates/project/www'), project_path);

    //create cordova/lib if it does not exist yet
    if (!fs.existsSync(path.join(project_path,'cordova/lib'))) {
        shell.mkdir('-p', path.join(project_path,'cordova/lib'));
    }

    //copy required node_modules
    shell.cp('-r', path.join(ROOT, 'node_modules'), path.join(project_path,'cordova'));

    //copy check_reqs file
    shell.cp( path.join(ROOT, 'bin/lib/check_reqs.js'), path.join(project_path,'cordova/lib'));

    //copy cordova js file
    shell.cp('-r', path.join(ROOT, 'cordova-lib', 'cordova.js'), path.join(project_path,'www'));

    //copy cordova-js-src directory
    shell.cp('-rf', path.join(ROOT, 'cordova-js-src'), path.join(project_path, 'platform_www'));

    //copy cordova directory
    shell.cp('-r', path.join(ROOT, 'bin/template/cordova'), project_path);
    return Promise.resolve();
};
