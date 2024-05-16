"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJWT = void 0;
//En este archivo utilizamos la dependencia de JWT que nos ayudará a la autenticación de usuario
//Importamos la dependencia
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Definimos la función para generar el json web token
//Tenemos que pasarle el tipo de dato que definimos arriba
const generateJWT = (payload) => {
    //Creamos la función del token que se va a generar
    //Antes creamos una variable de entorno llamada JWT_SECRET que contiene una palabra secreta que utilizará el token
    //Utilizamos el método sign de la dependencia JWB que permite crear el token
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        //Le damos un tiempo de expiración de 6 meses, luego de este tiempo se tendrá que autenticar de nuevo el usuario
        expiresIn: '180d'
    });
    return token;
};
exports.generateJWT = generateJWT;
//# sourceMappingURL=jwt.js.map