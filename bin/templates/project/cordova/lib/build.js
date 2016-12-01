#!/usr/bin/env node

'use strict';

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
// jshint -W119
// jshint -W104
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const q = require('q');
const clean = require('./clean');
const check_reqs = require('./check_reqs');

const platformWwwDir = path.join('platforms', 'browser', 'www');
const platformBuildDir = path.join('platforms', 'browser', 'build');
const packageFile = path.join(platformBuildDir, 'package.zip');

/**
 * Creates a zip file in platform/build folder
 */
module.exports.run = function(){
    return check_reqs.run().then(
        ()      => { return clean.cleanProject(); },
        (err)   => {
            console.error('Software requirements: failure');
            console.error(err);
    }).then(function(){
        if (!fs.existsSync(platformBuildDir)) {
            fs.mkdirSync(platformBuildDir);
        }

        let output = fs.createWriteStream(packageFile);
        let archive = archiver('zip');

        output.on('close', () => {
            let size = Math.floor(archive.pointer() / 1000);
            console.log(`Built ${packageFile} (${size}KB)`);
        });

        archive.on('error', err => { throw err; });
        archive.pipe(output);
        archive.directory(platformWwwDir, '');
        archive.finalize();

        return q.resolve();
    });
};

module.exports.help = function() {
    console.log(`Usage: cordova build browser`);
    console.log(`Build will create the packaged app in ${platformBuildDir}`);
};
