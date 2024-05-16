import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'

//Como vamos a reescribir sobre el req con la variable user
//Utilizamos el interface para que en vez de reescribir, solo almacene
declare global{
    namespace Express{
        interface Request{
            user?: IUser
        }
    }
}

//En este middleware nos vamos a asegurar de que para poder hacer cualquier cosa (crear proyectos o tareas) primero validamos que el usuario esté autenticado
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    //Creamos una variable "bearer" que va a ser la encargada de verificar la autorización del usuario
    const bearer = req.headers.authorization
    //Si no existe dicha variable, es decir, no está validado el usuario, dame el error
    if(!bearer) {
        const error = new Error('No Autorizado')
        return res.status(401).json({error: error.message})
    }

    const [, token] = bearer.split(' ')

    try{
        //Con el método verify, verificamos el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        if(typeof decoded === 'object' && decoded.id) {
            //Con la variable de usuario, buscamos al usuario por su id
            //Con el select seleccionamos sólo los datos del usuario que queremos
            const user = await User.findById(decoded.id).select('_id name email')
            //Si el usuario existe
            if(user) {
                //Escribimos en el req el usuario
                req.user = user
                //Pasamos al siguiente middleware
                next()
            }else{
                //Si no existe, enviamos el error
                res.status(500).json({error: 'Token inválido'})
            }
        }
        
    }catch (error){
        res.status(500).json({error: 'Token inválido'})
    }
}