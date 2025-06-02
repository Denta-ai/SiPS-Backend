"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMAGEKIT_URL = exports.IMAGEKIT_PUBLIC_KEY = exports.IMAGEKIT_PRIVATE_KEY = exports.PASS = exports.USER = exports.BASE_URL = exports.CLIENT_ID = exports.CLIENT_SECRET = exports.JWT_SECRET = exports.SALT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.SALT = +(process.env.SALT || 10);
exports.JWT_SECRET = process.env.JWT_SECRET || '';
exports.CLIENT_SECRET = process.env.CLIENT_SECRET || '';
exports.CLIENT_ID = process.env.CLIENT_ID || '';
exports.BASE_URL = process.env.BASE_URL || '';
exports.USER = process.env.USER || '';
exports.PASS = process.env.PASS || '';
exports.IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || '';
exports.IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY || '';
exports.IMAGEKIT_URL = process.env.IMAGEKIT_URL || '';
