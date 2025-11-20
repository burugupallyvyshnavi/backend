import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI);
await client.connect();
const db = client.db("aruhDB");
const leads = db.collection("leads");

// API route
app.post("/api/submit", async (req, res) => {
  try {
    const doc = {
      ...req.body,
      submittedAt: new Date()
    };

    const result = await leads.insertOne(doc);

    res.json({
      success: true,
      message: "Form submitted successfully",
      id: result.insertedId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Backend running on port " + PORT));

