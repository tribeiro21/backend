//En este middleware vamos a definir que para poder crear una tarea, revise si el proyecto está creado y además, si el usuario tiene la validación para agregar tareas
import type {Request, Response, NextFunction} from 'express'
import Task, {ITask} from '../models/Task'

//Con esta declaración de typescript, reescribimos el request
declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}
//Para validar si el proyecto existe
export async function taskExists(req: Request, res: Response, next: NextFunction) {
    try{
        const {taskId} = req.params
        //Tenemos que consultar primero si el proyecto existe
        const task = await Task.findById(taskId)
        //Muestra error si el proyecto no existe
        if(!task) {
            const error = new Error('Tarea no encontrada')
            return res.status(404).json({error: error.message})
        }
        req.task = task
        //Pero si existe, llévame al siguiente middleware
        next()
    }catch (error){
        res.status(500).json({error: 'Hubo un error'})
    }
}

//Vamos a crear un middleware para validar que una tarea pertenece a un proyecto
export function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {
    //Antes, validamos que la tarea es de ese proyecto
    //Si la tarea no pertenece al proyecto, dame el siguiente error:
    //Debemos agregar el toString para que busque correctamente los id como un string, sino, aunque la tarea pertenezca al proyecto, nos dará error, porque lo reconocerá como un objeto
    if(req.task.project.toString() !== req.project.id.toString()){
        const error = new Error('Acción Inválida')
        return res.status(400).json({error: error.message})
    }
    //Si la tarea pertenece al proyecto, ve al siguiente middleware
    next()
}

//Vamos a crear un middleware para validar cuando el usuario es un alumno y no permitirle editar proyectos y tareas
export function hasAuthorization(req: Request, res: Response, next: NextFunction) {
    if(req.user.id.toString() !== req.project.tutora.toString()){
        const error = new Error('Acción Inválida')
        return res.status(400).json({error: error.message})
    }
    next()
}