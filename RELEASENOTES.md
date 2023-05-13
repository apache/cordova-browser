<!--
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
#  KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#
-->
## Release Notes for Cordova Browser ##

### 7.0.0 (May 13, 2023)

#### Breaking Changes

* [GH-121](https://github.com/apache/cordova-browser/pull/121) Minimum NodeJS Required: 16.13.0
* [GH-115](https://github.com/apache/cordova-browser/pull/115) Update ShellJS to 0.8.5.
* [GH-78](https://github.com/apache/cordova-browser/pull/78) feat: Replace `Q` with native Promises.

#### Other Notable Changes

* [GH-117](https://github.com/apache/cordova-browser/pull/117) Added `.npmrc` file to ensure the official NPM registry is used during development and deployments.
* [GH-107](https://github.com/apache/cordova-browser/pull/107) Enabled `package-lock.json` file.
* [GH-119](https://github.com/apache/cordova-browser/pull/119) Added NodeJS 20 to our test matrix.
* [GH-118](https://github.com/apache/cordova-browser/pull/118) Updated ESLint config to match better match Apache Cordova's coding style standards.
* [GH-80](https://github.com/apache/cordova-browser/pull/80) Enabled CodeCov test coverage
* [GH-113](https://github.com/apache/cordova-browser/pull/113) Migrated to GitHub Action workflows for our testing CI.

For a full list of changes, see the [commit history](https://github.com/apache/cordova-browser/compare/rel/6.0.0...4669c4dce952c658ba7eb951ebfcae35b96a56ea)

### 6.0.0 (Feb 01, 2019)
* [GH-70](https://github.com/apache/cordova-browser/pull/70) Browser Platform Release Preparation (Cordova 9)
* [GH-68](https://github.com/apache/cordova-browser/pull/68) Copy node_modules if the directory exists
* [GH-63](https://github.com/apache/cordova-browser/pull/63) Dependency bump cordova-common@^3.0.0
* [CB-13740](https://issues.apache.org/jira/browse/CB-13740) Return expected promise resolving with array
* [GH-59](https://github.com/apache/cordova-browser/pull/59) Remove Bundled Dependencies
* [CB-14073](https://issues.apache.org/jira/browse/CB-14073) **Browser**: Drop Node 4, Added Node 10
* [CB-14252](https://issues.apache.org/jira/browse/CB-14252) Allow to send --silent arg to run command to disable output (#57)
* [CB-13999](https://issues.apache.org/jira/browse/CB-13999) (browser) - Reading `config.xml` respects base href (#52)
* [GH-50](https://github.com/apache/cordova-browser/pull/50) corrected path for `config.xml`
* [CB-13689](https://issues.apache.org/jira/browse/CB-13689) Updated RELEASENOTES and Version for release 5.0.3

### 5.0.2 (Dec 18, 2017)
* [CB-13689](https://issues.apache.org/jira/browse/CB-13689): Updated checked-in node_modules
* [CB-13562](https://issues.apache.org/jira/browse/CB-13562): fixed asset tag when adding push plugin to **Browser**

### 5.0.1 (Oct 16, 2017)
* [CB-13444](https://issues.apache.org/jira/browse/CB-13444) Updated checked-in `node_modules`
* [CB-13435](https://issues.apache.org/jira/browse/CB-13435) fix merges directory support for **Browser**
* [CB-12895](https://issues.apache.org/jira/browse/CB-12895) ignoring `cordova.js` for `eslint`

### 5.0.0 (Aug 24, 2017)
* [CB-13214](https://issues.apache.org/jira/browse/CB-13214) Updated `cordova-serve` dependnecy to 2.0.0. `cordova serve` command now opens system default browser instead of a new instance of `chrome`. A specific target can still be passed in. 
* [CB-13214](https://issues.apache.org/jira/browse/CB-13214) Updated checked-in `node_modules`
* [CB-13188](https://issues.apache.org/jira/browse/CB-13188) fixed issues with run and build scripts. 
* [CB-12895](https://issues.apache.org/jira/browse/CB-12895): set up `eslint` and remove `jshint`
* [CB-11181](https://issues.apache.org/jira/browse/CB-11181) add default favicon
* [CB-11710](https://issues.apache.org/jira/browse/CB-11710) Add missing 'clean.bat' file
* remove old `xhr-activex` **Windows** code, update to use `pagevisibility` instead of `webkitpagevisibility`
* [CB-12804](https://issues.apache.org/jira/browse/CB-12804): `manifest.json` added to **Browser** during create. Adding basic PWA support
* [CB-12762](https://issues.apache.org/jira/browse/CB-12762) Point repo items to github mirrors
* Clean up PRs. Closes #2. Closes #25
* [CB-12617](https://issues.apache.org/jira/browse/CB-12617) : removed node 0.x support and added engineStrict. This closes #27
* [CB-12847](https://issues.apache.org/jira/browse/CB-12847) added `bugs` entry to `package.json`.
* [CB-12527](https://issues.apache.org/jira/browse/CB-12527) large refactor. Implemented `PlatformApi`
* [CB-12114](https://issues.apache.org/jira/browse/CB-12114) added travis and appveyor files
* Add github pull request template

### 4.0.0 (Aug 13, 2015)
* updated version in version script
* added `.ratignore` and added missing AL header to readme
* removed other platform screens from template
* updated to 4.0.0-dev
* [CB-8965](https://issues.apache.org/jira/browse/CB-8965) Copy `cordova-js-src` directory to platform folder during create
* Adds LICENSE and NOTICE files.
* [CB-9350](https://issues.apache.org/jira/browse/CB-9350) 'cordova run browser' throws an exception.
* Update 'cordova run browser' command to use cordova-serve module.
* [CB-8417](https://issues.apache.org/jira/browse/CB-8417) update platform specific js from cordovajs
* [CB-8760](https://issues.apache.org/jira/browse/CB-8760) platform list shows wrong version for browser platform.
* [CB-8182](https://issues.apache.org/jira/browse/CB-8182) port `cordova serve` to `cordova run browser`
* [CB-8182](https://issues.apache.org/jira/browse/CB-8182) add dependency on `mime` library
* [CB-8196](https://issues.apache.org/jira/browse/CB-8196) Browser platform `run` should default source file to index.html even if it's missing in the config.xml
* [CB-8223](https://issues.apache.org/jira/browse/CB-8223) Expose config.xml in the Browser platform
* [CB-8417](https://issues.apache.org/jira/browse/CB-8417) renamed platform_modules into cordova-js-src
* [CB-8417](https://issues.apache.org/jira/browse/CB-8417) moved platform specific js into platform
* [CB-8224](https://issues.apache.org/jira/browse/CB-8224) Add support to launch a specified browser using --target switch. Support for multiple browsers on Windows, Mac and Linux
* Add Windows specific shim wrappers for shjs - auto-generated by npm install
* [CB-8206](https://issues.apache.org/jira/browse/CB-8206) Browser platform: Add support for update
* --user-data-dir working on windows
* [CB-7978](https://issues.apache.org/jira/browse/CB-7978) Cleaning code and creating temporary dir - Using path.resolve and path.join instead of concatenating paths - Fixing error when temporary dir already exists by using shelljs instead of fs
* [CB-7978](https://issues.apache.org/jira/browse/CB-7978) Cleaning code and creating temporary dir - Cleaning code - Declaring variables only when needed - Creating chrome for Cordova temp dir prior using it by std and err
* [CB-7978](https://issues.apache.org/jira/browse/CB-7978) Fixed launching chrome in Linux

### 3.6.0 ###
* Update JS snapshot to version 3.6.0 (via coho)
* Set VERSION to 3.6.0 (via coho)
* added run.bat file
* added windows run support, still a few issues
* No longer need to kill Chrome for mac
* added create.bat for windows support
* Removed old dependency from source
* Fixed issue with npm cache when adding browser
* Fixed directory structure
* Creating browser project
* [CB-6818](https://issues.apache.org/jira/browse/CB-6818) Add license for CONTRIBUTING.md
* [CB-6491](https://issues.apache.org/jira/browse/CB-6491) add CONTRIBUTING.md
