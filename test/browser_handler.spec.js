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

const { describe, it, mock } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const browser_handler = require('../lib/browser_handler');

describe('Asset install tests', () => {
    const asset = {
        itemType: 'asset',
        src: path.join('someSrc', 'ServiceWorker.js'),
        target: 'ServiceWorker.js'
    };
    const assetWithPath = {
        itemType: 'asset',
        src: path.join('someSrc', 'reformat.js'),
        target: path.join('js', 'deepdown', 'reformat.js')
    };
    const assetWithPath2 = {
        itemType: 'asset',
        src: path.join('someSrc', 'reformat.js'),
        target: path.join('js', 'deepdown', 'reformat2.js')
    };

    const plugin_dir = 'pluginDir';
    const wwwDest = 'dest';

    it('if src is a directory, should be called with cpSync recursive force', () => {
        const cpSyncSpy = mock.method(fs, 'cpSync', () => {});
        const mkdirSyncSpy = mock.method(fs, 'mkdirSync', () => {});
        mock.method(fs, 'statSync', () => ({
            isDirectory: () => true
        }));

        browser_handler.asset.install(asset, plugin_dir, wwwDest);

        assert.ok(
            mkdirSyncSpy.mock.calls.some(({ arguments: args }) => (
                args[0] === wwwDest &&
                args[1]?.recursive === true
            ))
        );

        assert.ok(
            cpSyncSpy.mock.calls.some(({ arguments: args }) => (
                typeof args[0] === 'string' &&
                args[1] === path.join('dest', asset.target) &&
                args[2]?.recursive === true &&
                args[2]?.force === true
            ))
        );
    });

    it('if src is not a directory and asset has no path, should be called with cp, -f', () => {
        const cpSyncSpy = mock.method(fs, 'cpSync', () => {});
        const mkdirSyncSpy = mock.method(fs, 'mkdirSync');
        mock.method(fs, 'existsSync', () => true);
        mock.method(fs, 'statSync', () => ({
            isDirectory: () => false
        }));

        browser_handler.asset.install(asset, plugin_dir, wwwDest);

        assert.strictEqual(mkdirSyncSpy.mock.calls.length, 0); // not was called
        assert.ok(
            cpSyncSpy.mock.calls.some(({ arguments: args }) => (
                args[0] === path.join('pluginDir', asset.src) &&
                args[1] === path.join('dest', asset.target) &&
                args[2]?.force === true
            ))
        );
    });

    it('if src is not a directory and asset has a path, should be called with cp, -f', () => {
        /*
            Test that a dest directory gets created if it does not exist
        */
        const cpSyncSpy = mock.method(fs, 'cpSync', () => {});
        const mkdirSyncSpy = mock.method(fs, 'mkdirSync');
        mock.method(fs, 'statSync', () => ({
            isDirectory: () => false
        }));
        mock.method(fs, 'existsSync', () => false);

        browser_handler.asset.install(assetWithPath, plugin_dir, wwwDest);

        assert.ok(
            mkdirSyncSpy.mock.calls.some(({ arguments: args }) => (
                args[0] === path.join('dest', 'js', 'deepdown') &&
                args[1]?.recursive === true
            ))
        );

        assert.ok(
            cpSyncSpy.mock.calls.some(({ arguments: args }) => (
                args[0] === path.join('pluginDir', assetWithPath.src) &&
                args[1] === path.join('dest', assetWithPath.target) &&
                args[2]?.force === true
            ))
        );

        /*
            Now test that a second call to the same dest folder skips mkdir because the first asset call should have created it.
        */
        mock.method(fs, 'existsSync', () => true);
        browser_handler.asset.install(assetWithPath2, plugin_dir, wwwDest);
        assert.strictEqual(mkdirSyncSpy.mock.calls.length, 1); // not called again
    });
});
