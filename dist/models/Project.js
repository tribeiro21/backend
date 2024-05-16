"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Importando el PopulateDoc accedemos a poder traernos la ref de la tarea
const mongoose_1 = __importStar(require("mongoose"));
const Task_1 = __importDefault(require("./Task"));
const Note_1 = __importDefault(require("./Note"));
//Aquí definimos el tipo de dato en mongoose
const ProjectSchema = new mongoose_1.Schema({
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
            type: mongoose_1.Types.ObjectId,
            ref: 'Task'
        }
    ],
    tutora: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'User'
        }
    ],
    //Nos permite que cada vez que se haga un registro y se actualice, nos muestre cuándo se hizo o se actualizó 
}, { timestamps: true });
//Para que se elimine la tarea cuando eliminamos el proyecto, y no quede la tarea en la base de datos
//Utilizamos un middleware de Mongoose llamado "pre" 
ProjectSchema.pre('deleteOne', { document: true }, async function () {
    //Tomamos el id del proyecto
    const projectId = this._id;
    //Si es el id del proyecto que se elimina
    if (!projectId)
        return;
    //Para eliminar las notas que pertenecen a las tareas dentro del proyecto que se elimina
    const tasks = await Task_1.default.find({ project: projectId });
    for (const task of tasks) {
        await Note_1.default.deleteMany({ task: task.id });
    }
    //Elimina el proyecto
    await Task_1.default.deleteMany({ project: projectId });
});
//Definimos el modelo y lo registramos en la instancia de mongoose
//Al colocar <IProject> le estamos diciendo que las características definidas en el typescript las agregue en los modelos de mongoose
const Project = mongoose_1.default.model('Project', ProjectSchema);
exports.default = Project;
//# sourceMappingURL=Project.js.map