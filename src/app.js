const express = require("express")
const app = express()
const mongoose = require("mongoose")
const user = require("../models/User")


app.use(express.urlencoded({ extended: false }))
app.use(express.json())



mongoose.connect("mongodb://localhost:27017/guiapics", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        //console.log("conectado com o banco")
    }).catch(err => {
        console.log(err)
    })

const User = mongoose.model("User", user)

app.get("/", (req, res) => {
    res.json({})
})

app.post("/user", async (req, res) => {

    try {

        let { name, email, password } = req.body

        let objectUser = {
            name,
            email,
            password
        }

        let newUser = await new User(objectUser)
        newUser.save()
        res.json({email: req.body.email})
    } catch (err) {
        res.sendStatus(500)
    }

})


module.exports = app