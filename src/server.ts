import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { corsConfig } from './config/cors'
import { connectDB } from './config/db'
//Importamos las rutas del usuario
import authRoutes from './routes/authRoutes'
//Importamos las rutas en el servidor
import projectRoutes from './routes/projectRoutes'

dotenv.config()

connectDB()

//Leugo de generar la aplicación
const app = express()

//Permitimos las conexiones
app.use(cors(corsConfig))

//Loging
app.use(morgan('dev'))

//Para que nos lea las expresiones json (leer datos del formulario)
app.use(express.json())

//Las diferentas rutas de nuestra aplicación
//Utilizamos el ".use" porque va a soportar todos los metodos (post, delete, get, etc)
//La ruta para los usuarios
app.use('/api/auth', authRoutes)
//La ruta para los proyectos:
app.use('/api/projects', projectRoutes)


export default app