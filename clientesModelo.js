var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clienteSchema = new Schema({
    nombre_completo :{
        type: String,
        require: true
    },
    fecha_nacimiento: {
        type: String,
        require: true
    },
    direccion :{
        type: String,
        require: true
    },
    email :{
        type: String,
        require: true
    }
});

module.exports = Cliente = mongoose.model('cliente',clienteSchema);