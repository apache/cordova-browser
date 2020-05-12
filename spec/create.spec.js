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

var fs = require('fs-extra');
var path = require('path');
const { superspawn } = require('cordova-common');

var cordova_bin = path.join(__dirname, '../bin');// is this the same on all platforms?
var createScriptPath = path.join(cordova_bin, 'create');
const tmp = require('tmp').dirSync().name;

function createAndBuild (projectname, projectid) {
    const projectTempDir = path.join(`${tmp}/${projectname}`);
    const createBin = path.join(`${cordova_bin}/create`);
    const buildBin = path.join(`${projectTempDir}/cordova/build`);

    // Remove any pre-existing temp projects
    fs.removeSync(projectTempDir);

    return superspawn.spawn(createBin, [projectTempDir, projectid, projectname], { printCommand: true }).then(
        () => {
            expect(true).toBe(true); // It is expected that create is successful

            return superspawn.spawn(buildBin, [], { printCommand: true }).then(
                () => {
                    expect(true).toBe(true); // It is expected that build is successful
                },
                () => fail('Project Build has failed and is not expected.')
            );
        },
        () => fail('Project create has failed and is not expected.')
    ).finally(() => {
        // Delete Temp Project
        fs.removeSync(projectTempDir);
    });
}

describe('create', function () {

    it('has a create script in bin/cordova', function () {
        expect(fs.existsSync(createScriptPath)).toBe(true);
    });

    it('create project with ascii name, no spaces', function () {
        var projectname = 'testcreate';
        var projectid = 'com.test.app1';

        createAndBuild(projectname, projectid);
    });

    it('create project with ascii name, and spaces', function () {
        var projectname = 'test create';
        var projectid = 'com.test.app2';

        createAndBuild(projectname, projectid);
    });

    it('create project with unicode name, no spaces', function () {
        var projectname = '応応応応用用用用';
        var projectid = 'com.test.app3';

        createAndBuild(projectname, projectid);
    });

    it('create project with unicode name, and spaces', function () {
        var projectname = '応応応応 用用用用';
        var projectid = 'com.test.app4';

        createAndBuild(projectname, projectid);
    });

    it('create project with ascii+unicode name, no spaces', function () {
        var projectname = '応応応応hello用用用用';
        var projectid = 'com.test.app5';

        createAndBuild(projectname, projectid);
    });

    it('create project with ascii+unicode name, and spaces', function () {
        var projectname = '応応応応 hello 用用用用';
        var projectid = 'com.test.app6';

        createAndBuild(projectname, projectid);
    });

});
