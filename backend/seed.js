/**
 * Seed script: populates the AllowedDomain collection with initial college email domains.
 * Run: node seed.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import AllowedDomain from "./src/models/allowedDomain.model.js";

const SEED_DOMAINS = [
  { domain: "iitb.ac.in", collegeName: "IIT Bombay" },
  { domain: "iitd.ac.in", collegeName: "IIT Delhi" },
  { domain: "iitm.ac.in", collegeName: "IIT Madras" },
  { domain: "iitkgp.ac.in", collegeName: "IIT Kharagpur" },
  { domain: "iitk.ac.in", collegeName: "IIT Kanpur" },
  { domain: "iitg.ac.in", collegeName: "IIT Guwahati" },
  { domain: "bits-pilani.ac.in", collegeName: "BITS Pilani" },
  { domain: "pilani.bits-pilani.ac.in", collegeName: "BITS Pilani - Pilani Campus" },
  { domain: "goa.bits-pilani.ac.in", collegeName: "BITS Pilani - Goa Campus" },
  { domain: "hyderabad.bits-pilani.ac.in", collegeName: "BITS Pilani - Hyderabad Campus" },
  { domain: "nitt.edu", collegeName: "NIT Trichy" },
  { domain: "nitk.edu.in", collegeName: "NIT Karnataka" },
  { domain: "mnit.ac.in", collegeName: "MNIT Jaipur" },
  { domain: "vit.ac.in", collegeName: "VIT Vellore" },
  { domain: "manipal.edu", collegeName: "Manipal Institute of Technology" },
  { domain: "srmist.edu.in", collegeName: "SRM Institute of Science and Technology" },
  { domain: "christuniversity.in", collegeName: "Christ University" },
  { domain: "du.ac.in", collegeName: "Delhi University" },
  { domain: "iimb.ac.in", collegeName: "IIM Bangalore" },
  { domain: "iima.ac.in", collegeName: "IIM Ahmedabad" },
  // Add more as needed — admin panel allows adding via UI
];

const seed = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is required in environment variables.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  let inserted = 0;
  let skipped = 0;

  for (const domainData of SEED_DOMAINS) {
    try {
      await AllowedDomain.updateOne(
        { domain: domainData.domain },
        { $setOnInsert: { ...domainData, isActive: true } },
        { upsert: true }
      );
      inserted++;
    } catch {
      skipped++;
    }
  }

  console.log(`✓ Seeded ${inserted} domains (${skipped} skipped as duplicates)`);
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
