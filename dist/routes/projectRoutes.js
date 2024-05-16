"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//Importamos el validator que nos permite validar campos
const express_validator_1 = require("express-validator");
const ProjectController_1 = require("../controllers/ProjectController");
const validation_1 = require("../middleware/validation");
const TaskController_1 = require("../controllers/TaskController");
const project_1 = require("../middleware/project");
const task_1 = require("../middleware/task");
const auth_1 = require("../middleware/auth");
const TeamController_1 = require("../controllers/TeamController");
const NoteController_1 = require("../controllers/NoteController");
const router = (0, express_1.Router)();
//Le pasamos el middleware de autenticación a todas las rutas
router.use(auth_1.authenticate);
//Definimos la ruta desde dónde vamos a crear proyectos
router.post('/', 
//Pasamos el middleware que sirve para verificar al usuario
(0, express_validator_1.body)('projectName')
    //Garantizamos que no debe estar vacío ese campo
    .notEmpty().withMessage('El nombre del proyecto es obligatorio'), (0, express_validator_1.body)('aulaName')
    //Garantizamos que no debe estar vacío ese campo
    .notEmpty().withMessage('El aula asignada al proyecto es obligatoria'), (0, express_validator_1.body)('description')
    //Garantizamos que no debe estar vacío ese campo
    .notEmpty().withMessage('La descripción del proyecto es obligatoria'), 
//Colocamos el middleware aquí para que en caso de no pasar la validación, se quede aquí y no cree el proyecto
validation_1.handleInputErrors, ProjectController_1.ProjectController.createProject);
//Definimos la ruta donde vamos a mostrar todos los proyectos creados por la tutora
router.get('/', ProjectController_1.ProjectController.getAllProjects);
//Esta ruta es para mostrar un proyecto en específico por su id
//Le agregamos a la ruta :id para que sea una ruta dinámica, ya que el id va cambiando
router.get('/:id', 
//Le decimos que busque el proyecto por el parámetro de mongo de "id"
(0, express_validator_1.param)('id').isMongoId().withMessage('Id inválido'), 
//De nuevo pasamos el middleware por si hay error, detenga la ejecución
validation_1.handleInputErrors, ProjectController_1.ProjectController.getProjectById);
//Para simplificar las rutas, utilizamos el router.param y le pasamos el projectId porque es lo que siempre vamos a validar y su middleware, que en este caso es validateProjectExists
router.param('projectId', project_1.projectExists);
//Esta ruta es para actualizar un proyecto
router.put('/:projectId', 
//Validamos el id del proyecto que vamos a actualizar
(0, express_validator_1.param)('projectId').isMongoId().withMessage('Id inválido'), 
//Y ahora tenemos que volver a validar los campos como cuando creamos un proyecto
(0, express_validator_1.body)('projectName')
    //Garantizamos que no debe estar vacío ese campo
    .notEmpty().withMessage('El nombre del proyecto es obligatorio'), (0, express_validator_1.body)('aulaName')
    //Garantizamos que no debe estar vacío ese campo
    .notEmpty().withMessage('El aula asignada al proyecto es obligatoria'), (0, express_validator_1.body)('description')
    //Garantizamos que no debe estar vacío ese campo
    .notEmpty().withMessage('La descripción del proyecto es obligatoria'), 
//De nuevo pasamos el middleware por si hay error, detenga la ejecución
validation_1.handleInputErrors, task_1.hasAuthorization, ProjectController_1.ProjectController.updateProject);
//Para eliminar un proyecto
router.delete('/:projectId', 
//Le decimos que busque el proyecto por el parámetro de mongo de "id"
(0, express_validator_1.param)('projectId').isMongoId().withMessage('Id inválido'), 
//De nuevo pasamos el middleware por si hay error, detenga la ejecución
validation_1.handleInputErrors, task_1.hasAuthorization, ProjectController_1.ProjectController.deleteProject);
//AQUÍ DEFINIMOS LAS RUTAS PARA LAS TAREAS
router.post('/:projectId/tasks', 
//Middleware para validar que si es un alumno no pueda CREAR tareas
task_1.hasAuthorization, 
//Validamos que estamos enviando todos los campos de la tarea, para que no se puedan enviar campos vacíos
(0, express_validator_1.body)('name')
    //Garantizamos que no debe estar vacío ese campo
    .notEmpty().withMessage('El nombre de la tarea es obligatorio'), (0, express_validator_1.body)('description')
    //Garantizamos que no debe estar vacío ese campo
    .notEmpty().withMessage('La descripción de la tarea es obligatoria'), 
//Colocamos el middleware aquí para que en caso de no pasar la validación, se quede aquí y no cree el proyecto
validation_1.handleInputErrors, TaskController_1.TaskController.createTask);
//Ruta para obtener las tareas de un proyecto determinado
router.get('/:projectId/tasks', 
//Llamamos al método de obtener tarea
TaskController_1.TaskController.getProjectTasks);
//Aquí va el middleware de la validación de si la tarea existe, para no escribir tanto código de validación y repetir tanto código
router.param('taskId', task_1.taskExists);
//Ahora el middleware de la validación de si la tarea pertenece a un proyecto, para no escribir tanto código de validación y repetir tanto código
router.param('taskId', task_1.taskBelongsToProject);
//Ruta para traernos una tarea por su id
router.get('/:projectId/tasks/:taskId', 
//Le decimos que busque la tarea por el parámetro de mongo de Id
(0, express_validator_1.param)('taskId').isMongoId().withMessage('Id inválido'), 
//De nuevo pasamos el middleware por si hay error, detenga la ejecución
validation_1.handleInputErrors, 
//Llamamos al método de obtener una tarea en específico por su id
TaskController_1.TaskController.getTaskById);
//Ruta para modificar las tareas
router.put('/:projectId/tasks/:taskId', 
//Middleware para validar que si es un alumno no pueda editar tareas
task_1.hasAuthorization, 
//Le decimos que busque la tarea por el parámetro de mongo de "id"
(0, express_validator_1.param)('taskId').isMongoId().withMessage('Id inválido'), (0, express_validator_1.body)('name')
    //Garantizamos que no debe estar vacío ese campo
    .notEmpty().withMessage('El nombre de la tarea es obligatorio'), (0, express_validator_1.body)('description')
    //Garantizamos que no debe estar vacío ese campo
    .notEmpty().withMessage('La descripción de la tarea es obligatoria'), 
//De nuevo pasamos el middleware por si hay error, detenga la ejecución
validation_1.handleInputErrors, 
//Llamamos al método de obtener una tarea en específico por su id
TaskController_1.TaskController.updateTask);
//Ruta para eliminar una tarea
router.delete('/:projectId/tasks/:taskId', 
//Middleware para validar que si es un alumno no pueda ELIMINAR tareas
task_1.hasAuthorization, 
//Le decimos que busque la tarea por el parámetro de mongo de Id
(0, express_validator_1.param)('taskId').isMongoId().withMessage('Id inválido'), 
//De nuevo pasamos el middleware por si hay error, detenga la ejecución
validation_1.handleInputErrors, 
//Llamamos al método de obtener una tarea en específico por su id
TaskController_1.TaskController.deleteTask);
//Ruta para cambiar los estados de las tareas
router.post('/:projectId/tasks/:taskId/status', 
//Le decimos que busque la tarea por el parámetro de mongo de "id"
(0, express_validator_1.param)('taskId').isMongoId().withMessage('Id inválido'), (0, express_validator_1.body)('status')
    //Garantizamos que no debe estar vacío ese campo
    .notEmpty().withMessage('El estado es obligatorio'), 
//De nuevo pasamos el middleware por si hay error, detenga la ejecución
validation_1.handleInputErrors, TaskController_1.TaskController.updateStatus);
//Esta es la ruta para los miembros del equipo que la tutora agregue
router.post('/:projectId/team/find', (0, express_validator_1.body)('email')
    .isEmail().toLowerCase().withMessage('El email no es válido'), validation_1.handleInputErrors, TeamController_1.TeamMemberController.findMemberByEmail);
//Ruta para mostrar todos los miembros de un proyecto
router.get('/:projectId/team', TeamController_1.TeamMemberController.getProjecTeam);
//Esta es la ruta para agrergar un miembro del equipo al proyecto
router.post('/:projectId/team/', 
//Lo agregamos por el id que tenga asignado
(0, express_validator_1.body)('id')
    .isMongoId().withMessage('Usuario incorrecto'), validation_1.handleInputErrors, TeamController_1.TeamMemberController.addMemberById);
//Esta es la ruta para eliminar a un alumno del proyecto
router.delete('/:projectId/team/:userId', 
//Lo agregamos por el id que tenga asignado
(0, express_validator_1.param)('userId')
    .isMongoId().withMessage('Usuario incorrecto'), validation_1.handleInputErrors, TeamController_1.TeamMemberController.removeMemberById);
/** RUTAS PARA LAS NOTAS **/
//Ruta para crear la nota
router.post('/:projectId/tasks/:taskId/notes', 
//Sólo le enviamos el contenmido de la nota, porque dentro del schema tenemos el task (que ya lo tenemos) y el createdby que es el usuario
(0, express_validator_1.body)('content')
    .notEmpty().withMessage('El contenido de la nota es obligatorio'), validation_1.handleInputErrors, NoteController_1.NoteController.createNote);
//Ruta para obtener las notas
router.get('/:projectId/tasks/:taskId/notes', NoteController_1.NoteController.getTaskNotes);
//Ruta para eliminar una nota
router.delete('/:projectId/tasks/:taskId/notes/:noteId', (0, express_validator_1.param)('noteId').isMongoId().withMessage('ID No válido'), validation_1.handleInputErrors, NoteController_1.NoteController.deleteNote);
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map