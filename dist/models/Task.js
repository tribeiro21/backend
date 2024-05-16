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
exports.TaskSchema = void 0;
//Importando Types, podemos utilziar la librería de types, como el ObjectId
const mongoose_1 = __importStar(require("mongoose"));
const Note_1 = __importDefault(require("./Note"));
//Aquí definimos los estados de las tareas
const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
    //Le colocamos el as const porque son valores de sólo lectura, no para editar  
};
//Ahora definimos el esquema
exports.TaskSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Types.ObjectId,
        //Tenemos que pasar la referencia de cual modelo tiene que buscar para asociar
        ref: 'Project'
    },
    status: {
        type: String,
        //Con este le decimos los valores que puede tener, que los definimos arriba en el bloque de ts
        enum: Object.values(taskStatus),
        //Le decimos que el valor incial va a ser "pendiente"
        default: taskStatus.PENDING
    },
    //Agregamos un campo para saber quién completó la tarea
    //Tiene que ser un array porque vamos a guardar el historial de los usurios que vayan cambiando el status
    completedBy: [
        {
            user: {
                type: mongoose_1.Types.ObjectId,
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
            type: mongoose_1.Types.ObjectId,
            ref: 'Note'
        }
    ]
    //Nos permite que cada vez que se haga un registro y se actualice, nos muestre cuándo se hizo o se actualizó 
}, { timestamps: true });
//Para que se elimine la nota de la tarea cuando eliminamos la tarea, y no quede la nota en la base de datos
//Utilizamos un middleware de Mongoose llamado "pre" 
exports.TaskSchema.pre('deleteOne', { document: true }, async function () {
    //Tomamos el id de la tarea
    const taskId = this._id;
    //Si es el id de la tarea que se elimina
    if (!taskId)
        return;
    //Elimina la tarea
    await Note_1.default.deleteMany({ task: taskId });
});
//Conectamos el Schema con la Interface
const Task = mongoose_1.default.model('Task', exports.TaskSchema);
//Lo exportamos para el resto de controladores
exports.default = Task;
//# sourceMappingURL=Task.js.map