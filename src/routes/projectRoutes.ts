import {Router} from 'express'
//Importamos el validator que nos permite validar campos
import {body, param} from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/TaskController'
import { projectExists } from '../middleware/project'
import { hasAuthorization, taskBelongsToProject, taskExists } from '../middleware/task'
import { authenticate } from '../middleware/auth'
import { TeamMemberController } from '../controllers/TeamController'
import { NoteController } from '../controllers/NoteController'

const router = Router()

//Le pasamos el middleware de autenticación a todas las rutas
router.use(authenticate)

//Definimos la ruta desde dónde vamos a crear proyectos
router.post('/', 
    //Pasamos el middleware que sirve para verificar al usuario
    body('projectName')
        //Garantizamos que no debe estar vacío ese campo
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('aulaName')
        //Garantizamos que no debe estar vacío ese campo
        .notEmpty().withMessage('El aula asignada al proyecto es obligatoria'),
    body('description')
        //Garantizamos que no debe estar vacío ese campo
        .notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    
    //Colocamos el middleware aquí para que en caso de no pasar la validación, se quede aquí y no cree el proyecto
    handleInputErrors,
    ProjectController.createProject
)

//Definimos la ruta donde vamos a mostrar todos los proyectos creados por la tutora
router.get('/', ProjectController.getAllProjects)

//Esta ruta es para mostrar un proyecto en específico por su id
//Le agregamos a la ruta :id para que sea una ruta dinámica, ya que el id va cambiando
router.get('/:id', 
    //Le decimos que busque el proyecto por el parámetro de mongo de "id"
    param('id').isMongoId().withMessage('Id inválido'),  
    //De nuevo pasamos el middleware por si hay error, detenga la ejecución
    handleInputErrors,
    ProjectController.getProjectById
)

//Para simplificar las rutas, utilizamos el router.param y le pasamos el projectId porque es lo que siempre vamos a validar y su middleware, que en este caso es validateProjectExists
router.param('projectId', projectExists)

//Esta ruta es para actualizar un proyecto
router.put('/:projectId', 
    //Validamos el id del proyecto que vamos a actualizar
    param('projectId').isMongoId().withMessage('Id inválido'),  
    //Y ahora tenemos que volver a validar los campos como cuando creamos un proyecto
    body('projectName')
        //Garantizamos que no debe estar vacío ese campo
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('aulaName')
        //Garantizamos que no debe estar vacío ese campo
        .notEmpty().withMessage('El aula asignada al proyecto es obligatoria'),
    body('description')
        //Garantizamos que no debe estar vacío ese campo
        .notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    //De nuevo pasamos el middleware por si hay error, detenga la ejecución
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProject
)

//Para eliminar un proyecto
router.delete('/:projectId', 
    //Le decimos que busque el proyecto por el parámetro de mongo de "id"
    param('projectId').isMongoId().withMessage('Id inválido'),  
    //De nuevo pasamos el middleware por si hay error, detenga la ejecución
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProject
)

//AQUÍ DEFINIMOS LAS RUTAS PARA LAS TAREAS

router.post('/:projectId/tasks',
    //Middleware para validar que si es un alumno no pueda CREAR tareas
    hasAuthorization,
    //Validamos que estamos enviando todos los campos de la tarea, para que no se puedan enviar campos vacíos
    body('name')
        //Garantizamos que no debe estar vacío ese campo
        .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        //Garantizamos que no debe estar vacío ese campo
        .notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    //Colocamos el middleware aquí para que en caso de no pasar la validación, se quede aquí y no cree el proyecto
    handleInputErrors,
    TaskController.createTask
)

//Ruta para obtener las tareas de un proyecto determinado
router.get('/:projectId/tasks',
    //Llamamos al método de obtener tarea
    TaskController.getProjectTasks

)

//Aquí va el middleware de la validación de si la tarea existe, para no escribir tanto código de validación y repetir tanto código
router.param('taskId', taskExists)

//Ahora el middleware de la validación de si la tarea pertenece a un proyecto, para no escribir tanto código de validación y repetir tanto código
router.param('taskId', taskBelongsToProject)

//Ruta para traernos una tarea por su id
router.get('/:projectId/tasks/:taskId',
    //Le decimos que busque la tarea por el parámetro de mongo de Id
    param('taskId').isMongoId().withMessage('Id inválido'),  
    //De nuevo pasamos el middleware por si hay error, detenga la ejecución
    handleInputErrors,
    //Llamamos al método de obtener una tarea en específico por su id
    TaskController.getTaskById

)

//Ruta para modificar las tareas
router.put('/:projectId/tasks/:taskId',
    //Middleware para validar que si es un alumno no pueda editar tareas
    hasAuthorization,
    //Le decimos que busque la tarea por el parámetro de mongo de "id"
    param('taskId').isMongoId().withMessage('Id inválido'),
    body('name')
    //Garantizamos que no debe estar vacío ese campo
    .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
    //Garantizamos que no debe estar vacío ese campo
    .notEmpty().withMessage('La descripción de la tarea es obligatoria'),  
    //De nuevo pasamos el middleware por si hay error, detenga la ejecución
    handleInputErrors,
    //Llamamos al método de obtener una tarea en específico por su id
    TaskController.updateTask

)

//Ruta para eliminar una tarea
router.delete('/:projectId/tasks/:taskId',
    //Middleware para validar que si es un alumno no pueda ELIMINAR tareas
    hasAuthorization,
    //Le decimos que busque la tarea por el parámetro de mongo de Id
    param('taskId').isMongoId().withMessage('Id inválido'),  
    //De nuevo pasamos el middleware por si hay error, detenga la ejecución
    handleInputErrors,
    //Llamamos al método de obtener una tarea en específico por su id
    TaskController.deleteTask

)

//Ruta para cambiar los estados de las tareas
router.post('/:projectId/tasks/:taskId/status',
    //Le decimos que busque la tarea por el parámetro de mongo de "id"
    param('taskId').isMongoId().withMessage('Id inválido'),
    body('status')
    //Garantizamos que no debe estar vacío ese campo
    .notEmpty().withMessage('El estado es obligatorio'),    
    //De nuevo pasamos el middleware por si hay error, detenga la ejecución
    handleInputErrors,
    TaskController.updateStatus
)

//Esta es la ruta para los miembros del equipo que la tutora agregue
router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('El email no es válido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

//Ruta para mostrar todos los miembros de un proyecto
router.get('/:projectId/team',
    TeamMemberController.getProjecTeam
)

//Esta es la ruta para agrergar un miembro del equipo al proyecto
router.post('/:projectId/team/',
    //Lo agregamos por el id que tenga asignado
    body('id')
        .isMongoId().withMessage('Usuario incorrecto'),
    handleInputErrors,
    TeamMemberController.addMemberById
)

//Esta es la ruta para eliminar a un alumno del proyecto
router.delete('/:projectId/team/:userId',
    //Lo agregamos por el id que tenga asignado
    param('userId')
        .isMongoId().withMessage('Usuario incorrecto'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

/** RUTAS PARA LAS NOTAS **/

//Ruta para crear la nota
router.post('/:projectId/tasks/:taskId/notes',
    //Sólo le enviamos el contenmido de la nota, porque dentro del schema tenemos el task (que ya lo tenemos) y el createdby que es el usuario
    body('content')
        .notEmpty().withMessage('El contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)

//Ruta para obtener las notas
router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

//Ruta para eliminar una nota
router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID No válido'),
    handleInputErrors,
    NoteController.deleteNote
)

export default router