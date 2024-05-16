"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
//Importamos el modelo de proyecto
const Project_1 = __importDefault(require("../models/Project"));
class ProjectController {
    static createProject = async (req, res) => {
        //Creamos la instancia para el nuevo proyecto a crear
        const project = new Project_1.default(req.body);
        //Se le asigna una tutora que crea el proyecto
        project.tutora = req.user.id;
        try {
            //Guardamos el proyecto en la base de datos
            await project.save();
            res.send('Proyecto creado');
        }
        catch (error) {
            console.log(error);
        }
    };
    static getAllProjects = async (req, res) => {
        try {
            //Creamos la variable de projects y con el .find buscamos todos los proyectos 
            const projects = await Project_1.default.find({
                //Nos traemos sólo los proyectos del usuario que los creó
                $or: [
                    //utilizamos el operador $in para decirle que traiga los proyectos del usuario (por su id) que está realizando el request
                    { tutora: { $in: req.user.id } },
                    //Mostramos el proyecto en el panel de los alumnos, a los que pertenecen
                    { team: { $in: req.user.id } }
                ]
            });
            res.json(projects);
        }
        catch (error) {
            console.log(error);
        }
    };
    //Obtenemos un proyecto específico por su id
    static getProjectById = async (req, res) => {
        const { id } = req.params;
        try {
            //Agregamos el .populate para traernos toda la información de las tareas, no sólo el ID
            //.populate funciona como referencia cruzada
            const project = await Project_1.default.findById(id).populate('tasks');
            //Si el proyecto no existe
            if (!project) {
                const error = new Error('Proyecto no encontrado');
                return res.status(404).json({ error: error.message });
            }
            //Si el usuario no esta autorizado para ver los datos del proyecto
            if (project.tutora.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error('No autorizado');
                return res.status(404).json({ error: error.message });
            }
            res.json(project);
        }
        catch (error) {
            console.log(error);
        }
    };
    //Para actualizar el proyecto
    static updateProject = async (req, res) => {
        try {
            //Le decimos cuáles son los datos del json que vamos a actualizar
            //Primero el nombre
            req.project.projectName = req.body.projectName;
            //Después el aula
            req.project.aulaName = req.body.aulaName;
            //Por último la descripción
            req.project.description = req.body.description;
            //Y lo guardamos
            await req.project.save();
            res.send('Proyecto actualizado');
        }
        catch (error) {
            console.log(error);
        }
    };
    //Para eliminar un proyecto
    static deleteProject = async (req, res) => {
        try {
            //Y lo eliminamos utilizando el "deleteOne"
            await req.project.deleteOne();
            res.send('Proyecto Eliminado');
        }
        catch (error) {
            console.log(error);
        }
    };
}
exports.ProjectController = ProjectController;
//# sourceMappingURL=ProjectController.js.map