import type {Request, Response, NextFunction} from 'express'
import { validationResult } from 'express-validator'

//Esta funciòn se va a encargar de detener la ejecución en caso de existir algún error en la validación de campos
//Esta función es reutilizable en nuestro código
export const handleInputErrors = (req : Request, res : Response, next : NextFunction) => {
    let errors = validationResult(req)
    //Si el error no existe
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    //Entonces pasa al siguiente middleware
    next()
}