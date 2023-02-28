const express = require('express');
const app = express();
const index = require('./controller/index');
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const mongoCliente = require('mongodb')
const mongoUrl = 'mongodb+srv://cesarcontrerasor:OnuJxeNzZPA9dPph@yelli-local.mog9njr.mongodb.net/test';
const Cliente = require("./models/clientesModelo");
const datosController = require('./controller/datos');
//const router = express().router;    


app.listen(3001,() => 
    console.log("El server se esta ejecutando en el puerto 3001")
);


mongoose.set('strictQuery', true);
mongoose.connect(mongoUrl, {useNewUrlParser: true});
var db = mongoose.connection;

!db ? console.log("Hubo un error conectándose a la base de datos"): console.log("Conexión de base de datos satisfactoria");

app.set('view engine', 'ejs')
app.use(express.static(__dirname+ '/public'))

app.get('/', index.getIndex);
app.get('/datos', datosController.mostrarDatos);


app.get("/scrapping", function (req,res) {

    // const rut = req.query.txt_rut;
    // const password = req.query.txt_password;
    // console.log(rut);
    // console.log(password);


    let scrape = async () => {
        const browser = await puppeteer.launch({headless: false}); //Podemos ver lo que va haciendo con el headless = false
        const page = await browser.newPage(); //Interactúa con las paginas
        await page.setViewport({width : 1920, height : 1080});
        await page.goto('https://www.chileatiende.gob.cl/',[2000, {waitUntil: "domcontentloaded"}]);//La URL con los ms que queremos que espere en que cargue el contenido
        
        //Seleccionar
        let elementToClick = '#app > div:nth-child(2) > header > div > div > div > div.col-sm-12.col-md-5.banner-der.bg-bannerIngreso > section > a';
        await page.waitForSelector(elementToClick);

        await Promise.all([
            page.click(elementToClick),
            page.waitForNavigation({waitUntil: 'networkidle2'}),
        ]);

        let elementToRut = '#uname';
        let elementToPassword = '#pword';
        
        await page.type(elementToRut, '198906824');
        await page.type(elementToPassword, 'Cesar2846054@');

        elementToClick = '#login-submit';
        await page.waitForSelector(elementToClick);
        await Promise.all([
            page.click(elementToClick),
            page.waitForNavigation({waitUntil: 'networkidle2'}),
        ]);

        elementToClick = '#menuMiCha > li:nth-child(5) > a';
        await page.waitForSelector(elementToClick);
        await Promise.all([
            page.click(elementToClick),
            page.waitForNavigation({waitUntil: 'networkidle2'}),
        ]);

        const result = await page.evaluate(() => {
            let nombre_completo = document.querySelector("#cont-misdatos > div > section:nth-child(1) > div > header > div > h2").innerText;
            let fecha_nacimiento = document.querySelector("#cont-misdatos > div > section:nth-child(1) > div > div:nth-child(2) > span:nth-child(2) > strong").innerText;
            let direccion = document.querySelector("#cont-misdatos > div > section:nth-child(1) > div > div:nth-child(3) > span:nth-child(2)").innerText;
            let email = document.querySelector("#cont-misdatos > div > section:nth-child(1) > div > div:nth-child(4) > span:nth-child(3)").innerText;
            let rut_cliente = document.querySelector("#cont-misdatos > div > section:nth-child(1) > div > header > div > h3").innerText;
            let clienteModelo = {
                nombre_completo : nombre_completo,
                fecha_nacimiento : fecha_nacimiento,
                direccion: direccion,
                email : email,
                rut_cliente : rut_cliente
            }

            
            return clienteModelo;
            
        });


        console.log(result);
        browser.close();
        
    };
    
    scrape().then(value => {
        Cliente.create(value, function (err, small){
            if(err) return handleError(err);
            //
        });
        res.send(value);
        console.log("Se ha guardado correctamente")
        return;
    });
    
});



