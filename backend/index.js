
const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const mongoose=require("mongoose")

const app = express()

app.use(express.json())
app.use(cors())

require("dotenv").config();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });


const credential = mongoose.model("credential",{},"bulkmail")

app.post("/sendemail",function(req,res){

        var msg=req.body.msg
        var emailList=req.body.emailList


        credential.find().then(function(data){
    const transporter = nodemailer.createTransport({
 service:"gmail",
  auth: {
    user:data[0].toJSON().user ,
    pass:data[0].toJSON().pass,
  },
});


 new Promise(async function(resolve,reject){

        try{
        for(var i=0; i<emailList.length;i++)
        {
            await transporter.sendMail(
    {
        from:"karthicknarayanan385@gmail.com",
        to:emailList[i],
        subject:"A message from Bulkmail app",
        text:msg
    }
)

    console.log("Email Sent to:",emailList[i]);
    }
resolve("success")
}
catch(error){
    reject("failed")
}

        }).then(function(){
            res.send(true)
        }).catch(function(){
            res.send(false)
        })




}).catch(function(error){
        console.log(error)
})


        
    
})

        
       

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});