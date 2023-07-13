const connection = require("../sqlConnection/sqlConnection");
const Application = require("../models/Application");
const applicationSql = require("../sql/applicationSql");
// Import any necessary SQL queries or utility functions

class ApplicationRepository {
    // Implement the repository methods for application CRUD operations
    // You can use the User Repository as a reference for writing these methods
    // For example:
    async createApplication(application) {
        var applicationCreated = await connection.execute(applicationSql.createApplication, Object.values(application));
        return applicationCreated;
    }

    async deleteApplication(acronym) {
        // Implementation
    }

    async updateApplication(acronym, application) {
        var applicationArray = Object.values(application);
        applicationArray.push(acronym);
        .push(acronym));
        return await connection.execute(applicationSql.updateApplication, applicationArray);
    }

    async updateAppRNumber(appRNumber, appAcronym) {
        return await connection.execute(applicationSql.updateAppRNumber, [appRNumber, appAcronym]);
    }

    async getAllApplications() {
        ;
        var [applications] = await connection.execute(applicationSql.getAllApplication);
        return applications;
    }

    async getApplicationByAcronym(acronym) {
        var [application] = await connection.execute(applicationSql.getApplicationByAppAcronym, [acronym]);
        return application[0];
    }

    async getApplicationOpenPermits(app_acronym) {
        var [permits] = await connection.execute(applicationSql.getApplicationOpenPermits, [app_acronym]);
        return permits[0];
    }

    async getApplicationToDoPermits(app_acronym) {
        var [permits] = await connection.execute(applicationSql.getApplicationToDoPermits, [app_acronym]);
        return permits[0];
    }

    async getApplicationDoingPermits(app_acronym) {
        var [permits] = await connection.execute(applicationSql.getApplicationDoingPermits, [app_acronym]);
        return permits[0];
    }

    async getApplicationDonePermits(app_acronym) {
        var [permits] = await connection.execute(applicationSql.getApplicationDonePermits, [app_acronym]);
        return permits[0];
    }
}

module.exports = ApplicationRepository;
