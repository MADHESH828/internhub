const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* =========================
   RESEND SETUP
========================= */
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ FIXED: Using verified Resend account email
const VERIFIED_EMAIL = process.env.VERIFIED_EMAIL || "24l159@psgitech.ac.in";

/* =========================
   SAMPLE DATA
========================= */
let internships = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechCorp",
    companyEmail: "internhub07@gmail.com",
    location: "Remote",
    description: "Work on React and UI",
  },
  {
    id: 2,
    title: "Data Science Intern",
    company: "DataFlow",
    companyEmail: "internhub07@gmail.com",
    location: "Bangalore",
    description: "Work with ML models",
  },
];

/* =========================
   ROUTES
========================= */
app.get("/", (req, res) => {
  res.send("InternHub API is running 🚀");
});

app.get("/internships", (req, res) => {
  res.json(internships);
});

app.post("/internships", (req, res) => {
  const { title, company, companyEmail, location, description } = req.body;

  if (!title || !company || !companyEmail || !location) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const newInternship = {
    id: Date.now(),
    title,
    company,
    companyEmail,
    location,
    description,
  };

  internships.push(newInternship);
  res.json(newInternship);
});

/* =========================
   APPLY ROUTE (EMAIL)
========================= */
app.post("/apply", async (req, res) => {
  console.log("🔥 APPLY API HIT");
  console.log("📦 Request body:", req.body);

  const { internshipId, name, email } = req.body;

  if (!internshipId || !name || !email) {
    return res.status(400).json({ message: "Missing required fields!" });
  }

  const internship = internships.find((i) => i.id == internshipId);

  if (!internship) {
    return res.status(404).json({ message: "Internship not found!" });
  }

  try {
    console.log("📩 Sending email via Resend...");
    console.log("📬 Sending to:", VERIFIED_EMAIL);

    const emailResult = await resend.emails.send({
      from: "InternHub <onboarding@resend.dev>",
      to: VERIFIED_EMAIL, // ✅ 24l159@psgitech.ac.in — verified account email
      subject: `New Application for "${internship.title}" at ${internship.company}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 12px;">
          
          <h2 style="color: #5a7cff; margin-bottom: 5px;">📋 New Internship Application</h2>
          <p style="color: #888; font-size: 13px; margin-bottom: 20px;">Received via InternHub Platform</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin-bottom: 20px;"/>
          
          <h3 style="color: #333; margin-bottom: 10px;">🏢 Internship Details</h3>
          <p><strong>Role:</strong> ${internship.title}</p>
          <p><strong>Company:</strong> ${internship.company}</p>
          <p><strong>Location:</strong> ${internship.location}</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
          
          <h3 style="color: #333; margin-bottom: 10px;">👤 Applicant Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
          
          <p style="color: #aaa; font-size: 12px; text-align: center;">© 2026 InternHub — Connecting Students with Opportunities</p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully:", emailResult);
    res.json({ message: "Application sent successfully!" });

  } catch (error) {
    console.error("❌ EMAIL ERROR:", error?.message || error);
    res.status(500).json({
      message: "Email sending failed!",
      error: error?.message || "Unknown error",
    });
  }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Emails will be sent to: ${VERIFIED_EMAIL}`);
});