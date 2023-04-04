const express = require('express')
const path = require('path')
const { spawn } = require('child_process');
const bodyParser = require('body-parser')
const app = express()
const port = 3000


app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post('/', function(req, res) {

    const number = req.body.number;

    var dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python', ['public/script1.py', number]);
    // collect data from script
    python.stdout.on('data', function(data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        res.render('result', { dataToSend: dataToSend })
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))