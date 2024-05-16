//Este archivo es para probar el envío de emails con esta herramienta llamada Mailtrap
//Utilizamos la dependencia nodemailer para nodejs
//Importamos la dependencia nodemailer
import nodemailer from 'nodemailer'
//Importamos el archivo de las variables de entorno
import dotenv from 'dotenv'

dotenv.config()

const config = () => {
    return {
        //Hemos creado las variables de entorno en el archivo env para mantener ocultas estas credenciales
        host: process.env.SMTP_HOST,
        //En el caso del puerto, como es un número, le colocamos el signo + delante
        port: +process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    }
}

export const transporter = nodemailer.createTransport(config());