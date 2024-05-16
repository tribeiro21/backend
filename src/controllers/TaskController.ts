import type {Request, Response} from 'express'

import Task from '../models/Task'

export class TaskController {
    static createTask = async (req: Request, res: Response) => {
        
        try{
            //Creamos la tarea
            const task = new Task(req.body)
            //Después de crearla, asignala a un proyecto
            task.project = req.project.id
            //La guardamos en la base de datos
            //Ahora, para que aparezcan las tareas asignadas en los proyectos
            req.project.tasks.push(task.id)
            //Con el uso del promise, podemos guardar al mismo tiempo la tarea y el proyecto
            //Se ejecuta, si todos los promises se ejecutan, en este caso, tarea y proyecto
            await Promise.allSettled([task.save(), req.project.save()])
            res.send('Tarea creada correctamente')
            console.log(task)
        }catch (error) {
            res.status(500).json({error: 'Huno un error'})
        }
    }

    //Para obtener las tareas de un proyecto en específico
    static getProjectTasks = async (req: Request, res: Response) => {
        try{
            //El Task.find funciona como el where en MySQL, es decir, where el proyecto tiene el id tal
            //Le agregamos el .populate y con esto hacemos peticiones cruzadas, como el join en MySQL, para traernos toda la información del proyecto, no sólo el id
            //Dentro del .populate hay que pooner el dato del Schema dentro de Tasks que hace referencia al proyecto, en este caso project
            const tasks = await Task.find({project: req.project.id}).populate('project')
            res.json(tasks)
        }catch (error){
            res.status(500).json({error: 'Huno un error'})
        }
    }

    //Para ver cada tarea por separado en pantalla (la traemos por su id)
    static getTaskById = async (req: Request, res: Response) => {
        try{
            //Confirmamos que la tarea existe
            //Con el populate devolvemos quién fue el usuario que le cambió el estado a la tarea
            //Y con el select seleccionamos cuales campos del usuario quremos ver
            const task = await Task.findById(req.task.id)
                            .populate({path: 'completedBy.user', select: 'id name email'})
                            //Nos traemos la información de las notas
                            .populate({path: 'notes', populate: {path: 'createdBy', select: 'id name email'}})
            //Si existe, devuelve la tarea
            res.json(task)
        }catch (error){
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    //Para actualizar una tarea
    static updateTask = async (req: Request, res: Response) => {
        try{
            //Le colocamos el req. antes del task para que busque los middlewares de validación
            //Le decimos cuales son los datos de la tarea que se van a actualizar y guardar
            //El nombre
            req.task.name = req.body.name
            req.task.description = req.body.description
            //Y guardamos los cambios
            await req.task.save()
            //Pero si existe, devuelve la tarea
            res.send('Tarea actualizada correctamente')
        }catch (error){
            res.status(500).json({error: 'Huno un error'})
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try{
            //Primero nos traemos todas las tareas que sean diferentes a la que queremos eliminar
            //Le colocamos el toString porque dentro del proyecto, la tarea tiene un objectId y no lo toma como string, y el id de la tarea en sí es un string, esto porque utilizamos el operador estricto ==
            req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id.toString())
            //Para eliminar la tarea completa en la tabla de tareas dentro de la base de datos
            //Dentro del Promise, agregamos los dos await, el de eliminar y el de guardar en la baae de datos
            await Promise.allSettled([req.task.deleteOne(), req.project.save()])


            //Pero si existe, devuelve la tarea
            res.send('Tarea eliminada correctamente')
        }catch (error){
            res.status(500).json({error: 'Huno un error'})
        }
    }

    //Para actualizar el status
    static updateStatus = async (req: Request, res: Response) => {
        try{
            //Y también lees el status dentro del body del json
            const { status } = req.body
            //Definimos el nuevo estado dentro de status
            req.task.status = status
            //Almacenamos en un array todos los cambios que se han hecho en una tarea
            const data = {
                user: req.user.id,
                status
            }
            req.task.completedBy.push(data)
            //Lo guardamos
            await req.task.save()
            //Enviamos el mensaje de éxito
            res.send('Tarea actualizada')

        }catch (error){
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}