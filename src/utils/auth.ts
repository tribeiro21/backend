//Importamos la librería que utilizamos para hacer el hasheo de la contraseña "bcrypt"
import bcrypt from 'bcrypt'
//Este código es para hashear el password
export const hashPassword = async (password: string) => {
    //Hasheamos la contraseña antes de guardar el usuario en la base de datos
    //El 10 significa el número de combinaciones diferentes que genera al hashear
    const salt = await bcrypt.genSalt(10)
    //Utilizamos el método .hash de bcrypt
    return await bcrypt.hash(password, salt)       
}

//Código para confirmar la contrasaeña del usuario
//Le pasamos la contraseña introducida y la almacenada que ya está hasheada
export const checkPassword = async (enteredPassword: string, storedHash: string) => {
    //La misma librería bcrypt la utilizamos para poder comparar la contraseña real con la hasheada
    return await bcrypt.compare(enteredPassword, storedHash)
}