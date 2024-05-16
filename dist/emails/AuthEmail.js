"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthEmail = void 0;
//En este archivo colocamos el código de envío de email, para poder reutilizarlo en cualquier parte del código
const nodemailer_1 = require("../config/nodemailer");
class AuthEmail {
    static sendConfirmationEmail = async (user) => {
        //Enviamos el email con el token
        const info = await nodemailer_1.transporter.sendMail({
            from: 'AgendaInfantil <admin@mangata.com>',
            to: user.email,
            subject: 'AgendaInfantil - Confirma tu cuenta',
            text: 'AgendaInfantil - Confirma tu cuenta',
            html: `<p>Hola: ${user.name}, has creado tu cuenta en Mangata, sólo falta que confirmes tu cuenta</p>
            <p>Dale click al siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
            <p>E ingresa el código: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>`
        });
        console.log('Mensaje enviado', info.messageId);
    };
    static sendPasswordResetToken = async (user) => {
        //Enviamos el email con el token
        const info = await nodemailer_1.transporter.sendMail({
            from: 'AgendaInfantil <admin@mangata.com>',
            to: user.email,
            subject: 'AgendaInfantil - Reestablecer contraseña',
            text: 'AgendaInfantil - Reestablecer contraseña',
            html: `<p>Hola: ${user.name}, has solicitado recuperar tu contraseña</p>
            <p>Dale click al siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer contraseña</a>
            <p>E ingresa el código: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>`
        });
        console.log('Mensaje enviado', info.messageId);
    };
}
exports.AuthEmail = AuthEmail;
//# sourceMappingURL=AuthEmail.js.map