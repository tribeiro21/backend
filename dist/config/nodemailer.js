"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
//Este archivo es para probar el envío de emails con esta herramienta llamada Mailtrap
//Utilizamos la dependencia nodemailer para nodejs
//Importamos la dependencia nodemailer
const nodemailer_1 = __importDefault(require("nodemailer"));
//Importamos el archivo de las variables de entorno
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = () => {
    return {
        //Hemos creado las variables de entorno en el archivo env para mantener ocultas estas credenciales
        host: process.env.SMTP_HOST,
        //En el caso del puerto, como es un número, le colocamos el signo + delante
        port: +process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    };
};
exports.transporter = nodemailer_1.default.createTransport(config());
//# sourceMappingURL=nodemailer.js.map