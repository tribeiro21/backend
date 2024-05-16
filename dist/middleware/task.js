"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAuthorization = exports.taskBelongsToProject = exports.taskExists = void 0;
const Task_1 = __importDefault(require("../models/Task"));
//Para validar si el proyecto existe
async function taskExists(req, res, next) {
    try {
        const { taskId } = req.params;
        //Tenemos que consultar primero si el proyecto existe
        const task = await Task_1.default.findById(taskId);
        //Muestra error si el proyecto no existe
        if (!task) {
            const error = new Error('Tarea no encontrada');
            return res.status(404).json({ error: error.message });
        }
        req.task = task;
        //Pero si existe, llévame al siguiente middleware
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
}
exports.taskExists = taskExists;
//Vamos a crear un middleware para validar que una tarea pertenece a un proyecto
function taskBelongsToProject(req, res, next) {
    //Antes, validamos que la tarea es de ese proyecto
    //Si la tarea no pertenece al proyecto, dame el siguiente error:
    //Debemos agregar el toString para que busque correctamente los id como un string, sino, aunque la tarea pertenezca al proyecto, nos dará error, porque lo reconocerá como un objeto
    if (req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error('Acción Inválida');
        return res.status(400).json({ error: error.message });
    }
    //Si la tarea pertenece al proyecto, ve al siguiente middleware
    next();
}
exports.taskBelongsToProject = taskBelongsToProject;
//Vamos a crear un middleware para validar cuando el usuario es un alumno y no permitirle editar proyectos y tareas
function hasAuthorization(req, res, next) {
    if (req.user.id.toString() !== req.project.tutora.toString()) {
        const error = new Error('Acción Inválida');
        return res.status(400).json({ error: error.message });
    }
    next();
}
exports.hasAuthorization = hasAuthorization;
//# sourceMappingURL=task.js.map