//En este archivo colocamos el código de envío de email, para poder reutilizarlo en cualquier parte del código
import { transporter } from "../config/nodemailer";

//Definimos el tipo de dato que es el email
interface IEmail{
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        //Enviamos el email con el token
        const info = await transporter.sendMail({
            from: 'AgendaInfantil <admin@mangata.com>',
            to: user.email,
            subject: 'AgendaInfantil - Confirma tu cuenta',
            text: 'AgendaInfantil - Confirma tu cuenta',
            html: `<p>Hola: ${user.name}, has creado tu cuenta en Mangata, sólo falta que confirmes tu cuenta</p>
            <p>Dale click al siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
            <p>E ingresa el código: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>`
        })

        console.log('Mensaje enviado', info.messageId)
    }

    static sendPasswordResetToken = async (user: IEmail) => {
        //Enviamos el email con el token
        const info = await transporter.sendMail({
            from: 'AgendaInfantil <admin@mangata.com>',
            to: user.email,
            subject: 'AgendaInfantil - Reestablecer contraseña',
            text: 'AgendaInfantil - Reestablecer contraseña',
            html: `<p>Hola: ${user.name}, has solicitado recuperar tu contraseña</p>
            <p>Dale click al siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer contraseña</a>
            <p>E ingresa el código: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>`
        })

        console.log('Mensaje enviado', info.messageId)
    }
}