"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectExists = void 0;
const Project_1 = __importDefault(require("../models/Project"));
//Para validar si el proyecto existe
async function projectExists(req, res, next) {
    try {
        const { projectId } = req.params;
        //Tenemos que consultar primero si el proyecto existe
        const project = await Project_1.default.findById(projectId);
        //Muestra error si el proyecto no existe
        if (!project) {
            const error = new Error('Proyecto no encontrado');
            return res.status(404).json({ error: error.message });
        }
        req.project = project;
        //Pero si existe, llévame al siguiente middleware
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Hubo un error' });
    }
}
exports.projectExists = projectExists;
//# sourceMappingURL=project.js.map