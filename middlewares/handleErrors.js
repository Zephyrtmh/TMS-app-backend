module.exports = (err, req, res, next) => {
    //default error code and message
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    if (process.env.NODE_ENV === "development") {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errorMessage: err.message,
            stack: err.stack,
        });
    } else if (process.env.NODE_ENV === "production") {
        let error = { ...err };
        error.message = err.message;

        res.status(err.statusCode).json({
            success: false,
            message: err.message || "Internal Server Error",
        });
    }
};
