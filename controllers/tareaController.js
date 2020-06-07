const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

//crea una nueva tarea
exports.crearTarea = async ( req, res) => {
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }
    // Extraer el proyecto y comprobar si existe
    try {
        const { proyecto } = req.body;
        const project = await Proyecto.findById(proyecto);
        if(!project){
            return res.status(400).json({msg: 'Proyecto no encontrado'});
        }
        // revisar si el proyecto actual pertenece al usuario autentucado
        if(project.creador.toString() !== req.usuario.id ){
            return res.status(401).json({msg: 'No autorizado'});
        }
        // creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Obtener las tareas por proyecto
exports.obtenerTareas = async (req, res) => {
    try {
        const { proyecto } = req.query;
        const project = await Proyecto.findById(proyecto);
        if(!project){
            return res.status(400).json({msg: 'Proyecto no encontrado'});
        }
        // revisar si el proyecto actual pertenece al usuario autentucado
        if(project.creador.toString() !== req.usuario.id ){
            return res.status(401).json({msg: 'No autorizado'});
        }    
        //obtener las tareas por proyecto
        const tareas = await Tarea.find({proyecto});
        res.json({tareas});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
    
}

exports.actualizarTarea = async (req, res) => {
    try {
        const { proyecto, nombre, estado } = req.body;
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(404).json({msg: 'No existe esa tarea'});
        }
        // extraer proyecto
        const project = await Proyecto.findById(proyecto);
        // revisar si el proyecto actual pertenece al usuario autentucado
        if(project.creador.toString() !== req.usuario.id ){
            return res.status(401).json({msg: 'No autorizado'});
        }
        // crear nu objeto con la nueva informacion
        const nuevaTarea = {};
        nuevaTarea.nombre=nombre;
        nuevaTarea.estado=estado;
        // Guardar la tarea
        tarea = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new: true});
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.eliminarTarea = async (req, res) => {
    try {
        const { proyecto } = req.query;
        let tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(404).json({msg: 'No existe esa tarea'});
        }
        // extraer proyecto
        const project = await Proyecto.findById(proyecto);
        // revisar si el proyecto actual pertenece al usuario autentucado
        if(project.creador.toString() !== req.usuario.id ){
            return res.status(401).json({msg: 'No autorizado'});
        }
        // Eliminar
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea Eliminada'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}