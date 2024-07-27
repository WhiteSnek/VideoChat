const express = require('express')
const cors = require('cors')

const app = express()

const options = {
    origin: "*",
    credentials: true
}

app.use(cors(options))

app.get('/', (req,res)=>{
    res.send("Server is live")
})

module.exports = app