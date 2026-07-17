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

const http = require('node:http');
const https = require('node:https');
const fs = require('node:fs');
const { styleText } = require('node:util');
const express = require('express');
const compression = require('compression');
const { default: open, apps: supportedBrowsers } = require('open');

// TODO: Replace with String.dedent once it's supported by our minimum Node.js version.
const dedent = require('string-dedent');

/**
 * @typedef DevServerOptions
 * @type {object}
 * @property {string} ssl-cert-file - path to the certificate file
 * @property {string} ssl-key-file - path to the key file
 * @property {number} port
 * @property {string} startUrl - URI that is appended to <scheme>://localhost:<port>/ (default = index.html)
 * @property {express.Router} router - .
 * @property {string[]} argv - browser arguments
 */

/**
 * @class DevServer
 */
class DevServer {
    /** @type {express.Express} */
    app;

    /** @type {URL} URL to the app */
    appUrl;

    /** @type {http.Server|https.Server} */
    #server;

    /** @type {DevServerOptions} */
    #serverOpts;

    /** @type {object} */
    #projectLocationPaths;

    /** @type {string} scheme that the app will be served from */
    #scheme;

    /** @type {number} port that the app will be served from */
    #port;

    /** @type {boolean} flag to check if the host machine is darwin */
    static #isDarwin = process.platform === 'darwin';

    /**
     *
     * @param {DevServerOptions} serverOpts
     */
    constructor (serverOpts = {}, projectLocationPaths = {}) {
        this.#serverOpts = serverOpts || {};
        this.#projectLocationPaths = projectLocationPaths || {};

        this.#createApp();
    }

    /**
     * Creates and stores the Express instance on app.
     */
    #createApp () {
        if (!this.#projectLocationPaths.www) {
            throw new Error('Missing path to the project\'s platform www directory.');
        }

        this.app = express();

        // Attach this before anything else to provide status output
        this.app.use(this.#appStatusHandler);
        this.app.use(compression());

        if (this.#serverOpts.router) {
            this.app.use(this.#serverOpts.router);
        }

        if (this.#projectLocationPaths.www) {
            this.app.use(express.static(this.#projectLocationPaths.www));
        }
    }

    /**
     * @returns {Promise} resolves to this instance or rejects with an error.
     */
    async createAndLaunchServer () {
        return new Promise((resolve, reject) => {
            let httpsServOptions;
            try {
                httpsServOptions = {
                    cert: fs.readFileSync(this.#serverOpts['ssl-cert-file']),
                    key: fs.readFileSync(this.#serverOpts['ssl-key-file'])
                };
            } catch (e) {
                // If any one of them fails to read then we dont have what we need for HTTPS
                httpsServOptions = undefined;
            }

            this.#server = httpsServOptions
                ? https.Server(httpsServOptions, this.app)
                : http.Server(this.app);

            this.#server.listen(this.#serverOpts.port || undefined);

            this.#scheme = httpsServOptions ? 'https' : 'http';
            this.#port = this.#server?.address()?.port;

            this.#server.once('listening', () => {
                this.#serverOnListening(resolve);
            });
            this.#server.once('error', (e) => {
                reject(e);
            });
        });
    }

    // MARK: App Handlers

    #appStatusHandler (req, res, next) {
        res.on('finish', function () {
            const statusColor = this.statusCode === 404 ? 'red' : 'green';
            const statusCode = styleText(statusColor, this.statusCode.toString());

            let msg = `${statusCode} ${this.req.originalUrl}`;

            const encoding = this.getHeader('content-encoding');
            if (encoding) {
                msg += styleText('gray', ` (${encoding})`);
            }
            console.log(msg);
        });
        next();
    }

    // MARK: HTTP Listeners

    /**
     * Server's on listening handler
     *
     * @param {Promise.resolve} resolve
     * @param {Promise.reject} reject
     */
    #serverOnListening (resolve, reject) {
        // The app url to be opened when target is not none.
        this.appUrl = new URL(`${this.#scheme}://localhost:${this.#port}/${this.#serverOpts.startUrl}`);

        const developmentWarning = dedent`
            This development server is for testing only. Do not use it in production.
            For advanced debugging, use your own setup and serve the app content located at:

            ${this.#projectLocationPaths.www}
        `;
        const message = dedent`
            Static file server running on: ${styleText(['green', 'bold'], this.appUrl.href)}

            ${styleText(['yellow', 'bold'], developmentWarning)}

            (${DevServer.#isDarwin ? 'Control' : 'CTRL'} + C to shut down)\n
        `;
        console.log(message);

        // Check if the browser should open.
        const browserTarget = this.#serverOpts?.target?.toString().toLowerCase() ?? 'default';
        if (browserTarget !== 'none') {
            this.#openBrowser(browserTarget);
        }

        resolve(this);
    }

    // MARK: Handlers support methods

    #openBrowser (browserTarget) {
        const openOptions = { app: {} };

        const filteredSupportedBrowsers = Object.keys(supportedBrowsers)
            .filter(b => !['browser', 'browserPrivate'].includes(b));

        if (browserTarget !== 'default') {
            if (!filteredSupportedBrowsers.includes(browserTarget)) {
                console.log(styleText('red', dedent`
                    Invalid target (${browserTarget}) was supplied and will fallback to default.
                    Valid targets: ${filteredSupportedBrowsers.join(', ')}\n
                `));
            } else {
                openOptions.app.name = supportedBrowsers[browserTarget];
            }
        }

        const browserArgs = this.#serverOpts?.argv ?? [];
        if ((browserArgs.length ?? 0) > 0) {
            openOptions.app.arguments = browserArgs;
        }

        open(this.appUrl.href, openOptions);
    }
}

module.exports = DevServer;
