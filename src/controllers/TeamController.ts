import type {Request, Response} from 'express'
import User from '../models/User'
import Project from '../models/Project'

//Exportamos la clase para los miembros del proyecto
export class TeamMemberController {
    //Los buscamos por el email
    static findMemberByEmail = async (req: Request, res: Response) => {
        const {email} = req.body

        //Buscamos al usuario y con el select le decimos cuáles datos del usuario queremos traernos
        const user = await User.findOne({email}).select('id email name')
        //Si el usuario no existe
        if(!user) {
            const error = new Error('Alumno no encontrado')
            return res.status(404).json({error: error.message})
        }
        res.json(user)
    }

    //Función para listar todos los miembros de un proyecto
    static getProjecTeam = async (req: Request, res: Response) => {
        const project = await (await Project.findById(req.project.id)).populate({
            path: 'team',
            select: 'id email name'
        })
        res.json(project.team)
    }

    //Método para agregar miembros al proyecto
    static addMemberById = async (req: Request, res: Response) => {
        const {id} = req.body
        
        //Buscamos al usuario por el id
        const user = await User.findById(id).select('id')
        //Si el usuario no existe
        if(!user) {
            const error = new Error('Alumno no encontrado')
            return res.status(404).json({error: error.message})
        }

        //Comprobamos que este alumno no esté ya agregado a este proyecto
        if(req.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('El Alumno ya está agregado a este proyecto')
            return res.status(409).json({error: error.message})
        }

        //Si el usuario existe, lo agregamos al proyecto con el push
        req.project.team.push(user.id)
        await req.project.save()

        res.send('Alumno agregado correctamente')
    }

    //Función para eliminar a un alumno de un proyecto
    static removeMemberById = async (req: Request, res: Response) => {
        const {userId} = req.params

        //Si el alumno no está agregado al proyecto, no hay nada que eliminar
        if(!req.project.team.some(team => team.toString() === userId)) {
            const error = new Error('El Alumno no existe en este proyecto')
            return res.status(409).json({error: error.message})
        }

        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId)
        await req.project.save()
        res.send('Alumno eliminado correctamente')
    }
}