let internships = [];
let selectedInternshipId = null;

const API_URL = "https://internhub-lhsr.onrender.com";

/* =========================
   TOAST NOTIFICATION
========================= */
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast toast-${type}`;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3500);
}

/* =========================
   CREATE CARD
========================= */
function createCard(internship) {
  return `
    <div class="internship-card">
      <h3>${internship.title}</h3>
      <div class="company">🏢 ${internship.company}</div>
      <div class="location">📍 ${internship.location}</div>
      <p>${internship.description}</p>
      <button class="apply-btn" onclick="openApply(${internship.id})">Apply Now</button>
    </div>
  `;
}

/* =========================
   RENDER INTERNSHIPS
========================= */
function renderInternships(data) {
  const grid = document.getElementById("internshipGrid");
  const loading = document.getElementById("loadingText");

  if (loading) loading.remove();

  if (data.length === 0) {
    grid.innerHTML = `<p style="color:white; text-align:center;">No internships found.</p>`;
    return;
  }

  grid.innerHTML = data.map(createCard).join("");
}

/* =========================
   FETCH INTERNSHIPS
========================= */
async function fetchInternships() {
  try {
    const response = await fetch(`${API_URL}/internships`);
    const data = await response.json();
    internships = data;
    renderInternships(internships);
  } catch (error) {
    console.error("❌ Error fetching internships:", error);
    document.getElementById("internshipGrid").innerHTML =
      `<p style="color:white; text-align:center;">Failed to load internships. Try again later.</p>`;
  }
}

/* =========================
   SEARCH
========================= */
function searchInternships() {
  const term = document.getElementById("searchInput").value.toLowerCase().trim();

  if (!term) {
    renderInternships(internships);
    return;
  }

  const filtered = internships.filter(
    (job) =>
      job.title.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term) ||
      job.location.toLowerCase().includes(term)
  );

  renderInternships(filtered);
}

/* =========================
   POST INTERNSHIP
========================= */
document.getElementById("internshipForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const newInternship = {
    title: document.getElementById("title").value.trim(),
    company: document.getElementById("company").value.trim(),
    companyEmail: document.getElementById("companyEmail").value.trim(),
    location: document.getElementById("location").value.trim(),
    description: document.getElementById("description").value.trim(),
  };

  try {
    const response = await fetch(`${API_URL}/internships`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newInternship),
    });

    if (!response.ok) throw new Error("Failed to post");

    showToast("✅ Internship posted successfully!");
    this.reset();
    fetchInternships();
  } catch (error) {
    console.error("❌ Error posting internship:", error);
    showToast("❌ Failed to post internship!", "error");
  }
});

/* =========================
   OPEN APPLY POPUP
========================= */
function openApply(id) {
  selectedInternshipId = id;
  console.log("📌 Selected Internship ID:", id);
  document.getElementById("applyForm").reset();
  document.getElementById("resumeFileName").textContent = "No file chosen";
  document.getElementById("applyPopup").style.display = "flex";
}

/* =========================
   CLOSE APPLY POPUP
========================= */
function closeApply() {
  document.getElementById("applyPopup").style.display = "none";
  selectedInternshipId = null;
}

// Close popup if clicking outside
document.getElementById("applyPopup").addEventListener("click", function (e) {
  if (e.target === this) closeApply();
});

/* =========================
   RESUME FILE NAME DISPLAY
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const resumeInput = document.getElementById("resume");
  if (resumeInput) {
    resumeInput.addEventListener("change", function () {
      const fileName = this.files[0] ? this.files[0].name : "No file chosen";
      document.getElementById("resumeFileName").textContent = fileName;
    });
  }
});

/* =========================
   APPLY SUBMIT — FormData (for file upload)
========================= */
document.getElementById("applyForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("applicantName").value.trim();
  const email = document.getElementById("applicantEmail").value.trim();
  const resumeFile = document.getElementById("resume").files[0];

  if (!name || !email || !selectedInternshipId) {
    showToast("⚠️ Please fill all fields!", "error");
    return;
  }

  if (!resumeFile) {
    showToast("⚠️ Please upload your resume PDF!", "error");
    return;
  }

  if (resumeFile.type !== "application/pdf") {
    showToast("⚠️ Only PDF files are allowed!", "error");
    return;
  }

  console.log("📩 Applying with:", { name, email, selectedInternshipId, resume: resumeFile.name });

  const submitBtn = this.querySelector("button[type='submit']");
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  try {
    // ✅ FormData use pannrom — file + text rendu um send aagum
    const formData = new FormData();
    formData.append("internshipId", selectedInternshipId);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("resume", resumeFile);

    const response = await fetch(`${API_URL}/apply`, {
      method: "POST",
      // ⚠️ Content-Type header set pannathey — browser auto set pannuvom with boundary
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong!");
    }

    showToast("✅ Application submitted! Resume sent via email 📬");
    closeApply();
  } catch (error) {
    console.error("❌ Error submitting application:", error);
    showToast(`❌ ${error.message || "Something went wrong!"}`, "error");
  } finally {
    submitBtn.textContent = "Submit Application";
    submitBtn.disabled = false;
  }
});

/* =========================
   LOAD ON START
========================= */
document.addEventListener("DOMContentLoaded", () => {
  fetchInternships();
  document.getElementById("searchBtn").addEventListener("click", searchInternships);
  document.getElementById("searchInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchInternships();
  });
});
