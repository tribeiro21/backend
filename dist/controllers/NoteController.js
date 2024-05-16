"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteController = void 0;
const Note_1 = __importDefault(require("../models/Note"));
//Controlador para las notas
class NoteController {
    //Función para crear la nota
    //Después del Request entre <> lo que hacemos es definir el tipo de dato del content de las notas, en este caso un string
    static createNote = async (req, res) => {
        const { content } = req.body;
        //Creamos la nueva nota
        const note = new Note_1.default();
        //Con el contenido
        note.content = content;
        //Con el usuario que la creó
        note.createdBy = req.user.id;
        //La asiganamos a la tarea correspondiente
        note.task = req.task.id;
        //Agregamos la nota a la tarea
        req.task.notes.push(note.id);
        //Y la guardamos
        try {
            await Promise.allSettled([req.task.save(), note.save()]);
            res.send('Nota creada');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    //Función para obtener las notas
    static getTaskNotes = async (req, res) => {
        try {
            const notes = await Note_1.default.find({ task: req.task.id });
            res.json(notes);
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
    //Función para eliminar una nota
    static deleteNote = async (req, res) => {
        const { noteId } = req.params;
        const note = await Note_1.default.findById(noteId);
        //Si la nota no existe, muestra un error
        if (!note) {
            const error = new Error('Nota no encontrada');
            return res.status(404).json({ error: error.message });
        }
        //Sólo la persona que creó la nota la puede eliminar
        //Si no es la persona que la creó
        if (note.createdBy.toString() !== req.user.id.toString()) {
            const error = new Error('Acción inválida');
            return res.status(401).json({ error: error.message });
        }
        //Eliminar las notas de las tareas en la base de datos
        req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString());
        //Pero si sí es la persona
        try {
            await Promise.allSettled([req.task.save(), note.deleteOne()]);
            res.send('Nota eliminada');
        }
        catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
        }
    };
}
exports.NoteController = NoteController;
//# sourceMappingURL=NoteController.js.map