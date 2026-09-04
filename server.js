require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mongoose Schema & Model
const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  segment: { type: String, required: true },
  investment: { type: String, required: true },
  dmatAccount: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
});

const FormSubmission = mongoose.model("FormSubmission", formSchema);

// API Route for Form Submission
app.post("/api/submit", async (req, res) => {
  try {
    const { name, email, phone, segment, investment, dmatAccount } = req.body;

    if (!name || !email || !phone || !segment || !investment || !dmatAccount) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newSubmission = new FormSubmission({
      name,
      email,
      phone,
      segment,
      investment,
      dmatAccount,
    });

    await newSubmission.save();

    return res.status(200).json({ success: true, message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error saving form submission:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// API Route to Fetch All Submissions
app.get("/api/submissions", async (req, res) => {
  try {
    const submissions = await FormSubmission.find().sort({ submittedAt: -1 });
    return res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
