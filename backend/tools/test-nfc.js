#!/usr/bin/env node
// Simple CLI to test NFC UIDs against the backend API
// Usage:
//   node tools/test-nfc.js --uid "1D:A7:86:2A:0D:10:80" --host http://localhost:8000 --amount 50

const http = require("http");
const https = require("https");
const { URL } = require("url");

function normalizeUid(raw) {
  if (!raw) return "";
  return String(raw)
    .replace(/[^a-fA-F0-9]/g, "")
    .toUpperCase();
}

function httpRequest(method, urlStr, headers = {}, body = null) {
  const url = new URL(urlStr);
  const lib = url.protocol === "https:" ? https : http;
  const opts = {
    method,
    hostname: url.hostname,
    port: url.port || (url.protocol === "https:" ? 443 : 80),
    path: url.pathname + (url.search || ""),
    headers,
  };

  return new Promise((resolve, reject) => {
    const req = lib.request(opts, (res) => {
      let data = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const contentType = res.headers["content-type"] || "";
        if (contentType.includes("application/json")) {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (err) {
            resolve({ status: res.statusCode, body: data });
          }
        } else {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on("error", (err) => reject(err));

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

function printUsage() {
  console.log(
    '\nUsage: node tools/test-nfc.js --uid "1D:A7:86:2A:0D:10:80" [--host http://localhost:8000] [--amount 50]'
  );
  console.log("Options:");
  console.log("  --uid     NFC UID (any format, will be normalized)");
  console.log("  --host    Backend base URL (default: http://localhost:8000)");
  console.log("  --amount  Optional numeric amount to POST to /api/scan");
  console.log("  --help    Show this message\n");
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv.includes("--help")) {
    printUsage();
    process.exit(0);
  }

  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--uid") args.uid = argv[++i];
    else if (a === "--host") args.host = argv[++i];
    else if (a === "--amount") args.amount = argv[++i];
    else if (a.startsWith("--uid=")) args.uid = a.split("=")[1];
    else if (a.startsWith("--host=")) args.host = a.split("=")[1];
    else if (a.startsWith("--amount=")) args.amount = a.split("=")[1];
  }

  if (!args.uid) {
    console.error("Error: --uid is required");
    printUsage();
    process.exit(2);
  }

  const host = args.host || "http://localhost:8000";
  const raw = args.uid;
  const uid = normalizeUid(raw);
  if (!uid) {
    console.error("Error: UID normalized to empty string");
    process.exit(2);
  }

  console.log(`Normalized UID: ${uid}`);
  try {
    // GET /api/ndef-url?uid=...
    const ndefUrl = `${host.replace(
      /\/$/,
      ""
    )}/api/ndef-url?uid=${encodeURIComponent(uid)}`;
    console.log(`\nGET ${ndefUrl}`);
    const nresp = await httpRequest("GET", ndefUrl);
    console.log("Status:", nresp.status);
    console.log("Response:", JSON.stringify(nresp.body, null, 2));

    if (args.amount) {
      const amount = parseFloat(String(args.amount));
      if (isNaN(amount)) {
        console.error("Error: amount is not a number");
        process.exit(2);
      }
      // POST /api/scan
      const scanUrl = `${host.replace(/\/$/, "")}/api/scan`;
      const payload = JSON.stringify({ uid, amount });
      console.log(`\nPOST ${scanUrl} -> ${payload}`);
      const presp = await httpRequest(
        "POST",
        scanUrl,
        {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
        payload
      );
      console.log("Status:", presp.status);
      console.log("Response:", JSON.stringify(presp.body, null, 2));
    } else {
      console.log(
        "\nNo amount provided; skipping POST /api/scan. Use --amount to credit points."
      );
    }
  } catch (err) {
    console.error("Request failed:", err.message);
    process.exit(1);
  }
}

if (require.main === module) main();
