const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const { Resend } = require("resend")

const app = express()

app.use(express.json())
app.use(cors())

require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log("Database connection failed:", err));

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/sendemail", async function (req, res) {
  try {
    console.log("===== SEND EMAIL API CALLED =====");

    const msg = req.body.msg;
    const emailList = req.body.emailList;

    console.log("Message:", msg);
    console.log("Email List:", emailList);

    for (const email of emailList) {
      console.log("Sending to:", email);

      const result = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "A message from Bulkmail app",
        text: msg,
      });

      console.log("Email Sent:", email, result);
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