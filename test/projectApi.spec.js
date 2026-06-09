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

process.env.NODE_PATH = path.resolve(__dirname, '../../');
Module._initPaths();

tmp.setGracefulCleanup();

function makeTempDir () {
    const tempdir = tmp.dirSync({ unsafeCleanup: true });
    return path.join(tempdir.name, `cordova-browser-create-test-${Date.now()}`);
}

describe('can get the Api', () => {
    it('should be defined', () => {
        assert.notStrictEqual(Api, undefined);
    });

    it('should export static createPlatform function', () => {
        assert.notStrictEqual(Api.createPlatform, undefined);
        assert.strictEqual(typeof Api.createPlatform, 'function');
    });

    it('should export static updatePlatform function', () => {
        assert.notStrictEqual(Api.updatePlatform, undefined);
        assert.strictEqual(typeof Api.updatePlatform, 'function');
    });

    describe('static createPlatform method', () => {
        it('should create a platform app and return the Api', () => {
            // Trick function under test to load our Api after callin
            const testDir = makeTempDir();

            const testOpts = {};
            const configXmlPath = path.join(__dirname, 'fixtures/default-config.xml');
            const config = new ConfigParser(configXmlPath);

            return Api.createPlatform(testDir, config, testOpts, new EventEmitter())
                .then(api => {
                    assert.ok(api instanceof Api);
                });
        });
    });
});

describe('project level Api', () => {
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

    it('can be created', () => {
        assert.notStrictEqual(testApi, undefined);
    });

    it('has a requirements method', () => {
        assert.notStrictEqual(testApi.requirements, undefined);
        assert.strictEqual(typeof testApi.requirements, 'function');
    });

    it('has a clean method', () => {
        assert.notStrictEqual(testApi.clean, undefined);
        assert.strictEqual(typeof testApi.clean, 'function');
    });

    it('has a run method', () => {
        assert.notStrictEqual(testApi.run, undefined);
        assert.strictEqual(typeof testApi.run, 'function');
    });

    it('has a build method', () => {
        assert.notStrictEqual(testApi.build, undefined);
        assert.strictEqual(typeof testApi.build, 'function');
    });

    it('has a removePlugin method', () => {
        assert.notStrictEqual(testApi.removePlugin, undefined);
        assert.strictEqual(typeof testApi.removePlugin, 'function');
    });

    it('has a addPlugin method', () => {
        assert.notStrictEqual(testApi.addPlugin, undefined);
        assert.strictEqual(typeof testApi.addPlugin, 'function');
    });

    it('has a prepare method', () => {
        assert.notStrictEqual(testApi.prepare, undefined);
        assert.strictEqual(typeof testApi.prepare, 'function');
    });

    it('has a getPlatformInfo method', () => {
        assert.notStrictEqual(testApi.getPlatformInfo, undefined);
        assert.strictEqual(typeof testApi.getPlatformInfo, 'function');
    });
});
