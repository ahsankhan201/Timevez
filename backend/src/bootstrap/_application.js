const connection = require('../database/connection/connection');
const ApplicationRoutes = require('./application-routes');
const appRoutes = new ApplicationRoutes();

class Application {

    /**
     * Initalize Application.
     */
    init() {
        connection.initConnection();
        appRoutes.registerRoutes();
    }
}

module.exports = Application;