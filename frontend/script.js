let internships = [];

const API_URL = "https://internhub-lhsr.onrender.com";

let selectedInternshipId = null;


/* CREATE CARD */

function createCard(internship){

return `
<div class="internship-card">

<h3>${internship.title}</h3>

<div class="company">${internship.company}</div>

<div class="location">${internship.location}</div>

<p>${internship.description}</p>

<button class="apply-btn" onclick="openApply(${internship.id})">Apply</button>

</div>
`;

}


/* RENDER INTERNSHIPS */

function renderInternships(data){

const grid = document.getElementById("internshipGrid");

grid.innerHTML = data.map(createCard).join("");

}


/* FETCH INTERNSHIPS */

async function fetchInternships(){

try{

const response = await fetch(`${API_URL}/internships`);
const data = await response.json();

internships = data;

renderInternships(internships);

}catch(error){

console.error("❌ Error fetching internships:", error);

}

}


/* SEARCH */

function searchInternships(){

const term = document.getElementById("searchInput").value.toLowerCase();

const filtered = internships.filter(job =>

job.title.toLowerCase().includes(term) ||
job.company.toLowerCase().includes(term) ||
job.location.toLowerCase().includes(term)

);

renderInternships(filtered);

}


/* POST INTERNSHIP */

document.getElementById("internshipForm")
.addEventListener("submit", async function(e){

e.preventDefault();

const newInternship = {

title: document.getElementById("title").value,
company: document.getElementById("company").value,
companyEmail: document.getElementById("companyEmail").value,
location: document.getElementById("location").value,
description: document.getElementById("description").value

};

try{

await fetch(`${API_URL}/internships`,{

method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify(newInternship)

});

alert("✅ Internship posted successfully!");

fetchInternships();

}catch(error){

console.error("❌ Error posting internship:", error);

}

});


/* OPEN APPLY POPUP */

function openApply(id){

selectedInternshipId = id;

console.log("📌 Selected Internship ID:", id); // DEBUG

document.getElementById("applyPopup").style.display = "block";

}


/* CLOSE APPLY POPUP */

function closeApply(){

document.getElementById("applyPopup").style.display = "none";

}


/* APPLY SUBMIT */

document.getElementById("applyForm")
.addEventListener("submit", async function(e){

e.preventDefault();

const name = document.getElementById("applicantName").value;
const email = document.getElementById("applicantEmail").value;

console.log("📩 Applying with:", { name, email, selectedInternshipId }); // DEBUG

try{

const response = await fetch(`${API_URL}/apply`,{

method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({
internshipId: selectedInternshipId,
name: name,
email: email
})

});

const data = await response.json();

alert(data.message || "Application submitted successfully!");

closeApply();

}catch(error){

console.error("❌ Error submitting application:", error);

alert("Something went wrong!");

}

});


/* LOAD */

document.addEventListener("DOMContentLoaded",()=>{

fetchInternships();

document.getElementById("searchBtn")
.addEventListener("click",searchInternships);

});