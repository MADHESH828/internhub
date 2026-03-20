const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* =========================
   MULTER SETUP
========================= */
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".pdf") {
      return cb(new Error("Only PDF files are allowed!"));
    }
    cb(null, true);
  },
});

/* =========================
   RESEND SETUP
========================= */
const resend = new Resend(process.env.RESEND_API_KEY);

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
   APPLY ROUTE
========================= */
app.post("/apply", upload.single("resume"), async (req, res) => {
  console.log("🔥 APPLY API HIT");
  console.log("📦 Body:", req.body);
  console.log("📎 File:", req.file ? req.file.originalname : "No file");

  const { internshipId, name, email } = req.body;

  if (!internshipId || !name || !email) {
    return res.status(400).json({ message: "Missing required fields!" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Resume PDF is required!" });
  }

  const internship = internships.find((i) => i.id == internshipId);

  if (!internship) {
    return res.status(404).json({ message: "Internship not found!" });
  }

  try {
    console.log("📩 Sending email with resume attachment...");

    const emailResult = await resend.emails.send({
      from: "InternHub <onboarding@resend.dev>",
      to: VERIFIED_EMAIL,
      subject: `New Application for "${internship.title}" at ${internship.company}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px;border:1px solid #eee;border-radius:12px;">
          <h2 style="color:#5a7cff;">📋 New Internship Application</h2>
          <p style="color:#888;font-size:13px;">Received via InternHub Platform</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;"/>
          <h3 style="color:#333;">🏢 Internship Details</h3>
          <p><strong>Role:</strong> ${internship.title}</p>
          <p><strong>Company:</strong> ${internship.company}</p>
          <p><strong>Location:</strong> ${internship.location}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;"/>
          <h3 style="color:#333;">👤 Applicant Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;"/>
          <p style="color:#555;font-size:14px;">📎 Resume attached as PDF below.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;"/>
          <p style="color:#aaa;font-size:12px;text-align:center;">© 2026 InternHub — Connecting Students with Opportunities</p>
        </div>
      `,
      attachments: [
        {
          filename: `${name.replace(/\s+/g, "_")}_Resume.pdf`,
          content: req.file.buffer.toString("base64"),
        },
      ],
    });

    console.log("✅ Email sent:", emailResult);
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