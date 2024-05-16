"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPassword = exports.hashPassword = void 0;
//Importamos la librería que utilizamos para hacer el hasheo de la contraseña "bcrypt"
const bcrypt_1 = __importDefault(require("bcrypt"));
//Este código es para hashear el password
const hashPassword = async (password) => {
    //Hasheamos la contraseña antes de guardar el usuario en la base de datos
    //El 10 significa el número de combinaciones diferentes que genera al hashear
    const salt = await bcrypt_1.default.genSalt(10);
    //Utilizamos el método .hash de bcrypt
    return await bcrypt_1.default.hash(password, salt);
};
exports.hashPassword = hashPassword;
//Código para confirmar la contrasaeña del usuario
//Le pasamos la contraseña introducida y la almacenada que ya está hasheada
const checkPassword = async (enteredPassword, storedHash) => {
    //La misma librería bcrypt la utilizamos para poder comparar la contraseña real con la hasheada
    return await bcrypt_1.default.compare(enteredPassword, storedHash);
};
exports.checkPassword = checkPassword;
//# sourceMappingURL=auth.js.map