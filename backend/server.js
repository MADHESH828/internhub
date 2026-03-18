const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* EMAIL CONFIGURATION */

const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
user: "tmadhesh07@gmail.com",
pass: "zqda qvvj cxji lnxm"
}
});


/* SAMPLE INTERNSHIPS */

let internships = [

{
id:1,
title:"Frontend Developer Intern",
company:"TechCorp",
companyEmail:"hr@techcorp.com",
location:"San Francisco, CA",
description:"Work on modern web applications using React and TypeScript."
},

{
id:2,
title:"Data Science Intern",
company:"DataFlow Inc",
companyEmail:"hr@dataflow.com",
location:"New York, NY",
description:"Analyze large datasets and build machine learning models."
},

{
id:3,
title:"AI Research Intern",
company:"AI Labs",
companyEmail:"hr@ailabs.com",
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

const { internshipId, name, email } = req.body;

const internship = internships.find(i => i.id == internshipId);

if(!internship){
return res.status(404).json({message:"Internship not found"});
}

const companyEmail = internship.companyEmail;

try{

await transporter.sendMail({

from: "internhub@gmail.com",
to: companyEmail,

subject: "New Internship Application",

text: `
New Application Received

Internship: ${internship.title}

Applicant Name: ${name}
Applicant Email: ${email}

`

});

res.json({message:"Application sent to company"});

}catch(error){

console.error(error);

res.status(500).json({message:"Error sending email"});

}

});


/* START SERVER */

app.listen(PORT,()=>{

console.log(`InternHub API server is running on port ${PORT}`);

});