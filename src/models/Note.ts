import mongoose, {Schema, Document, Types} from 'mongoose'

//Creamos el modelo para las notas que se pueden agregar a las tareas
//Lo llamamos INote simplemente porque no podemos repetir el nombre del modelo, por eso le colocamos la I
export interface INote extends Document {
    content: string
    createdBy: Types.ObjectId
    task: Types.ObjectId
}

const NoteSchema: Schema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: Types.ObjectId,
        ref: 'Task',
        required: true
    }
}, {timestamps: true})

const Note = mongoose.model<INote>('Note', NoteSchema)
export default Note