//En este archivo, realizamos la conexión del backend con el frontend
//Para mostrar las peticiones a la base de datos en el frontend
import {CorsOptions} from 'cors'

export const corsConfig: CorsOptions = {
    origin: function(origin, callback) {
    
        //Nos conectamos a la URL del frontend, que definimos como variable de entorno como FRONTEND_URL en el archivo .env
        const whitelist = [process.env.FRONTEND_URL]

        if(process.argv[2] === '--api'){
            whitelist.push(undefined)
        }

        //Si la petición viene del whitelist
        if(whitelist.includes(origin)){
            //Le permitimos la conexión
            callback(null, true)
        }else{
            //En caso contrario, muestra error
            callback(new Error('Error en CORS'))
        }
    }
}