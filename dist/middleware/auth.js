"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
//En este middleware nos vamos a asegurar de que para poder hacer cualquier cosa (crear proyectos o tareas) primero validamos que el usuario esté autenticado
const authenticate = async (req, res, next) => {
    //Creamos una variable "bearer" que va a ser la encargada de verificar la autorización del usuario
    const bearer = req.headers.authorization;
    //Si no existe dicha variable, es decir, no está validado el usuario, dame el error
    if (!bearer) {
        const error = new Error('No Autorizado');
        return res.status(401).json({ error: error.message });
    }
    const [, token] = bearer.split(' ');
    try {
        //Con el método verify, verificamos el token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'object' && decoded.id) {
            //Con la variable de usuario, buscamos al usuario por su id
            //Con el select seleccionamos sólo los datos del usuario que queremos
            const user = await User_1.default.findById(decoded.id).select('_id name email');
            //Si el usuario existe
            if (user) {
                //Escribimos en el req el usuario
                req.user = user;
                //Pasamos al siguiente middleware
                next();
            }
            else {
                //Si no existe, enviamos el error
                res.status(500).json({ error: 'Token inválido' });
            }
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Token inválido' });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map