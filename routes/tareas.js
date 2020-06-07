const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//crear una tarea
router.post('/',
    auth,
    [
        check('nombre', 'El Nombre es obligatorio').not().isEmpty(),
        check('proyecto', 'El Proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
)
//Obtener las tareas por proyecto
router.get('/',
    auth,
    tareaController.obtenerTareas
);

// Actualizar tareas
router.put('/:id',
    auth,
    tareaController.actualizarTarea
);

// Elimar tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
);

module.exports= router;