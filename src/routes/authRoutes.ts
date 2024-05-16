import {Router} from 'express'
import {body, param} from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'
import { authenticate } from '../middleware/auth'

//En este archivo, vamos a definir las rutas del usuario (registro, login, etc)
const router = Router()

router.post('/create-account',
    //Tenemos que definir cuáles son los datos que se le pedirán al usuario para crear la cuenta
    body('name')
        //Utilizamos el .notEmpty para especificar que no puede estar vacío
        .notEmpty().withMessage('El nombre es obligatorio'),
    body('password')
        //Con el .isLength definimos una longitud minima para el password
        .isLength({min:8}).withMessage('La contraseña debe contener al menos 8 caracteres'),
    //Agregamos otro campo para validar las contraseña introducida
    body('password_confirmation').custom((value, {req}) => {
        //Si las contraseñas introducidas no coinciden
        if(value !== req.body.password) {
            throw new Error('Las contraseñas no son iguales')
        }
        //Si coinciden, pasa al siguiente campo a validar
        return true
    }),
    body('email')
        //Con el .isEmail garantizamos que sea un email con formato válido
        .isEmail().withMessage('El email es inválido'),
    //Le pasamos el middleware de los errores
    handleInputErrors,
    AuthController.createAccount
)

//Creamos la ruta para la confirmación de la cuenta por parte del usuario
router.post('/confirm-account',
    body('token').notEmpty().withMessage('El token no puede estar vacío'),
    handleInputErrors,
    AuthController.confirmAccount
)

//Creamos la ruta para el login del usuario
router.post('/login',
    body('email')
        //Con el .isEmail garantizamos que sea un email con formato válido
        .isEmail().withMessage('El email es inválido'),
    body('password')
        //Le decimos que el campo de contraseña no puede estar vacío
        .notEmpty().withMessage('La contraseña no puede estar vacía'),
    handleInputErrors,
    AuthController.login
)

//Creamos la ruta para el nuevo token solicitado por el usuario
router.post('/request-code',
    body('email')
        //Con el .isEmail garantizamos que sea un email con formato válido
        .isEmail().withMessage('El email es inválido'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

//Creamos la ruta para recuperar la contraseña
router.post('/forgot-password',
    body('email')
        //Con el .isEmail garantizamos que sea un email con formato válido
        .isEmail().withMessage('El email es inválido'),
    handleInputErrors,
    AuthController.forgotPassword
)

//Validamos el token de recuperar la contraseña
router.post('/validate-token',
    body('token').notEmpty().withMessage('El token no puede estar vacío'),
    handleInputErrors,
    AuthController.validateToken
)

//Validamos la nueva contraseña con el uso del token enviado, por eso en la ruta utilizamnos el token dinámico con :token
router.post('/update-password/:token',
    //Le pasamos como parámetro el token
    param('token')
        //Tiene que ser numérico
        .isNumeric().withMessage('Token inválido'),
    body('password')
        //Con el .isLength definimos una longitud minima para el password
        .isLength({min:8}).withMessage('La contraseña debe contener al menos 8 caracteres'),
    //Agregamos otro campo para validar las contraseña introducida
    body('password_confirmation').custom((value, {req}) => {
    //Si las contraseñas introducidas no coinciden
        if(value !== req.body.password) {
            throw new Error('Las contraseñas no son iguales')
        }
        //Si coinciden, pasa al siguiente campo a validar
        return true
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)

//Creamos la ruta el usuario autenticado
router.get('/user',
    authenticate,
    AuthController.user
)

/** RUTAS PARA EL PERFIL */
router.put('/profile',
//Primero validamos la autenticación del usuario
authenticate,
    //Va a actualizar el nombre
    body('name')
        //Utilizamos el .notEmpty para especificar que no puede estar vacío
        .notEmpty().withMessage('El nombre es obligatorio'),
    //Va a actualizar el email
    body('email')
        //Con el .isEmail garantizamos que sea un email con formato válido
        .isEmail().withMessage('El email es inválido'),
    //Le pasamos el middleware de los errores
    handleInputErrors,
    AuthController.updateProfile
)

//Ruta para poder cambiar la contraseña
router.post('/update-password',
    authenticate,
    //Enviamos la contraseña actual
    body('current_password')
        .notEmpty().withMessage('La contraseña actual no puede estar vacía'),
    //Enviamos la nueva contraseña
    body('password')
        //Con el .isLength definimos una longitud minima para el password
        .isLength({min:8}).withMessage('La contraseña debe contener al menos 8 caracteres'),
    //Agregamos otro campo para validar las contraseña introducida
    body('password_confirmation').custom((value, {req}) => {
        //Si las contraseñas introducidas no coinciden
        if(value !== req.body.password) {
            throw new Error('Las contraseñas no son iguales')
        }
        //Si coinciden, pasa al siguiente campo a validar
        return true
    }),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
)

//Verificar la contraseña para poder eliminar un proyecto
router.post('/check-password',
    authenticate,
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    AuthController.checkPassword
)

export default router