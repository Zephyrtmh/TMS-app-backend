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
        console.log(Object.values(application).push(acronym));
        return await connection.execute(applicationSql.updateApplication, applicationArray);
    }

    async updateAppRNumber(appRNumber, appAcronym) {
        return await connection.execute(applicationSql.updateAppRNumber, [appRNumber, appAcronym]);
    }

    async getAllApplications() {
        console.log("get all applications was ran");
        var [applications] = await connection.execute(applicationSql.getAllApplication);
        return applications;
    }

    async getApplicationByAcronym(acronym) {
        var [application] = await connection.execute(applicationSql.getApplicationByAppAcronym, [acronym]);
        return application[0];
    }
}

module.exports = ApplicationRepository;
