import mongoose, {Schema, Document} from "mongoose"

//Creamos el modelo de datos del usuario
export interface IUser extends Document{
    email: string
    password: string
    name: string
    confirmed: boolean
}

//Definimos el schema 
const userSchema: Schema = new Schema({
    email:{
        type: String,
        //Para que sea un campo requerido
        required: true,
        lowercase: true,
        //Para que sea un email único por usuario
        unique: true
    },
    password:{
        type: String,
        //Para que sea un campo requerido
        required: true,
    },
    name:{
        type: String,
        //Para que sea un campo requerido
        required: true,
    },
    confirmed:{
        type: Boolean,
        //Cuando se crea la cuenta, tiene que confirmarla con el email enviado
        default: false,
    },
})

//Definimos la función del usuario
const User = mongoose.model<IUser>('User', userSchema)
export default User