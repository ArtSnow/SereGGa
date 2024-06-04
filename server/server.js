const express = require('express')
const app = express()
var fs = require('fs');
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser')
const cors=require('cors');

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })


const options = {
    origin: 'http://localhost:3000',
}
app.use(cors(options)) 


const hash = "$2b$10$JKrel8W5llhXCRAIrx5Dlu8s5nlcLmxn0Pxtzd02fLXn5cn5KFSfK"
const url = "http://localhost:3000/?pass="
let counter = 0
let passData = []
let profData = []
let facData = []
let nameData = []

fs.readFile('gen.txt', 'utf8', function (err, data) {
    allData = data.split("///")
    allData.forEach(element => {
        passData.push(element.split('_')[0])
        profData.push(element.split('_')[1])
    });
})

fs.readFile('fac.txt', 'utf8', function (err, data) {
    facData = data.split("///")
})

fs.readFile('names.txt', 'utf8', function (err, data) {
    nameData = data.split("///")
})

app.post("/api/getqr", jsonParser, (req, res) => {
    if (!req.body.pass) {
        res.status(400).send('Sorry');
        return
    }
    if (!bcrypt.compareSync(req.body.pass, hash)) {
        res.status(401).send('Sorry1');
        return
    }
    
    res.json({"url":  url + passData[counter].split("-")[0]})
    counter += 1
})

app.post("/api/getProfile", jsonParser, (req, res) => {
    if (!req.body.pass) {
        res.status(400).send('Sorry');
        return
    }
    outData = profData[passData.indexOf(req.body.pass)]
    res.json({fac: outData.split('-')[0], name: nameData[parseInt(outData.split('-')[1]) % nameData.length]})
})

app.post("/api/setFacData", jsonParser, (req, res) => {
    if (!req.body.pass) {
        res.status(400).send('Sorry');
        return
    }
    if (!bcrypt.compareSync(req.body.pass, hash)) {
        res.status(401).send('Sorry1');
        return
    }
    facData[req.body.index] =  parseInt(facData[req.body.index]) + parseInt(req.body.count)

    fs.writeFile("fac.txt", facData.join('///'),
    {
      encoding: "utf8",
      flag: "w",
      mode: 0o666
    }, function () {

    })
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.json({"facs": facData})
})

app.get("/api/getFacData", (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.json({"facs": facData})
})


app.listen(5000, () => (console.log("Server started on port 5000")))