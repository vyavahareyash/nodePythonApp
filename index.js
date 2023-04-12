const express = require('express');
// const path = require('path')
var request = require('request');
// const { spawn } = require('child_process');
const bodyParser = require('body-parser');
// const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const url = 'mongodb+srv://yash:yash@cluster0.kdb13b7.mongodb.net';
const dbName = 'deploymentModels';
const multer = require('multer');
const ImageModel = require("./image.model");
const app = express();
const port = 3000;

mongoose.connect(url + '/' + dbName, { useNewUrlParser: true }).then(() => console.log("DB is connected.")).catch((err) => console.log(err, "it has an error"));

// const imageSchema = new mongoose.Schema({
//     id: Number,
//     data: String,
// });

// const Image = mongoose.model('Image', imageSchema);

// app.use(fileUpload());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Storage = multer.diskStorage({
    destination: 'uploadedImages',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: Storage
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.get('/image', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


app.post('/upload', upload.single('yash'), (req, res) => {
    // Log the files to the console
    // const data = JSON.stringify(req.files.image.data);
    // res.send(data);
    // console.log(data);

    // const image = new Image({
    // id: 55,
    // data: data
    // });

    // image.save()

    // All good
    // res.sendStatus(200);
    ///////////////////////////////////////////////////////////////////

    // upload(req, res, (err) => {
    //     // res.send(req.body.name);
    //     console.log(req.body);
    //     if (err) {
    //         console.log("ERROR:\n" + err)
    //     } else {
    const newImage = new ImageModel({
        name: req.file.originalname,
        image: {
            data: req.file.filename,
            contentType: 'image'
        }
    });
    newImage.save()
        .then(() => res.send('successfully uploaded image'))
        .catch((err) => console.log(err));
    //     }
    // })
});

// app.post('/', function(req, res) {

//     const number = req.body.number;

//     var dataToSend;
//     // spawn new child process to call the python script
//     const python = spawn('python', ['public/script1.py', number]);
//     // collect data from script
//     python.stdout.on('data', function(data) {
//         console.log('Pipe data from python script ...');
//         dataToSend = data.toString();
//     });
//     // in close event we are sure that stream from child process is closed
//     python.on('close', (code) => {
//         console.log(`child process close all stdio with code ${code}`);
//         // send data to browser
//         res.render('result', { dataToSend: dataToSend })
//     });
// })

app.post('/', function(req, res) {
    const number = parseInt(req.body.number);
    // console.log(number)
    request.post("https://yashvyavahare.ap-south-1.modelbit.com/v1/example_doubler/latest", { json: { data: number } }, function(request, response) {
        dataToSend = response.body.data;
        res.render('result', { dataToSend: dataToSend })
    })

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))