#!/usr/bin/env node

/*
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

const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.join(__dirname, '..');
const events = require('cordova-common').events;
const check_reqs = require('./check_reqs');

// exported method to create a project, returns a promise that resolves with null
module.exports.createProject = function (project_path, package_name, project_name) {
/*
    // create the dest and the standard place for our api to live
    // platforms/platformName/cordova/Api.js
*/

    events.emit('log', 'Creating Cordova project for cordova-browser:');
    events.emit('log', '\tPath: ' + project_path);
    events.emit('log', '\tName: ' + project_name);

    // Set default values for path, package and name
    project_path = project_path || 'CordovaExample';

    // Check if project already exists
    if (fs.existsSync(project_path)) {
        events.emit('error', 'Oops, destination already exists! Delete it and try again');
    } else {
        fs.mkdirSync(project_path);
    }

    // Check that requirements are met and proper targets are installed
    if (!check_reqs.run()) {
        // TODO: use events.emit
        events.emit('error', 'Please make sure you meet the software requirements in order to build a browser cordova project');
    }

    // copy template/* to project_path directory ( recursive )
    fs.cpSync(path.join(ROOT, 'bin/template'), project_path, { recursive: true });

    // TODO: stop copying cordova-browser logic into platforms/browser/
    // recreate our node_modules structure in the new project
    const nodeModulesDir = path.join(ROOT, 'node_modules');
    if (fs.existsSync(nodeModulesDir)) {
        fs.cpSync(nodeModulesDir, path.join(project_path, 'cordova/node_modules'), { recursive: true });
    }

    // copy check_reqs file
    fs.cpSync(
        path.join(ROOT, 'lib/check_reqs.js'),
        path.join(project_path, 'cordova/lib/check_reqs.js')
    );

    // create platform_www dir if it does not exist yet
    const platform_www = path.join(project_path, 'platform_www');
    fs.mkdirSync(platform_www, { recursive: true });

    // copy cordova js file to platform_www
    fs.cpSync(
        path.join(ROOT, 'bin/template/www/cordova.js'),
        path.join(platform_www, 'cordova.js')
    );

    // copy favicon file to platform_www
    fs.cpSync(
        path.join(ROOT, 'bin/template/www/favicon.ico'),
        path.join(platform_www, 'favicon.ico')
    );

    // load manifest to write name/shortname
    const manifest = require(path.join(ROOT, 'bin/template/www', 'manifest.json'));
    manifest.name = project_name;
    manifest.short_name = project_name;
    // copy manifest file to platform_www
    fs.writeFileSync(path.join(platform_www, 'manifest.json'),
        JSON.stringify(manifest, null, 2), 'utf-8');

    return Promise.resolve();
};
