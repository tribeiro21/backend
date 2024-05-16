import mongoose, {Schema, Document, Types} from "mongoose"

//Creamos el modelo del token que se le envía al usuario por email para confirmar la cuenta
export interface IToken extends Document {
    token: string
    user: Types.ObjectId
    createdAt: Date
}

//Creamos el esquema del modelo del token
const tokenSchema: Schema = new Schema({
    token:{
        type: String,
        required: true
    },
    user:{
        type: Types.ObjectId,
        //Tenemos que hacer referencia al modelo usuario que definimos antes
        ref: 'User'
    },
    expiresAt:{
        type: Date,
        //Colocamos como fehca por defecto la fecha de hoy
        default: Date.now(),
        //El tiempo de expiración del token, 10 minutos en este caso
        expires: "10m"
    }
})

const Token = mongoose.model<IToken>('Token', tokenSchema)
export default Token