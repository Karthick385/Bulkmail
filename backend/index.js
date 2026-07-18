
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

app.post("/sendemail", async function (req, res) {
  try {
    console.log("===== SEND EMAIL API CALLED =====");

    const msg = req.body.msg;
    const emailList = req.body.emailList;

    console.log("Message:", msg);
    console.log("Email List:", emailList);

    const data = await credential.find();

    console.log("MongoDB Data:", data);

    if (!data.length) {
      console.log("No credentials found in MongoDB");
      return res.status(500).send(false);
    }

    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // STARTTLS, not SSL
  auth: {
    user: data[0].user,
    pass: data[0].pass,
  },
  family: 4,
  connectionTimeout: 10000,
});
    console.log("Transporter Created");

    for (const email of emailList) {
      console.log("Sending to:", email);

      await transporter.sendMail({
        from: data[0].user,
        to: email,
        subject: "A message from Bulkmail app",
        text: msg,
      });

      console.log("Email Sent:", email);
    }

    console.log("All emails sent successfully");
    res.send(true);

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).send(false);
  }
});

        
       

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});