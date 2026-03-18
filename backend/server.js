const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* GMAIL SMTP CONFIG */

const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
user: "tmadhesh07@gmail.com",        // 🔥 your gmail
pass: "laneamjfxwjeltlq"       // 🔥 app password (NOT normal password)
}
});

/* INTERNSHIPS */

let internships = [

{
id:1,
title:"Frontend Developer Intern",
company:"TechCorp",
companyEmail:"internhub07@gmail.com",
location:"San Francisco, CA",
description:"Work on modern web applications"
}

];

/* ROOT */

app.get("/", (req, res) => {
res.send("InternHub API is running");
});

/* APPLY */

app.post("/apply", async (req, res) => {

console.log("🔥 APPLY API HIT");

const { internshipId, name, email } = req.body;

const internship = internships.find(i => i.id == internshipId);

if (!internship) {
return res.status(404).json({ message: "Internship not found" });
}

try {

console.log("📩 Sending email via Gmail...");

await transporter.sendMail({

from: "tmadhesh07@gmail.com",                 // 🔥 sender
to: "internhub07@gmail.com",                  // 🔥 company mail

subject: "New Internship Application",

text: `
New Application Received

Internship: ${internship.title}
Company: ${internship.company}

Applicant Name: ${name}
Applicant Email: ${email}
`

});

console.log("✅ Email sent successfully");

res.json({ message: "Application sent!" });

} catch (error) {

console.error("❌ EMAIL ERROR:", error);

res.status(500).json({ message: "Email failed" });

}

});

/* START */

app.listen(PORT, () => {
console.log(`🚀 Server running on port ${PORT}`);
});