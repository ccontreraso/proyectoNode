const Datos = require('../models/clientesModelo');


exports.mostrarDatos = async function(req, res) {
    let client = await Datos.find() 
    console.log(client)
    res.render('index', {datos: client});

}