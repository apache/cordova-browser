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
    let command;

    // remove existing folder
    shell.rm('-rf', tmpDir);
    shell.mkdir(tmpDir);

    // create the project
    command = util.format('"%s" "%s/%s" "%s" "%s"', createScriptPath, tmpDir, projectname, projectid, projectname);
    // shell.echo(command);
    return_code = shell.exec(command).code;
    expect(return_code).toBe(0);

    const tempCordovaScriptsPath = path.join(tmpDir, projectname, 'cordova');

    console.log('tempCordovaScriptsPath = ' + tempCordovaScriptsPath);

    // created project has scripts in the cordova folder
    // build, clean, log, run, version
    expect(fs.existsSync(path.join(tempCordovaScriptsPath, 'build'))).toBe(true);
    expect(fs.existsSync(path.join(tempCordovaScriptsPath, 'clean'))).toBe(true);
    expect(fs.existsSync(path.join(tempCordovaScriptsPath, 'log'))).toBe(true);
    expect(fs.existsSync(path.join(tempCordovaScriptsPath, 'run'))).toBe(true);
    expect(fs.existsSync(path.join(tempCordovaScriptsPath, 'version'))).toBe(true);

    // // build the project
    command = util.format('"%s/cordova/build"', path.join(tmpDir, projectname));
    // shell.echo(command);
    return_code = shell.exec(command, { silent: true }).code;
    expect(return_code).toBe(0);

    // clean-up
    shell.rm('-rf', tmpDir);
}

describe('create', function () {
    it('has a create script in bin/cordova', function () {
        expect(fs.existsSync(createScriptPath)).toBe(true);
    });

    it('create project with ascii name, no spaces', function () {
        const projectname = 'testcreate';
        const projectid = 'com.test.app1';

        createAndBuild(projectname, projectid);
    });

    it('create project with ascii name, and spaces', function () {
        const projectname = 'test create';
        const projectid = 'com.test.app2';

        createAndBuild(projectname, projectid);
    });

    it('create project with unicode name, no spaces', function () {
        const projectname = '応応応応用用用用';
        const projectid = 'com.test.app3';

        createAndBuild(projectname, projectid);
    });

    it('create project with unicode name, and spaces', function () {
        const projectname = '応応応応 用用用用';
        const projectid = 'com.test.app4';

        createAndBuild(projectname, projectid);
    });

    it('create project with ascii+unicode name, no spaces', function () {
        const projectname = '応応応応hello用用用用';
        const projectid = 'com.test.app5';

        createAndBuild(projectname, projectid);
    });

    it('create project with ascii+unicode name, and spaces', function () {
        const projectname = '応応応応 hello 用用用用';
        const projectid = 'com.test.app6';

        createAndBuild(projectname, projectid);
    });
});
