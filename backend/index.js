const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const axios = require("axios")

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

app.post("/sendemail", async function (req, res) {
  try {
    console.log("===== SEND EMAIL API CALLED =====");

    const msg = req.body.msg;
    const emailList = req.body.emailList;

    console.log("Message:", msg);
    console.log("Email List:", emailList);

    for (const email of emailList) {
      console.log("Sending to:", email);

      await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: { email: "karthicknarayanan385@gmail.com", name: "BulkMail" },
          to: [{ email: email }],
          subject: "A message from Bulkmail app",
          textContent: msg,
        },
        {
          headers: {
            "api-key": process.env.BREVO_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Email Sent:", email);
    }

    console.log("All emails sent successfully");
    res.send(true);

  } catch (error) {
    console.error("ERROR:", error.response ? error.response.data : error.message);
    res.status(500).send(false);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});