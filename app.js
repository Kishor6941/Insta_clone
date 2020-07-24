const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 5000
const {MONGOURI} = require('./Keys')

//pWgtrTPBRphXBhDP //Kishor6941
mongoose.connect(MONGOURI,{
    useNewUrlParser:true, 
    useUnifiedTopology:true
})
mongoose.connection.on("connected",()=>{
    
    console.log("Connected to mongoose")
})
mongoose.connection.on('error',(err)=>{
    console.log("error",err)
})
require('./models/user')
require('./models/post')
app.use(express.json())

app.use(require('./routes/auth'))
app.use(require('./routes/post'))



app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
