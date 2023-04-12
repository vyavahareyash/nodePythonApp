var express = require('express')
const fileUpload = require('express-fileupload');
const app = express();
const path = require("path");

app.use(fileUpload());
require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')


// var AWS = require('aws-sdk');

// const bucketName = process.env.AWS_BUCKET_NAME
// const region = process.env.AWS_BUCKET_REGION
// const accessKeyId = process.env.AWS_ACCESS_KEY
// const secretAccessKey = process.env.AWS_SECRET_KEY

const bucketName = 'my-bucket-yash-788921312'
const region = 'us-east-1'
const accessKeyId = 'AKIAQWOBXYSMW5DKHGNS'
const secretAccessKey = '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'

app.get('/', (req, res) => res.sendFile(__dirname + "/index.html"))

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})
app.post('/imageUpload', async(req, res) => {



    function uploadFile(data) {

        const uploadParams = {
            Bucket: bucketName,
            Body: fileContent,
            Key: filename
        }

        return s3.upload(uploadParams).promise()
    }

    // Binary data base64
    const fileContent = Buffer.from(req.files.image.data, 'binary');
    global.filename = req.files.image.name;

    // Setting up S3 upload parameters

    // Uploading files to the bucket
    uploadFile(fileContent, filename).then(() => res.redirect('/show'));
});

app.get('/show', async(req, res) => {
    // res.send("showing");
    var item = req.body;
    var params = { Bucket: bucketName, Key: 'cat.png' }; // keyname can be a filename
    // s3.getObject(params, function(err, data) {
    //     if (err) {
    //         return res.send({ "error": err });
    //     }
    //     res.send({ data });
    // });
    async function getImage() {
        const data = s3
            .getObject({
                Bucket: bucketName,
                Key: filename,
            })
            .promise();
        return data;
    }

    function encode(data) {
        let buf = Buffer.from(data);
        let base64 = buf.toString("base64");
        return base64;
    }
    getImage()
        .then((img) => {
            let image =
                "<img src='data:image/jpeg;base64," + encode(img.Body) + "'" + "/>";
            let startHTML = "<html><body></body>";
            let endHTML = "</body></html>";
            let html = startHTML + image + endHTML;
            res.send(html);
        })
        .catch((e) => {
            res.send(e);
        });
})

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});