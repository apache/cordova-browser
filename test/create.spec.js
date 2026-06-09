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

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const tmp = require('tmp');
const create = require('../lib/create');

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
    assert.ok(fs.existsSync(path.join(tmpDir, 'www')));
    assert.ok(fs.existsSync(path.join(tmpDir, 'platform_www')));
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
    assert.ok(fs.existsSync(manifestPath));
    const manifestObj = require(manifestPath);
    assert.strictEqual(manifestObj.name, projectName);
    // start_url
    assert.strictEqual(manifestObj.start_url, 'index.html');
    // display
    assert.strictEqual(manifestObj.display, 'standalone');
    // description
    assert.notStrictEqual(manifestObj.description, undefined);
    // background_color
    assert.notStrictEqual(manifestObj.background_color, undefined);
    // theme_color
    assert.notStrictEqual(manifestObj.theme_color, undefined);
    // scope
    assert.notStrictEqual(manifestObj.scope, undefined);
    // orientation
    assert.notStrictEqual(manifestObj.orientation, undefined);
    // icons
    assert.notStrictEqual(manifestObj.icons, undefined);
    assert.ok(Array.isArray(manifestObj.icons));
    assert.notStrictEqual(manifestObj.icons.length, undefined);
    assert.ok(manifestObj.icons.length > 0);
}

describe('create', () => {
    let tmpDir;

    beforeEach(function () {
        tmpDir = makeTempDir();
    });

    afterEach(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('create project with ascii name, no spaces', () => {
        const projectName = 'testcreate';
        const packageName = 'com.test.app1';
        return verifyCreatedProject(tmpDir, packageName, projectName);
    });

    it('create project with ascii name, and spaces', () => {
        const projectName = 'test create';
        const packageName = 'com.test.app2';
        return verifyCreatedProject(tmpDir, packageName, projectName);
    });

    it('create project with unicode name, no spaces', () => {
        const projectName = '応応応応用用用用';
        const packageName = 'com.test.app3';
        return verifyCreatedProject(tmpDir, packageName, projectName);
    });

    it('create project with unicode name, and spaces', () => {
        const projectName = '応応応応 用用用用';
        const packageName = 'com.test.app4';
        return verifyCreatedProject(tmpDir, packageName, projectName);
    });

    it('create project with ascii+unicode name, no spaces', () => {
        const projectName = '応応応応hello用用用用';
        const packageName = 'com.test.app5';
        return verifyCreatedProject(tmpDir, packageName, projectName);
    });

    it('create project with ascii+unicode name, and spaces', () => {
        const projectName = '応応応応 hello 用用用用';
        const packageName = 'com.test.app6';
        return verifyCreatedProject(tmpDir, packageName, projectName);
    });

    it('should have manifest.json', () => {
        const projectName = 'testcreate';
        const packageName = 'com.test.app1';
        return verifyCreatedProject(tmpDir, packageName, projectName)
            .then(() => verifyManifestFiles(tmpDir, projectName));
    });
});
