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

const { describe, it, before } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const { Module } = require('node:module');
const EventEmitter = require('node:events');

const tmp = require('tmp');
const { ConfigParser } = require('cordova-common');
const Api = require('../lib/Api');
const DevServer = require('../lib/DevServer');

process.env.NODE_PATH = path.resolve(__dirname, '../../');
Module._initPaths();

tmp.setGracefulCleanup();

function makeTempDir () {
    const tempdir = tmp.dirSync({ unsafeCleanup: true });
    return path.join(tempdir.name, `cordova-browser-create-test-${Date.now()}`);
}

describe('DevServer API', () => {
    let testApi = null;

    before(() => {
        const testDir = makeTempDir();

        const testOpts = {};
        const configXmlPath = path.join(__dirname, 'fixtures/default-config.xml');
        const config = new ConfigParser(configXmlPath);

        return Api.createPlatform(testDir, config, testOpts, new EventEmitter())
            .then(api => {
                testApi = api;
            });
    });

    it('should throw an error new DevServer missing arguments', () => {
        assert.throws(() => new DevServer(), {
            name: 'Error',
            message: 'Missing path to the project\'s platform www directory.'
        });
    });

    it('should throw an error when missing project\'s platform www directory.', () => {
        assert.throws(() => new DevServer({}, {}), {
            name: 'Error',
            message: 'Missing path to the project\'s platform www directory.'
        });
    });

    it('should throw an error when project\'s platform www directory is not valid.', () => {
        assert.throws(() => new DevServer({}, { www: '/tmp/foobar' }), {
            name: 'Error',
            message: 'Path to project\'s platform www directory does not exist.'
        });
    });

    it('should not throw an error when project\'s platform www directory is valid.', () => {
        assert.doesNotThrow(() => new DevServer({}, testApi.locations), {
            name: 'Error',
            message: 'Path to project\'s platform www directory does not exist.'
        });
    });
});
