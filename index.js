var express = require('express')
const fileUpload = require('express-fileupload');
const app = express();

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

app.post('/imageUpload', async(req, res) => {


    const s3 = new S3({
        region,
        accessKeyId,
        secretAccessKey
    })

    function uploadFile(data) {

        const uploadParams = {
            Bucket: bucketName,
            Body: fileContent,
            Key: 'testupload.png'
        }

        return s3.upload(uploadParams).promise()
    }

    // Binary data base64
    const fileContent = Buffer.from(req.files.image.data, 'binary');

    // Setting up S3 upload parameters

    // Uploading files to the bucket
    uploadFile(fileContent);
    res.send('ok')


})

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});