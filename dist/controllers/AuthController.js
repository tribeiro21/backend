"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
//Importamos la función de hashPassword que esta creada en auth.ts
const auth_1 = require("../utils/auth");
const User_1 = __importDefault(require("../models/User"));
const Token_1 = __importDefault(require("../models/Token"));
const token_1 = require("../utils/token");
const AuthEmail_1 = require("../emails/AuthEmail");
const jwt_1 = require("../utils/jwt");
class AuthController {
    //Definimos el primer método para que el usuario cree una cuenta
    static createAccount = async (req, res) => {
        try {
            const { password, email } = req.body;
            //Para prevenir usuarios duplicados con el mismo email
            const userExists = await User_1.default.findOne({ email });
            if (userExists) {
                const error = new Error('El usuario ya esta registrado');
                return res.status(409).json({ error: error.message });
            }
            //Creamos el nuevo usuario
            const user = new User_1.default(req.body);
            //Hasheamos la contraseña antes de guardar el usuario
            user.password = await (0, auth_1.hashPassword)(password);
            //Generamos el token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            //Enviamos el email (el código lo tenemos en el archivo AuthEmail.ts)
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                //Definimos los datos que queremos enviar del usuario
                email: user.email,
                name: user.name,
                token: token.token
            });
            //Con el Promise, guardamos el usuario y el token en la base de datos
            await Promise.allSettled([user.save(), token.save()]);
            //Enviamos el mensaje de usuario creado
            res.send('Cuenta creada, revisa el email para confirmarla');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    //Definimos el método para la validación del token
    static confirmAccount = async (req, res) => {
        try {
            //Extraemos el token
            const { token } = req.body;
            //Comprobamos que el token existe y lo buscamos
            const tokenExists = await Token_1.default.findOne({ token });
            //Si el token no existe
            if (!tokenExists) {
                //Enviamos el error
                const error = new Error('Token inválido');
                return res.status(404).json({ error: error.message });
            }
            //Pero si el token existe
            const user = await User_1.default.findById(tokenExists.user);
            //Cambiamos el estado del usuario a confirmado
            user.confirmed = true;
            //Con el Promise, guardamos el usuario confirmado y eliminamos el token ya utilizado
            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
            res.send('Cuenta confirmada exitosamente');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    //Definimos el método para el login
    static login = async (req, res) => {
        try {
            //Extraemos el email y el password
            const { email, password } = req.body;
            //Buscamos al usuario por el email
            const user = await User_1.default.findOne({ email });
            //Si el usuario no existe
            if (!user) {
                const error = new Error('Usuario no encontrado');
                return res.status(404).json({ error: error.message });
            }
            //Si el usuario no está confirmado
            if (!user.confirmed) {
                //Le enviamos un nuevo token al usuario si no se verifico en el primer momento de registro
                //Generamos el nuevo token con la función que creamos generateToken()
                const token = new Token_1.default();
                token.user = user.id;
                token.token = (0, token_1.generateToken)();
                //Lo guardamos
                await token.save();
                //Enviamos el email (el código lo tengo en el archivo AuthEmail.ts)
                AuthEmail_1.AuthEmail.sendConfirmationEmail({
                    //Definimos los datos que queremos enviar del usuario
                    email: user.email,
                    name: user.name,
                    token: token.token
                });
                const error = new Error('La cuenta no ha sido confirmada, revisa tu email para confirmarla');
                return res.status(401).json({ error: error.message });
            }
            //Validamos la contraseña del usuario
            //Utilizamos la función checkPassword que creé en auth.ts
            const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
            //Si la contraseña no es correcta
            if (!isPasswordCorrect) {
                const error = new Error('La contraseña es incorrecta');
                return res.status(401).json({ error: error.message });
            }
            //Si la contraseña es correcta, generamos el token utilizando la función que definimos en el archivo jwt.ts
            //Le pasamos solo el id, porque es lo único que necesitamos para saber si el usuario existe
            const token = (0, jwt_1.generateJWT)({ id: user._id });
            //Y enviamos el token
            res.send(token);
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    //Código para que el usuario pueda pedir de nuevo el token con el código y confirmar la cuenta
    static requestConfirmationCode = async (req, res) => {
        try {
            const { email } = req.body;
            //Verificamos que el usuario existe
            const user = await User_1.default.findOne({ email });
            //Si el usuario no existe
            if (!user) {
                const error = new Error('El usuario no esta registrado');
                return res.status(404).json({ error: error.message });
            }
            //Si el usuario está registrado, le enviamos por email el nuevo código
            //Si ya está registrado y además confirmado
            if (user.confirmed) {
                const error = new Error('El usuario ya esta confirmado');
                return res.status(403).json({ error: error.message });
            }
            //Generamos el nuevo token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            //Enviamos el email (el código lo tenemos en el archivo AuthEmail.ts)
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                //Definimos los datos que queremos enviar del usuario
                email: user.email,
                name: user.name,
                token: token.token
            });
            //Con el Promise, guardamos el usuario y el token en la base de datos
            await Promise.allSettled([user.save(), token.save()]);
            //Enviamos el mensaje de usuario creado
            res.send('Se ha enviado un nuevo código, revisa tu email');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    //Código para que el usuario pueda recuperar la contraseña
    static forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            //Verificamos que el usuario existe
            const user = await User_1.default.findOne({ email });
            //Si el usuario no existe
            if (!user) {
                const error = new Error('El usuario no esta registrado');
                return res.status(404).json({ error: error.message });
            }
            //Generamos el nuevo token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            await token.save();
            //Enviamos el email (el código lo tenemos en el archivo AuthEmail.ts)
            AuthEmail_1.AuthEmail.sendPasswordResetToken({
                //Definimos los datos que queremos enviar del usuario
                email: user.email,
                name: user.name,
                token: token.token
            });
            //Enviamos el mensaje de usuario creado
            res.send('Te hemos enviado un email con las instrucciones para recuperar la contraseña');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    //Definimos el método para la validación del token recibido al recuperar la contraseña
    static validateToken = async (req, res) => {
        try {
            //Extraemos el token
            const { token } = req.body;
            //Comprobamos que el token existe y lo buscamos
            const tokenExists = await Token_1.default.findOne({ token });
            //Si el token no existe
            if (!tokenExists) {
                //Enviamos el error
                const error = new Error('Token inválido');
                return res.status(404).json({ error: error.message });
            }
            res.send('Código válido, ya puedes crear tu nueva contraseña');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    //Definimos el método para actualizar la contraseña una vez validado el token
    static updatePasswordWithToken = async (req, res) => {
        try {
            //Extraemos el token
            const { token } = req.params;
            //Extraemos el password
            const { password } = req.body;
            //Comprobamos que el token existe y lo buscamos
            const tokenExists = await Token_1.default.findOne({ token });
            //Si el token no existe
            if (!tokenExists) {
                //Enviamos el error
                const error = new Error('Token inválido');
                return res.status(404).json({ error: error.message });
            }
            //Tenemos que validar que el token corresponde a un usuario que existe y que está pendiente de confirmar
            const user = await User_1.default.findById(tokenExists.user);
            //Hasheamos el nuevo password
            user.password = await (0, auth_1.hashPassword)(password);
            //Almacenamos la nueva contraseña en el usuario y eliminamos el token que se había generado
            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
            res.send('La contraseña se ha actualizado correctamente');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    //Definimos el método donde entramos a la sesión del usuario
    static user = async (req, res) => {
        return res.json(req.user);
    };
    //Definimos el método donde actualizamos el perfil
    static updateProfile = async (req, res) => {
        //Extraemos el nombre y el email
        const { name, email } = req.body;
        //Buscamos que el email que quieres colocar no exista en el sistema con otro usuario
        //Después del && le decimos que si el email que existe es el del mismo usuario, le permita cambiar el nombre
        const userExists = await User_1.default.findOne({ email });
        if (userExists && userExists.id.toString() !== req.user.id.toString()) {
            const error = new Error('Este email ya está registrado en otro usuario');
            return res.status(409).json({ error: error.message });
        }
        req.user.name = name;
        req.user.email = email;
        try {
            //Guardamos los cambios
            await req.user.save();
            res.send('Has actualizado tu perfil correctamente');
        }
        catch (error) {
            res.status(500).send('Hubo un error');
        }
    };
    //Definimos el método donde actualizamos la contraseña
    static updateCurrentUserPassword = async (req, res) => {
        //Tomamos la contraseña actual
        const { current_password, password } = req.body;
        //Buscamos la contraseña en el usuario
        const user = await User_1.default.findById(req.user.id);
        //Revisamos que la contraseña coincida con la actual
        const isPasswordCorrect = await (0, auth_1.checkPassword)(current_password, user.password);
        //Si la contraseña no es correcta
        if (!isPasswordCorrect) {
            const error = new Error('La contraseña actual no es correcta');
            return res.status(401).json({ error: error.message });
        }
        //Si la contraseña actual es correcta
        try {
            user.password = await (0, auth_1.hashPassword)(password);
            //Guardamos la nueva contraseña
            await user.save();
            res.send('La contraseña se ha actualizado correctamente');
        }
        catch (error) {
            res.status(500).send('Hubo un error');
        }
    };
    //Definimos el método donde revisamos la contraseña para poder eliminar cosas
    static checkPassword = async (req, res) => {
        //Tomamos la contraseña actual
        const { password } = req.body;
        //Buscamos la contraseña en el usuario
        const user = await User_1.default.findById(req.user.id);
        //Revisamos que la contraseña coincida con la actual
        const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
        //Si la contraseña no es correcta
        if (!isPasswordCorrect) {
            const error = new Error('La contraseña no es correcta');
            return res.status(401).json({ error: error.message });
        }
        res.send('Contraseña Correcta');
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map