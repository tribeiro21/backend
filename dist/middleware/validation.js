"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInputErrors = void 0;
const express_validator_1 = require("express-validator");
//Esta funciòn se va a encargar de detener la ejecución en caso de existir algún error en la validación de campos
//Esta función es reutilizable en nuestro código
const handleInputErrors = (req, res, next) => {
    let errors = (0, express_validator_1.validationResult)(req);
    //Si el error no existe
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //Entonces pasa al siguiente middleware
    next();
};
exports.handleInputErrors = handleInputErrors;
//# sourceMappingURL=validation.js.map