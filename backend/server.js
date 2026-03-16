const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

let internships = [

{
id:1,
title:"Frontend Developer Intern",
company:"TechCorp",
location:"San Francisco, CA",
description:"Work on modern web applications using React and TypeScript."
},

{
id:2,
title:"Data Science Intern",
company:"DataFlow Inc",
location:"New York, NY",
description:"Analyze large datasets and build machine learning models."
},

{
id:3,
title:"AI Research Intern",
company:"AI Labs",
location:"Boston, MA",
description:"Research and develop cutting-edge AI algorithms."
}

];


app.get("/",(req,res)=>{
res.send("InternHub API is running");
});


app.get("/internships",(req,res)=>{
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

internships.push(newInternship);

res.json(newInternship);

});


app.listen(PORT,()=>{

console.log(`InternHub API server is running on port ${PORT}`);

});
app.post("/apply", (req, res) => {

const { internshipId, name, email } = req.body;

const internship = internships.find(i => i.id == internshipId);

if(!internship){

return res.status(404).json({ message: "Internship not found" });

}

const companyEmail = internship.companyEmail;

console.log("New Application");

console.log("Internship:", internship.title);
console.log("Applicant Name:", name);
console.log("Applicant Email:", email);
console.log("Send application to:", companyEmail);

res.json({ message: "Application received successfully" });

});