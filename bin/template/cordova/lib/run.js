#!/usr/bin/env node

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var fs = require('fs'),
    path = require('path'),
    url = require('url'),
    cordovaServe = require('cordova-serve');

module.exports.run = function(args) {
    // defaults
    args.port =   args.port || 8000;
    args.target = args.target || "chrome"; // make default the system browser

    var root = path.join(__dirname, '../');
    var configFilePath = path.resolve(path.join(root, 'config.xml'));
    var startPage;
    if(fs.existsSync(configFilePath)) {
        var configXML = fs.readFileSync(configFilePath, 'utf8');
        // pull out <content src='SOME_URL'/>
        startPage = /<content[\s]+?src\s*=\s*"(.*?)"/i.exec(configXML);
    }




    var server = cordovaServe();

    server.servePlatform('browser', {port: args.port, noServerInfo: true})
    .then(function () {
        if(!startPage) {
            startPage = 'index.html';
        }
        else {
            startPage = startPage[1];
        }
        var projectUrl = url.resolve('http://localhost:' + server.port + '/', startPage);
        console.log('startPage = ' + startPage);
        console.log('Static file server running @ ' + projectUrl + '\nCTRL + C to shut down');
        return cordovaServe.launchBrowser({target: args.target, url: projectUrl});
    }).catch(function (error) {
        console.log(error.message || error.toString());
        if (server.server) {
            server.server.close();
        }
    });
};
