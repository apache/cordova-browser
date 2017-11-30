/**
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

var browser_handler = require('../bin/template/cordova/browser_handler');
var shell = require('shelljs');
var fs = require('fs');
var path = require('path');

describe('Asset install tests', function () {
    var fsstatMock;
    var asset = { itemType: 'asset', src: 'someSrc/ServiceWorker.js', target: 'ServiceWorker.js' };
    var assetPath = { itemType: 'asset', src: 'someSrc/reformat.js', target: 'js/deepdown/reformat.js' };
    var plugin_dir = 'pluginDir';
    var wwwDest = 'dest';
    // var cpPath = path.join(plugin_dir, asset.src);

    it('if src is a directory, should be called with cp, -Rf', function () {
        var cp = spyOn(shell, 'cp').and.returnValue('-Rf');
        fsstatMock = {
            isDirectory: function () {
                return true;
            }
        };
        spyOn(fs, 'statSync').and.returnValue(fsstatMock);
        browser_handler.asset.install(asset, plugin_dir, wwwDest);
        expect(cp).toHaveBeenCalledWith('-Rf', jasmine.any(String), path.join('dest', asset.target));
    });
    it('if src is not a directory and asset has no path, should be called with cp, -f', function () {
        var cp = spyOn(shell, 'cp').and.returnValue('-f');
        var mkdir = spyOn(shell, 'mkdir');
        fsstatMock = {
            isDirectory: function () {
                return false;
            }
        };
        spyOn(fs, 'statSync').and.returnValue(fsstatMock);
        browser_handler.asset.install(asset, plugin_dir, wwwDest);
        expect(mkdir).not.toHaveBeenCalled();
        expect(cp).toHaveBeenCalledWith('-f', 'pluginDir/someSrc/ServiceWorker.js', 'dest/ServiceWorker.js');
    });
    it('if src is not a directory and asset has a path, should be called with cp, -f', function () {
        var cp = spyOn(shell, 'cp').and.returnValue('-f');
        var mkdir = spyOn(shell, 'mkdir');
        fsstatMock = {
            isDirectory: function () {
                return false;
            }
        };
        spyOn(fs, 'statSync').and.returnValue(fsstatMock);
        browser_handler.asset.install(assetPath, plugin_dir, wwwDest);
        expect(mkdir).toHaveBeenCalledWith('dest/js/deepdown');
        expect(cp).toHaveBeenCalledWith('-f', 'pluginDir/someSrc/reformat.js', 'dest/js/deepdown/reformat.js');
    });
});
