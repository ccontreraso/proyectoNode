const express = require('express');
const app = express();
const path = require('path');
const puppeteer = require('puppeteer');

// (async()=>{
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage(); //interactuar con las paginas
//     await page.goto('https://www.chileatiende.gob.cl/');
//     await page.screenshot({ path: 'banco.jpg'});

//     await browser.close();
// })()


app.listen(3001 , ()=> 
    console.log("El puerto es 3001")
    );

app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));

app.get('/',(req,res) => {
    res.sendFile(path.resolve(__dirname,'index.html'))
})

app.get('/index', (req,res) => {

})

app.get("/scrapping", function (req,res) {
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
        ])


    }

    scrape();
})





