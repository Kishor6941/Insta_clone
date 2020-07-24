const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')
const {JWT_SECRET} = require('../Keys')
const requireLogin =require('../middleware/requireLogin')

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "Please add all the details" })
    }
    //res.json({message:"sucessfully posted"})
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "User already exists with this email" })

            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {

                    const user = new User({
                        email,
                        password: hashedpassword,
                        name
                    })


                    user.save()
                        .then(user => {
                            res.json({ message: "saved successfully" })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
        })
        .catch(err => {
            console.log(err)

        })
})
router.post('/login', (req, res) => {
    const { email,password} = req.body
    if (!email || !password) {
       return res.status(422).json({error: "Please Enter the email and password"})
    }
    User.findOne({email:email})
    .then(savedUser => {
    if (!savedUser) {
            return res.status(422).json({ error: "Invalid email or password" })
        }
        bcrypt.compare(password, savedUser.password)
            .then(doMatch => {
                if (doMatch) {
                   // res.json({ message: "Login sucessfully" })
                   const token =jwt.sign({_id:savedUser._id},JWT_SECRET)
                   const {_id,name,email}=savedUser
                   res.json({token,user:{ _id,name,email}})

                }
                else {
                    return res.status(422).json({ error: "Invalid email or password" })

                }
            })
            .catch(err => {
                console.log(err)
            })
    })
})

module.exports = router