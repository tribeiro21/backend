"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cors_2 = require("./config/cors");
const db_1 = require("./config/db");
//Importamos las rutas del usuario
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
//Importamos las rutas en el servidor
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
dotenv_1.default.config();
(0, db_1.connectDB)();
//Leugo de generar la aplicación
const app = (0, express_1.default)();
//Permitimos las conexiones
app.use((0, cors_1.default)(cors_2.corsConfig));
//Loging
app.use((0, morgan_1.default)('dev'));
//Para que nos lea las expresiones json (leer datos del formulario)
app.use(express_1.default.json());
//Las diferentas rutas de nuestra aplicación
//Utilizamos el ".use" porque va a soportar todos los metodos (post, delete, get, etc)
//La ruta para los usuarios
app.use('/api/auth', authRoutes_1.default);
//La ruta para los proyectos:
app.use('/api/projects', projectRoutes_1.default);
exports.default = app;
//# sourceMappingURL=server.js.map