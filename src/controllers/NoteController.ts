import type {Request, Response} from 'express'
import Note, { INote } from '../models/Note'
import { Types } from 'mongoose'

//Definimos el type del id de la nota que vamos a eliminar
type NoteParams = {
    noteId: Types.ObjectId
}

//Controlador para las notas
export class NoteController {
    //Función para crear la nota
    //Después del Request entre <> lo que hacemos es definir el tipo de dato del content de las notas, en este caso un string
    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        const {content} = req.body
        
        //Creamos la nueva nota
        const note = new Note()
        //Con el contenido
        note.content = content
        //Con el usuario que la creó
        note.createdBy = req.user.id
        //La asiganamos a la tarea correspondiente
        note.task = req.task.id

        //Agregamos la nota a la tarea
        req.task.notes.push(note.id)
        //Y la guardamos
        try{
            await Promise.allSettled([req.task.save(), note.save()])
            res.send('Nota creada')
        }catch (error){
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    //Función para obtener las notas
    static getTaskNotes = async (req: Request, res: Response) => {
        try{
            const notes = await Note.find({task: req.task.id})
            res.json(notes)
        }catch (error){
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    //Función para eliminar una nota
    static deleteNote = async (req: Request<NoteParams>, res: Response) => {
        const {noteId} = req.params
        const note = await Note.findById(noteId)

        //Si la nota no existe, muestra un error
        if(!note) {
            const error = new Error('Nota no encontrada')
            return res.status(404).json({error: error.message})
        }

        //Sólo la persona que creó la nota la puede eliminar
        //Si no es la persona que la creó
        if(note.createdBy.toString() !== req.user.id.toString()){
            const error = new Error('Acción inválida')
            return res.status(401).json({error: error.message})
        }

        //Eliminar las notas de las tareas en la base de datos
        req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString())

        //Pero si sí es la persona
        try{
            await Promise.allSettled([req.task.save(), note.deleteOne()])
            res.send('Nota eliminada')
        }catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}