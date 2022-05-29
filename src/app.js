const express = require("express")
const app = express()
const mongoose = require("mongoose")
const user = require("../models/User")
const bcrypt = require("bcrypt")
const jwtSecret = "GitHub"
const jwt = require("jsonwebtoken")
const { hash } = require("bcrypt")



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

        let userEmail = await User.findOne({email: email})
            
            if(userEmail != undefined){
               
                res.statusCode = 400
                res.json({error:"Email já cadastrado!"})
                return
            }


        if(name.trim() == "" || email.trim() == "" || password.trim() == ""){
            res.sendStatus(400)
            return        
        }

            let salt = await bcrypt.genSalt(10)
            let hash = await bcrypt.hash(password,salt)

            let objectUser = {
                name,
                email,
                password: hash
            }

            let newUser = new User(objectUser)
            
            await newUser.save()
            res.json({email: email})

    }catch(err){
        res.sendStatus(500)
    }
})

app.delete("/user/:email", async (req,res) => {
    await User.deleteOne({email:req.params.email})
    res.sendStatus(200)         
})

app.post("/auth", async (req, res) => {
    let { email, password} = req.body

    
    let user = await User.findOne({email:email})

    if(user == undefined) {
        res.statusCode = 403
        res.json({
            errors:{
                email:"E-mail não cadastrado"
            }})
        return
    }

    let isPasswordRight = await bcrypt.compare(password,user.password)

    if(!isPasswordRight){
        console.log("olaa")
        res.statusCode = 403
        res.json({
            errors:{
                pass:"Senha incorreta"
            }})
        return
    }

    jwt.sign({email},jwtSecret,{expiresIn:"48h"},(err, token) => {
        
        if(err){
            console.log(err)
            res.sendStatus(500)
        }else{
            res.json({token})
        }
    })
})


module.exports = app