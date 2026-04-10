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
const { CordovaError, events } = require('cordova-common');
const check_reqs = require('./check_reqs');

// exported method to create a project, returns a promise that resolves with null
module.exports.createProject = function (project_path, package_name, project_name, opts, root_config) {
    opts = opts || {};

    project_path = path.relative(process.cwd(), project_path);

    // Check if project already exists
    if (fs.existsSync(project_path)) {
        throw new CordovaError('Project already exists');
    }

    package_name = package_name || 'org.apache.cordova.hellocordova';
    project_name = project_name || 'Hello Cordova';

    events.emit('log', 'Creating Cordova project for the browser platform:');
    events.emit('log', `\tPath: ${project_path}`);
    events.emit('log', `\tPackage: ${package_name}`);
    events.emit('log', `\tName: ${project_name}`);

    fs.mkdirSync(project_path);

    // Check that requirements are met and proper targets are installed
    if (!check_reqs.run()) {
        // TODO: use events.emit
        events.emit('error', 'Please make sure you meet the software requirements in order to build a browser cordova project');
    }

    // copy templates/* to project_path directory ( recursive )
    fs.cpSync(path.join(ROOT, 'templates'), project_path, { recursive: true });

    // create platform_www dir if it does not exist yet
    const platform_www = path.join(project_path, 'platform_www');
    fs.mkdirSync(platform_www, { recursive: true });

    // copy cordova js file to platform_www
    fs.cpSync(
        path.join(ROOT, 'templates/www/cordova.js'),
        path.join(platform_www, 'cordova.js')
    );

    // copy favicon file to platform_www
    fs.cpSync(
        path.join(ROOT, 'templates/www/favicon.ico'),
        path.join(platform_www, 'favicon.ico')
    );

    // load manifest to write name/shortname
    const manifest = require(path.join(ROOT, 'templates/www', 'manifest.json'));
    manifest.name = project_name;
    manifest.short_name = project_name;
    // copy manifest file to platform_www
    fs.writeFileSync(path.join(platform_www, 'manifest.json'),
        JSON.stringify(manifest, null, 2), 'utf-8');

    return Promise.resolve();
};
