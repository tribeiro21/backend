//En este middleware vamos a definir que para poder crear una tarea, revise si el proyecto está creado y además, si el usuario tiene la validación para agregar tareas
import type {Request, Response, NextFunction} from 'express'
import Project, {IProject} from '../models/Project'

//Con esta declaración de typescript, reescribimos el request
declare global {
    namespace Express {
        interface Request {
            project: IProject
        }
    }
}
//Para validar si el proyecto existe
export async function projectExists(req: Request, res: Response, next: NextFunction) {
    try{
        const {projectId} = req.params
        //Tenemos que consultar primero si el proyecto existe
        const project = await Project.findById(projectId)
        //Muestra error si el proyecto no existe
        if(!project) {
            const error = new Error('Proyecto no encontrado')
            return res.status(404).json({error: error.message})
        }
        req.project = project
        //Pero si existe, llévame al siguiente middleware
        next()
    }catch (error){
        res.status(500).json({error: 'Hubo un error'})
    }
}