const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* RESEND CONFIG */

const resend = new Resend("re_T4R8SggV_JhDSGvrAeafdbuJHJyH2SZqm"); // 🔥 paste your key

/* SAMPLE INTERNSHIPS */

let internships = [

{
id:1,
title:"Frontend Developer Intern",
company:"TechCorp",
companyEmail:"tmadhesh07@gmail.com",   // ✅ for testing
location:"San Francisco, CA",
description:"Work on modern web applications using React and TypeScript."
},

{
id:2,
title:"Data Science Intern",
company:"DataFlow Inc",
companyEmail:"tmadhesh07@gmail.com",
location:"New York, NY",
description:"Analyze large datasets and build machine learning models."
},

{
id:3,
title:"AI Research Intern",
company:"AI Labs",
companyEmail:"tmadhesh07@gmail.com",
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

/* APPLY FOR INTERNSHIP */

app.post("/apply", async (req,res)=>{

console.log("🔥 APPLY API HIT");

const { internshipId, name, email } = req.body;

const internship = internships.find(i => i.id == internshipId);

if(!internship){
return res.status(404).json({message:"Internship not found"});
}

try{

console.log("📩 Sending email via Resend...");

await resend.emails.send({
from: "onboarding@resend.dev",   // default sender
to: "tmadhesh07@gmail.com",      // ✅ send to yourself first
subject: "New Internship Application",
html: `
<h2>New Application Received</h2>
<p><b>Internship:</b> ${internship.title}</p>
<p><b>Company:</b> ${internship.company}</p>
<p><b>Name:</b> ${name}</p>
<p><b>Email:</b> ${email}</p>
`
});

console.log("✅ Email sent successfully");

res.json({message:"Application sent successfully!"});

}catch(error){

console.error("❌ EMAIL ERROR:", error);

res.status(500).json({message:"Email failed"});

}

});

/* START SERVER */

app.listen(PORT,()=>{
console.log(`🚀 InternHub API server is running on port ${PORT}`);
});