"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = void 0;
const response = (res, status = 200, message = 'Success', success = true, data = {}) => {
    return res.status(status).json({
        success: success,
        message: message,
        data: data
    });
};
exports.response = response;
//# sourceMappingURL=response.js.map