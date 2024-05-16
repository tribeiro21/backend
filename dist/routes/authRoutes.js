"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const AuthController_1 = require("../controllers/AuthController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
//En este archivo, vamos a definir las rutas del usuario (registro, login, etc)
const router = (0, express_1.Router)();
router.post('/create-account', 
//Tenemos que definir cuáles son los datos que se le pedirán al usuario para crear la cuenta
(0, express_validator_1.body)('name')
    //Utilizamos el .notEmpty para especificar que no puede estar vacío
    .notEmpty().withMessage('El nombre es obligatorio'), (0, express_validator_1.body)('password')
    //Con el .isLength definimos una longitud minima para el password
    .isLength({ min: 8 }).withMessage('La contraseña debe contener al menos 8 caracteres'), 
//Agregamos otro campo para validar las contraseña introducida
(0, express_validator_1.body)('password_confirmation').custom((value, { req }) => {
    //Si las contraseñas introducidas no coinciden
    if (value !== req.body.password) {
        throw new Error('Las contraseñas no son iguales');
    }
    //Si coinciden, pasa al siguiente campo a validar
    return true;
}), (0, express_validator_1.body)('email')
    //Con el .isEmail garantizamos que sea un email con formato válido
    .isEmail().withMessage('El email es inválido'), 
//Le pasamos el middleware de los errores
validation_1.handleInputErrors, AuthController_1.AuthController.createAccount);
//Creamos la ruta para la confirmación de la cuenta por parte del usuario
router.post('/confirm-account', (0, express_validator_1.body)('token').notEmpty().withMessage('El token no puede estar vacío'), validation_1.handleInputErrors, AuthController_1.AuthController.confirmAccount);
//Creamos la ruta para el login del usuario
router.post('/login', (0, express_validator_1.body)('email')
    //Con el .isEmail garantizamos que sea un email con formato válido
    .isEmail().withMessage('El email es inválido'), (0, express_validator_1.body)('password')
    //Le decimos que el campo de contraseña no puede estar vacío
    .notEmpty().withMessage('La contraseña no puede estar vacía'), validation_1.handleInputErrors, AuthController_1.AuthController.login);
//Creamos la ruta para el nuevo token solicitado por el usuario
router.post('/request-code', (0, express_validator_1.body)('email')
    //Con el .isEmail garantizamos que sea un email con formato válido
    .isEmail().withMessage('El email es inválido'), validation_1.handleInputErrors, AuthController_1.AuthController.requestConfirmationCode);
//Creamos la ruta para recuperar la contraseña
router.post('/forgot-password', (0, express_validator_1.body)('email')
    //Con el .isEmail garantizamos que sea un email con formato válido
    .isEmail().withMessage('El email es inválido'), validation_1.handleInputErrors, AuthController_1.AuthController.forgotPassword);
//Validamos el token de recuperar la contraseña
router.post('/validate-token', (0, express_validator_1.body)('token').notEmpty().withMessage('El token no puede estar vacío'), validation_1.handleInputErrors, AuthController_1.AuthController.validateToken);
//Validamos la nueva contraseña con el uso del token enviado, por eso en la ruta utilizamnos el token dinámico con :token
router.post('/update-password/:token', 
//Le pasamos como parámetro el token
(0, express_validator_1.param)('token')
    //Tiene que ser numérico
    .isNumeric().withMessage('Token inválido'), (0, express_validator_1.body)('password')
    //Con el .isLength definimos una longitud minima para el password
    .isLength({ min: 8 }).withMessage('La contraseña debe contener al menos 8 caracteres'), 
//Agregamos otro campo para validar las contraseña introducida
(0, express_validator_1.body)('password_confirmation').custom((value, { req }) => {
    //Si las contraseñas introducidas no coinciden
    if (value !== req.body.password) {
        throw new Error('Las contraseñas no son iguales');
    }
    //Si coinciden, pasa al siguiente campo a validar
    return true;
}), validation_1.handleInputErrors, AuthController_1.AuthController.updatePasswordWithToken);
//Creamos la ruta el usuario autenticado
router.get('/user', auth_1.authenticate, AuthController_1.AuthController.user);
/** RUTAS PARA EL PERFIL */
router.put('/profile', 
//Primero validamos la autenticación del usuario
auth_1.authenticate, 
//Va a actualizar el nombre
(0, express_validator_1.body)('name')
    //Utilizamos el .notEmpty para especificar que no puede estar vacío
    .notEmpty().withMessage('El nombre es obligatorio'), 
//Va a actualizar el email
(0, express_validator_1.body)('email')
    //Con el .isEmail garantizamos que sea un email con formato válido
    .isEmail().withMessage('El email es inválido'), 
//Le pasamos el middleware de los errores
validation_1.handleInputErrors, AuthController_1.AuthController.updateProfile);
//Ruta para poder cambiar la contraseña
router.post('/update-password', auth_1.authenticate, 
//Enviamos la contraseña actual
(0, express_validator_1.body)('current_password')
    .notEmpty().withMessage('La contraseña actual no puede estar vacía'), 
//Enviamos la nueva contraseña
(0, express_validator_1.body)('password')
    //Con el .isLength definimos una longitud minima para el password
    .isLength({ min: 8 }).withMessage('La contraseña debe contener al menos 8 caracteres'), 
//Agregamos otro campo para validar las contraseña introducida
(0, express_validator_1.body)('password_confirmation').custom((value, { req }) => {
    //Si las contraseñas introducidas no coinciden
    if (value !== req.body.password) {
        throw new Error('Las contraseñas no son iguales');
    }
    //Si coinciden, pasa al siguiente campo a validar
    return true;
}), validation_1.handleInputErrors, AuthController_1.AuthController.updateCurrentUserPassword);
//Verificar la contraseña para poder eliminar un proyecto
router.post('/check-password', auth_1.authenticate, (0, express_validator_1.body)('password')
    .notEmpty().withMessage('La contraseña es obligatoria'), validation_1.handleInputErrors, AuthController_1.AuthController.checkPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map