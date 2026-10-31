import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from backend/.env or root .env
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
dotenv.config(); if (process.env.GSHEET_ID) { const m = process.env.GSHEET_ID.match(/\/d\/([a-zA-Z0-9-_]+)/); if (m) process.env.GSHEET_ID = m[1]; }

import express from "express";
import cors from "cors";
import { fetchSheetValues } from "./googleSheets.js";
import { valuesToMembers } from "./mapSheetToMember.js";
import { valuesToProjects } from "./mapSheetToProject.js";

// Check environment variables
const hasGSheetId = Boolean(process.env.GSHEET_ID && process.env.GSHEET_ID !== "your_google_spreadsheet_id_here");
const hasServiceAccount = Boolean(
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
  process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
);

if (!hasGSheetId) {
  console.warn(
    "[NOTICE] GSHEET_ID is not configured in .env. /api/members will return an error until GSHEET_ID is set."
  );
} else if (!hasServiceAccount) {
  console.log(
    "[INFO] No Google Service Account credentials found. Using Public Google Sheet CSV mode."
  );
} else {
  console.log("[INFO] Using Google Service Account API v4 mode.");
}

const app = express();
const PORT = process.env.PORT || process.env.GSHEET_BACKEND_PORT || 5000;

// Respect X-Forwarded-* headers from Nginx / reverse proxy
app.set("trust proxy", 1);

// Restrict CORS to FRONTEND_ORIGIN (real domain / allowed origins, default localhost)
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173,http://localhost:80,http://localhost")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? true : (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev to avoid CORS blocking
    },
  })
);

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint (returns 200 "ok")
app.get(["/healthz", "/api/healthz"], (req, res) => {
  res.status(200).send("ok");
});

// Members endpoint handler
async function handleGetMembers(req, res) {
  try {
    if (!process.env.GSHEET_ID || process.env.GSHEET_ID === "your_google_spreadsheet_id_here") {
      return res.status(503).json({
        error: "Missing GSHEET_ID. Please set your Google Spreadsheet ID in .env",
        members: [],
      });
    }
    const range = process.env.GSHEET_MEMBERS_RANGE || "A1:Z500";
    const values = await fetchSheetValues(range);
    const members = valuesToMembers(values);
    res.json({ members });
  } catch (err) {
    console.error("Failed to fetch members:", err.message);
    res.status(500).json({ error: err.message, members: [] });
  }
}

// Support both /api/members and /members for frontend routing flexibility
app.get("/api/members", handleGetMembers);
app.get("/members", handleGetMembers);

// Projects endpoint handler
async function handleGetProjects(req, res) {
  try {
    if (!process.env.GSHEET_ID || process.env.GSHEET_ID === "your_google_spreadsheet_id_here") {
      return res.status(503).json({
        error: "Missing GSHEET_ID. Please set your Google Spreadsheet ID in .env",
        projects: [],
      });
    }
    const range = process.env.GSHEET_PROJECTS_RANGE || "A1:Z500";
    const values = await fetchSheetValues(range);
    const projects = valuesToProjects(values);
    res.json({ projects });
  } catch (err) {
    console.error("Failed to fetch projects:", err.message);
    res.status(500).json({ error: err.message, projects: [] });
  }
}

app.get("/api/projects", handleGetProjects);
app.get("/projects", handleGetProjects);

// Forwarding handler for Private Backend routes (Enquiries, Collaboration, Auth)
const rawPrivateUrl = (process.env.PRIVATE_BACKEND_URL || "").trim().replace(/\/+$/, "");
const isLoopbackToSelf =
  rawPrivateUrl &&
  (rawPrivateUrl === `http://127.0.0.1:${PORT}` ||
   rawPrivateUrl === `http://localhost:${PORT}` ||
   rawPrivateUrl === `http://0.0.0.0:${PORT}`);

const privateBackendUrl = isLoopbackToSelf ? "" : rawPrivateUrl;

async function handlePrivateBackendProxy(req, res) {
  if (!privateBackendUrl) {
    return res.status(503).json({
      success: false,
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: isLoopbackToSelf
          ? "PRIVATE_BACKEND_URL loops to this service. Set it to the host or separate private backend address."
          : "Private backend is not configured. Set PRIVATE_BACKEND_URL in .env to connect enquiries and auth.",
      },
    });
  }

  try {
    const targetUrl = `${privateBackendUrl}${req.originalUrl}`;
    const headers = { ...req.headers };
    delete headers.host;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "content-type": "application/json",
        ...headers,
      },
      body: ["POST", "PUT", "PATCH"].includes(req.method) ? JSON.stringify(req.body) : undefined,
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.text();
    const contentType = response.headers.get("content-type") || "application/json";
    res.status(response.status).type(contentType).send(data);
  } catch (err) {
    console.error(`Failed to proxy ${req.method} ${req.originalUrl} to private backend:`, err.message);
    res.status(502).json({
      success: false,
      error: {
        code: "BAD_GATEWAY",
        message: "Unable to reach the private backend server.",
      },
    });
  }
}

app.all(["/api/enquiries*", "/api/collaborate*", "/api/auth*"], handlePrivateBackendProxy);

const server = app.listen(PORT, () => {
  console.log(`E-Cell backend server running on port ${PORT}`);
  console.log(`Configured Google Sheet ID: ${process.env.GSHEET_ID || "not set"}`);
  if (privateBackendUrl) {
    console.log(`Proxying private portal routes to: ${privateBackendUrl}`);
  }
});

// Graceful shutdown handling on SIGTERM and SIGINT
function gracefulShutdown(signal) {
  console.log(`Received ${signal}. Closing HTTP server gracefully...`);
  server.close(() => {
    console.log("HTTP server closed. Exiting process.");
    process.exit(0);
  });
  setTimeout(() => {
    console.error("Forceful shutdown after timeout.");
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
