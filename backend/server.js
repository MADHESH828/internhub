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


app.post("/internships",(req,res)=>{

const newInternship = {

id:internships.length+1,
title:req.body.title,
company:req.body.company,
location:req.body.location,
description:req.body.description

};

internships.push(newInternship);

res.json(newInternship);

});


app.listen(PORT,()=>{

console.log(`InternHub API server is running on port ${PORT}`);

});