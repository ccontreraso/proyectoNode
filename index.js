const express = require('express');
const app = express();
const path = require('path');

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



