//Importando el PopulateDoc accedemos a poder traernos la ref de la tarea
import mongoose, {Schema, Document, PopulatedDoc, Types} from 'mongoose'
import Task, { ITask } from './Task'
import { IUser } from './User'
import Note from './Note'

//Este código es la estructura typescript de nuestro modelo
export interface IProject extends Document {
    projectName: string
    aulaName: string
    description: string
    //Las tareas que se crean en cada proyecto
    //Le colocamos el arreglo vacío [] porque un proyecto puede tener varias tareas 
    tasks: PopulatedDoc<ITask & Document>[]
    tutora: PopulatedDoc<IUser & Document>
    //Estos son los miembros del equipo de alumnos que participaran en el proyecto
    team: PopulatedDoc<IUser & Document>[]
}

//Aquí definimos el tipo de dato en mongoose
const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        //Con el trim le quitamos los espacios antes o después de lo que se introduzca en el campo en la interfaz
        trim: true
    },
    aulaName: {
        type: String,
        required: true,
        //Con el trim le quitamos los espacios antes o después de lo que se introduzca en el campo en la interfaz
        trim: true
    },
    description: {
        type: String,
        required: true,
        //Con el trim le quitamos los espacios antes o después de lo que se introduzca en el campo en la interfaz
        trim: true
    },
    //Las tareas, primero abrimos [] y luego las {} porque pueden ser varias tareas para un único proyecto
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    tutora: {
        type: Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
//Nos permite que cada vez que se haga un registro y se actualice, nos muestre cuándo se hizo o se actualizó 
}, {timestamps: true})

//Para que se elimine la tarea cuando eliminamos el proyecto, y no quede la tarea en la base de datos
//Utilizamos un middleware de Mongoose llamado "pre" 
ProjectSchema.pre('deleteOne', {document: true}, async function(){
    //Tomamos el id del proyecto
    const projectId = this._id
    //Si es el id del proyecto que se elimina
    if(!projectId) return

    //Para eliminar las notas que pertenecen a las tareas dentro del proyecto que se elimina
    const tasks = await Task.find({project: projectId})
    for(const task of tasks) {
        await Note.deleteMany({task: task.id})
    }

    //Elimina el proyecto
    await Task.deleteMany({project: projectId})

})


//Definimos el modelo y lo registramos en la instancia de mongoose
//Al colocar <IProject> le estamos diciendo que las características definidas en el typescript las agregue en los modelos de mongoose
const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project