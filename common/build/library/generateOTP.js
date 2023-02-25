"use strict";
//This function returns a random digit that is equal to the specified length
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
const generateOTP = (OTPlength) => {
    return Math.floor(Math.pow(10, OTPlength - 1) +
        Math.random() * (Math.pow(10, OTPlength) - Math.pow(10, OTPlength - 1) - 1));
};
exports.generateOTP = generateOTP;
