const express = require('express');
const app = express();
const { db_port } = require('../config');
const { ApiUrl } = require('../shared');
const { appRoute,userRoute, attendanceRoute, leaveRoute} = require('../routes');

class ApplicationRoutes {

    constructor() {
        this.defineHeaders();
        this.enableParsing();
        this.initAppListener();
        this.registerRoutes();
    }

    /**
     * Enables parsing of json object in the body of request (i.e. req.body).
     */
    enableParsing() {
        app.use(express.json({limit: '50mb'}));
        app.use(express.urlencoded({limit: '50mb', extended: false }));
    }

    /**
    * Define request headers.
    */
    defineHeaders() {
        app.use((req, res, next) => {
            // Website you wish to allow to connect
            res.setHeader("Access-Control-Allow-Origin", "*");
            // Request headers you wish to allow
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            // Request methods you wish to allow
            res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
            // Pass to next layer of middleware

            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
            res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
            res.setHeader("Expires", "0"); // Proxies.

            next();
        });
    }

    /**
     * Listen Api requests on defined Port number.
     */
    initAppListener() {
        app.listen(db_port, () => console.log(`Listening on port:${db_port}`));
    }

    /**
     * Register routes.
     */
    registerRoutes() {
        app.use('/', appRoute);
        app.use(`${ApiUrl.userBaseUrl}`, userRoute);
        app.use(`${ApiUrl.attendanceBaseUrl}`, attendanceRoute);
        app.use(`${ApiUrl.leaveBaseUrl}`, leaveRoute);
    }
}

module.exports = ApplicationRoutes;