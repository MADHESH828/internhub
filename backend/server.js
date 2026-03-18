const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* ✅ GMAIL CONFIG */

const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
user: "tmadhesh07@gmail.com",
pass: "laneamjfxwjeltlq" // ✅ removed spaces
}
});

/* ✅ SAMPLE DATA */

let internships = [

{
id:1,
title:"Frontend Developer Intern",
company:"TechCorp",
companyEmail:"internhub07@gmail.com",
location:"Remote",
description:"Work on React and UI"
},

{
id:2,
title:"Data Science Intern",
company:"DataFlow",
companyEmail:"internhub07@gmail.com",
location:"Bangalore",
description:"Work with ML models"
}

];

/* ROOT */

app.get("/", (req, res) => {
res.send("InternHub API is running");
});

/* GET INTERNSHIPS */

app.get("/internships", (req, res) => {
res.json(internships);
});

/* POST INTERNSHIP */

app.post("/internships", (req, res) => {

const { title, company, companyEmail, location, description } = req.body;

const newInternship = {
id: Date.now(),
title,
company,
companyEmail,
location,
description
};

internships.push(newInternship);

res.json(newInternship);

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

from: "tmadhesh07@gmail.com",
to: internship.companyEmail,

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

res.json({ message: "Application sent successfully!" });

} catch (error) {

console.error("❌ EMAIL ERROR:", error);

res.status(500).json({ message: "Email failed" });

}

});

/* START SERVER */

app.listen(PORT, () => {
console.log(`🚀 Server running on port ${PORT}`);
});