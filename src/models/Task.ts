//Importando Types, podemos utilziar la librería de types, como el ObjectId
import mongoose, {Schema, Document, Types} from 'mongoose'
import Note from './Note'

//Aquí definimos los estados de las tareas
const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
  //Le colocamos el as const porque son valores de sólo lectura, no para editar  
} as const

export type taskStatus = typeof taskStatus[keyof typeof taskStatus]

//Este código es la estructura typescript de nuestro modelo
export interface ITask extends Document {
    name: string
    description: string
    //Tenemos que asociar las tareas a cada proyecto
    //Es de tipo ObjectId porque así guarda el Id en mongoDB
    project: Types.ObjectId
    //Le agregamos el status
    status: taskStatus
    //El usuario que completó la tarea:
    completedBy: {
        user: Types.ObjectId,
        status: taskStatus
    }[]
    //Le agregamos al modelo las notas que se vayan creando
    notes: Types.ObjectId[]
}

//Ahora definimos el esquema
export const TaskSchema : Schema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    project: {
        type: Types.ObjectId,
        //Tenemos que pasar la referencia de cual modelo tiene que buscar para asociar
        ref: 'Project'
    },
    status:{
        type: String,
        //Con este le decimos los valores que puede tener, que los definimos arriba en el bloque de ts
        enum: Object.values(taskStatus),
        //Le decimos que el valor incial va a ser "pendiente"
        default: taskStatus.PENDING
    },
    //Agregamos un campo para saber quién completó la tarea
    //Tiene que ser un array porque vamos a guardar el historial de los usurios que vayan cambiando el status
    completedBy:[
        {
            user: {
                type: Types.ObjectId,
                ref: 'User',
                default: null
            },
            status: {
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING
            }
        }
    ],
    notes: [
        {
            type: Types.ObjectId,
            ref: 'Note'
        }
    ]
//Nos permite que cada vez que se haga un registro y se actualice, nos muestre cuándo se hizo o se actualizó 
}, {timestamps: true})

//Para que se elimine la nota de la tarea cuando eliminamos la tarea, y no quede la nota en la base de datos
//Utilizamos un middleware de Mongoose llamado "pre" 
TaskSchema.pre('deleteOne', {document:true}, async function(){
    //Tomamos el id de la tarea
    const taskId = this._id
    //Si es el id de la tarea que se elimina
    if(!taskId) return
    //Elimina la tarea
    await Note.deleteMany({task: taskId})

})

//Conectamos el Schema con la Interface
const Task = mongoose.model<ITask>('Task', TaskSchema)
//Lo exportamos para el resto de controladores
export default Task