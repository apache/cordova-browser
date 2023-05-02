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

const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const util = require('util');

const cordova_bin = path.join(__dirname, '../bin');// is this the same on all platforms?
const tmpDir = path.join(__dirname, '../temp');
const createScriptPath = path.join(cordova_bin, 'create');

function createAndBuild (projectname, projectid) {
    let return_code = 0;

    // remove existing folder
    shell.rm('-rf', tmpDir);
    shell.mkdir(tmpDir);

    // create the project
    const command = util.format('"%s" "%s/%s" "%s" "%s"', createScriptPath, tmpDir, projectname, projectid, projectname);

    return_code = shell.exec(command).code;
    expect(return_code).toBe(0);

    const platWwwPath = path.join(tmpDir, projectname, 'platform_www');

    const manifestPath = path.join(platWwwPath, 'manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifestObj = require(manifestPath);
    expect(manifestObj.name).toBe(projectname);
    // start_url
    expect(manifestObj.start_url).toBe('index.html');
    // display
    expect(manifestObj.display).toBe('standalone');
    // description
    expect(manifestObj.description).toBeDefined();
    // background_color
    expect(manifestObj.background_color).toBeDefined();
    // theme_color
    expect(manifestObj.theme_color).toBeDefined();
    // scope
    expect(manifestObj.scope).toBeDefined();
    // orientation
    expect(manifestObj.orientation).toBeDefined();
    // icons
    expect(manifestObj.icons).toBeDefined();
    expect(Array.isArray(manifestObj.icons)).toBe(true);
    expect(manifestObj.icons.length).toBeDefined();
    expect(manifestObj.icons.length).toBeGreaterThan(0);

    // related_applications[{platform:'web'},{platform:'play',url:...}] ?

    // clean-up
    shell.rm('-rf', tmpDir);
}

describe('create', function () {
    it('create project with manifest.json', function () {
        const projectname = 'testcreate';
        const projectid = 'com.test.app1';

        createAndBuild(projectname, projectid);
    });
});
