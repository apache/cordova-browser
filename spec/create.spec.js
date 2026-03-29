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
const tmp = require('tmp');
const create = require('../bin/lib/create');

tmp.setGracefulCleanup();

function makeTempDir () {
    const tempdir = tmp.dirSync({ unsafeCleanup: true });
    return path.join(tempdir.name, `cordova-browser-create-test-${Date.now()}`);
}

/**
 * Verifies that some of the project file exists. Not all will be tested.
 * E.g. App's resource directory, xcodeproj, xcworkspace, and CordovaLib.
 *
 * @param {String} tmpDir
 * @param {String} projectName
 */
function verifyProjectFiles (tmpDir, projectName) {
    expect(fs.existsSync(path.join(tmpDir, 'www'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, 'platform_www'))).toBe(true);
}

/**
 * Runs various project creation checks.
 *
 * @param {String} tmpDir
 * @param {String} packageName
 * @param {String} projectName
 * @returns {Promise}
 */
async function verifyCreatedProject (tmpDir, packageName, projectName) {
    await create.createProject(tmpDir, packageName, projectName)
        .then(() => verifyProjectFiles(tmpDir, projectName));
}

function verifyManifestFiles (tmpDir, projectName) {
    const manifestPath = path.join(tmpDir, 'platform_www/manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);
    const manifestObj = require(manifestPath);
    expect(manifestObj.name).toBe(projectName);
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
}

describe('create', () => {
    let tmpDir;

    beforeEach(function () {
        tmpDir = makeTempDir();
    });

    afterEach(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('create project with ascii name, no spaces', function () {
        const projectName = 'testcreate';
        const packageName = 'com.test.app1';
        return verifyCreatedProject(tmpDir, packageName, projectName);
    });

    it('create project with ascii name, and spaces', function () {
        const projectName = 'test create';
        const packageName = 'com.test.app2';
        return verifyCreatedProject(tmpDir, packageName, projectName);
    });

    it('create project with unicode name, no spaces', function () {
        const projectName = '応応応応用用用用';
        const packageName = 'com.test.app3';
        return verifyCreatedProject(tmpDir, packageName, projectName);
    });

    it('create project with unicode name, and spaces', function () {
        const projectName = '応応応応 用用用用';
        const packageName = 'com.test.app4';
        return verifyCreatedProject(tmpDir, packageName, projectName);
    });

    it('create project with ascii+unicode name, no spaces', function () {
        const projectName = '応応応応hello用用用用';
        const packageName = 'com.test.app5';
        return verifyCreatedProject(tmpDir, packageName, projectName);
    });

    it('create project with ascii+unicode name, and spaces', function () {
        const projectName = '応応応応 hello 用用用用';
        const packageName = 'com.test.app6';
        return verifyCreatedProject(tmpDir, packageName, projectName);
    });

    it('should have manifest.json', function () {
        const projectName = 'testcreate';
        const packageName = 'com.test.app1';
        return verifyCreatedProject(tmpDir, packageName, projectName)
            .then(() => verifyManifestFiles(tmpDir, projectName));
    });
});
