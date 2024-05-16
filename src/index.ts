//Con este importamos la opción de darle colores a los mensajes en consola
import colors from 'colors'
//Importamos el servidor
import server from './server'

//Realizamos la conexión al servidor
const port = process.env.PORT || 4000

server.listen(port, () => {
    console.log(colors.cyan.bold(`REST API funcionando en el puerto ${port}`))
})