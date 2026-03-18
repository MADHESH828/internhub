const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* RESEND CONFIG */

const resend = new Resend("re_T4R8SggV_JhDSGvrAeafdbuJHJyH2SZqm");

/* INTERNSHIPS */

let internships = [

{
id:1,
title:"Frontend Developer Intern",
company:"TechCorp",
companyEmail:"tmadhesh07@gmail.com",
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

console.log("📩 Sending email...");

await resend.emails.send({

from: "onboarding@resend.dev",

// 🔥 IMPORTANT CHANGE HERE
to: ["tmadhesh07@gmail.com"],

subject: "TEST EMAIL (InternHub)",

html: `
<h2>🔥 TEST SUCCESS</h2>
<p>If you see this → EMAIL WORKING</p>

<hr>

<p><b>Name:</b> ${name}</p>
<p><b>Email:</b> ${email}</p>
`

});

console.log("✅ Email sent successfully");

res.json({ message: "Application sent!" });

} catch (error) {

console.error("❌ ERROR:", error);

res.status(500).json({ message: "Email failed" });

}

});

/* START */

app.listen(PORT, () => {
console.log(`🚀 Server running on port ${PORT}`);
});