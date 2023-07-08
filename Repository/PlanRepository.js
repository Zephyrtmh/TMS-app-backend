const connection = require("../sqlConnection/sqlConnection");
const Plan = require("../models/Plan");
const planSql = require("../sql/planSql");
// Import any necessary SQL queries or utility functions

class PlanRepository {
    // Implement the repository methods for plan CRUD operations
    // You can use the User Repository as a reference for writing these methods
    // For example:
    async createPlan(plan) {
        console.log(plan);
        var planCreated = await connection.execute(planSql.createPlan, Object.values(plan));
        return planCreated;
    }

    async deletePlan(mvpName) {
        // Implementation
    }

    async updatePlan(plan) {}

    async getAllPlans() {
        var [plans] = await connection.execute(planSql.getAllPlans);
        return plans;
    }

    async getPlanByMVPName(mvpName) {
        var [plans] = await connection.execute(planSql.getPlanByMvpName, [mvpName]);
        return plans;
    }

    async getTakenColours(appAccronym) {
        var [takenColours] = await connection.execute(planSql.getTakenColours, [appAccronym]);
        return takenColours;
    }
}

module.exports = PlanRepository;
