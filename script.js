let internships = [];


function createCard(internship){

return `
<div class="internship-card">

<h3>${internship.title}</h3>

<div class="company">${internship.company}</div>

<div class="location">${internship.location}</div>

<p>${internship.description}</p>

<button class="apply-btn">Apply</button>

</div>
`;

}


function renderInternships(data){

const grid = document.getElementById("internshipGrid");

grid.innerHTML = data.map(createCard).join("");

}


async function fetchInternships(){

const response = await fetch("http://localhost:5000/internships");

const data = await response.json();

internships = data;

renderInternships(internships);

}


function searchInternships(){

const term = document.getElementById("searchInput").value.toLowerCase();

const filtered = internships.filter(job =>

job.title.toLowerCase().includes(term) ||
job.company.toLowerCase().includes(term) ||
job.location.toLowerCase().includes(term)

);

renderInternships(filtered);

}


document.getElementById("internshipForm")
.addEventListener("submit", async function(e){

e.preventDefault();

const newInternship = {

title: document.getElementById("title").value,
company: document.getElementById("company").value,
location: document.getElementById("location").value,
description: document.getElementById("description").value

};

await fetch("http://localhost:5000/internships",{

method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify(newInternship)

});

fetchInternships();

});


document.addEventListener("DOMContentLoaded",()=>{

fetchInternships();

document.getElementById("searchBtn")
.addEventListener("click",searchInternships);

});