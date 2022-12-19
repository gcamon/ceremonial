const express = require('express')
const app = express()
const db = require('./database')
const config = require('./config')
config(app,express)

const port = 3009

app.listen(port,() => {
    console.log("server running at port: " + port)
})