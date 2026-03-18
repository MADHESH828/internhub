const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* ✅ RESEND SETUP */

const resend = new Resend(process.env.RESEND_API_KEY);

/* SAMPLE DATA */

let internships = [
{
id: 1,
title: "Frontend Developer Intern",
company: "TechCorp",
companyEmail: "internhub07@gmail.com",
location: "Remote",
description: "Work on React"
}
];

/* ROUTES */

app.get("/", (req, res) => {
res.send("InternHub API is running");
});

app.get("/internships", (req, res) => {
res.json(internships);
});

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

/* 🚀 APPLY ROUTE */

app.post("/apply", async (req, res) => {

console.log("🔥 APPLY API HIT");

const { internshipId, name, email } = req.body;

const internship = internships.find(i => i.id == internshipId);

if (!internship) {
return res.status(404).json({ message: "Internship not found" });
}

try {

console.log("📩 Sending email via Resend...");

await resend.emails.send({
from: "InternHub <onboarding@resend.dev>",   // keep this for now
to: internship.companyEmail,
subject: "New Internship Application",
html: `
<h2>New Application</h2>

<p><strong>Internship:</strong> ${internship.title}</p>

<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
`
});

console.log("✅ Email sent successfully");

res.json({ message: "Application sent!" });

} catch (error) {

console.error("❌ EMAIL ERROR:", error);

res.status(500).json({ message: "Email failed" });

}

});

app.listen(PORT, () => {
console.log(`🚀 Server running on port ${PORT}`);
});