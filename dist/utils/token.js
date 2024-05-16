"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
//Creamos la función para generar el token de 6 dígitos
const generateToken = () => Math.floor(100000 + Math.random() * 900000).toString();
exports.generateToken = generateToken;
//# sourceMappingURL=token.js.map