const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* EMAIL CONFIGURATION (FIXED FOR RENDER) */

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,              // ✅ FIXED
  secure: false,          // ✅ IMPORTANT
  auth: {
    user: "tmadhesh07@gmail.com",
    pass: "zqdaqvvjcxjilnxm"
  },
  tls: {
    rejectUnauthorized: false
  }
});

/* VERIFY EMAIL CONFIG */

transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ Transporter Error:", error);
  } else {
    console.log("✅ Email server is ready");
  }
});

/* SAMPLE INTERNSHIPS */

let internships = [

{
id:1,
title:"Frontend Developer Intern",
company:"TechCorp",
companyEmail:"internhub07@gmail.com",   // ✅ changed for testing
location:"San Francisco, CA",
description:"Work on modern web applications using React and TypeScript."
},

{
id:2,
title:"Data Science Intern",
company:"DataFlow Inc",
companyEmail:"internhub07@gmail.com",
location:"New York, NY",
description:"Analyze large datasets and build machine learning models."
},

{
id:3,
title:"AI Research Intern",
company:"AI Labs",
companyEmail:"internhub07@gmail.com",
location:"Boston, MA",
description:"Research and develop cutting-edge AI algorithms."
}

];

/* ROOT */

app.get("/",(req,res)=>{
  res.send("InternHub API is running");
});

/* GET INTERNSHIPS */

app.get("/internships",(req,res)=>{
  res.json(internships);
});

/* POST INTERNSHIP */

app.post("/internships",(req,res)=>{

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

const { Resend } = require("resend");

const resend = new Resend("re_T4R8SggV_JhDSGvrAeafdbuJHJyH2SZqm");


/* APPLY FOR INTERNSHIP */

app.post("/apply", async (req, res) => {

  const { internshipId, name, email } = req.body;

  const internship = internships.find(i => i.id == internshipId);

  if (!internship) {
    return res.status(404).json({ message: "Internship not found" });
  }

  try {

    console.log("📩 Sending email via Resend...");

    await resend.emails.send({
      from: "onboarding@resend.dev",   // default sender
      to: "tmadhesh07@gmail.com",      // 🔥 TEST with your mail first
      subject: "New Internship Application",
      html: `
        <h2>New Application Received</h2>
        <p><strong>Internship:</strong> ${internship.title}</p>
        <p><strong>Company:</strong> ${internship.company}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
      `
    });

    console.log("✅ Email sent via Resend");

    res.json({ message: "Application sent successfully!" });

  } catch (error) {

    console.error("❌ Resend Error:", error);

    res.status(500).json({ message: "Email failed" });

  }

});

/* START SERVER */

app.listen(PORT,()=>{
console.log(`🚀 InternHub API server is running on port ${PORT}`);
});