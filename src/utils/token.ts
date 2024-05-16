//Creamos la función para generar el token de 6 dígitos
export const generateToken = () => Math.floor(100000 + Math.random() * 900000).toString()