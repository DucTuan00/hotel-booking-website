class ApiError extends Error {
    statusCode: number;
    code?: string;
    data?: any;

    constructor(message: string, statusCode: number, code?: string, data?: any) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;
