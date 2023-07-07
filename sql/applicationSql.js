//APPLICATIONS QUERIES
const createApplication = "INSERT INTO applications (app_acronym, app_description, app_Rnumber, app_startdate, app_enddate, app_permit_open, app_permit_todo, app_permit_doing, app_permit_done) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";

const getApplicationByAppAcronym = "SELECT app_acronym, app_description, app_Rnumber, app_startdate, app_enddate, app_permit_open, app_permit_todo, app_permit_doing, app_permit_done from applications where app_acronym = ?";

const getAllApplication = "SELECT app_acronym, app_description, app_Rnumber, app_startdate, app_enddate, app_permit_open, app_permit_todo, app_permit_doing, app_permit_done from applications";

const updateApplication = " UPDATE applications SET app_description = ?, app_startdate = ?, app_enddate = ?, app_permit_open = ?, app_permit_todo = ?, app_permit_doing = ?, app_permit_done = ? WHERE app_acronym = ?;";

const updateAppRNumber = "UPDATE applications SET app_Rnumber = ? where app_acronym = ?";

const getApplicationOpenPermits = "SELECT app_permit_open FROM applications where app_acronym = ?";

const getApplicationToDoPermits = "SELECT app_permit_todo FROM applications where app_acronym = ?";

const getApplicationDoingPermits = "SELECT app_permit_doing FROM applications where app_acronym = ?";

const getApplicationDonePermits = "SELECT app_permit_done FROM applications where app_acronym = ?";

module.exports = {
    createApplication,
    getApplicationByAppAcronym,
    updateApplication,
    getAllApplication,
    updateAppRNumber,
    getApplicationOpenPermits,
    getApplicationToDoPermits,
    getApplicationDoingPermits,
    getApplicationDonePermits,
};
