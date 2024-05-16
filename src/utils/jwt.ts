//En este archivo utilizamos la dependencia de JWT que nos ayudará a la autenticación de usuario
//Importamos la dependencia
import jwt from 'jsonwebtoken'
//Importamos la librería Types para poder definir los tipos de datos de la base de datos en mongoose
import { Types } from 'mongoose'

//Tenemos que definir qué tipo de dato es el id que viene de la base de datos
type UserPayload = {
    id: Types.ObjectId
}

//Definimos la función para generar el json web token
//Tenemos que pasarle el tipo de dato que definimos arriba
 export const generateJWT = (payload: UserPayload) => {
        //Creamos la función del token que se va a generar
        //Antes creamos una variable de entorno llamada JWT_SECRET que contiene una palabra secreta que utilizará el token
        //Utilizamos el método sign de la dependencia JWB que permite crear el token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            //Le damos un tiempo de expiración de 6 meses, luego de este tiempo se tendrá que autenticar de nuevo el usuario
            expiresIn: '180d'
        })
        return token
 }