"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckRequestType = void 0;
const CheckRequestType = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
};
exports.CheckRequestType = CheckRequestType;
