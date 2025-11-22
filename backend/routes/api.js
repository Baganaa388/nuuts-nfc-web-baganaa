// routes/api.js — ESP32 / Gateway API endpoints

const {
  getUserByUID,
  getLastScan,
  insertScan,
  insertTransactionAndUpdateTotal
} = require("../db");

function baseUrl(req) {
  return `${req.protocol}://${req.get("host")}`;
}

// POST /api/scan
// ESP32 эндээс дуудна: { "uid": "04:A1:BC:..." , "amount": 0 эсвэл байхгүй }
function postScan(req, res) {
  const raw = (req.body && req.body.uid) || "";
  const uid = String(raw).trim().toUpperCase();

  if (!uid) {
    return res.status(400).json({ status: "bad", message: "no uid" });
  }

  // scan log хадгална
  insertScan(uid);

  const user = getUserByUID(uid);
  const b = baseUrl(req);

  // Хэрэв amount ирсэн бол (жишээ нь машин дээрээс оноо нэмэх)
  let amountNote;
  let addedAmount = 0;
  if (Object.prototype.hasOwnProperty.call(req.body, "amount")) {
    const amount = parseFloat(String(req.body.amount));
    if (user && amount > 0) {
      insertTransactionAndUpdateTotal(user.id, amount);
      addedAmount = amount;
    } else {
      amountNote = "amount ignored (no user linked or amt<=0)";
    }
  }

  // ХЭРЭВ ХЭРЭГЛЭГЧ БҮРТГЭЛГҮЙ БОЛ
  if (!user) {
    return res.json({
      status: "register",                 // ← ESP32 үүнийг харж register URL бичнэ
      uid,
      linked: false,
      registerUrl: `${b}/register?uid=${encodeURIComponent(uid)}`,
      note: amountNote
    });
  }

  // ХЭРЭВ ХЭРЭГЛЭГЧ БАЙГАА БОЛ
  return res.json({
    status: "ok",                         // ← ESP32 үүнийг харж main URL бичнэ
    uid,
    linked: true,
    userId: user.id,
    profileUrl: `${b}/u/${user.id}`,      // хэрэгтэй бол front талд ашиглаж болно
    amount: addedAmount || undefined,
    note: amountNote
  });
}

// GET /api/last-scan
function getLastScanApi(req, res) {
  const row = getLastScan();
  if (!row) return res.json({ uid: null });
  const uid = row.uid;
  const user = getUserByUID(uid);
  const obj = { uid };
  if (user) {
    obj.user = {
      id: user.id,
      name: user.name,
      nickname: user.nickname
    };
  }
  res.json(obj);
}

// GET /api/ndef-url?uid=...
// (хэрвээ web талд хэрэглэх бол хэвээр нь үлдээнэ)
function getNdefUrl(req, res) {
  const raw = (req.query.uid || "").toString().trim().toUpperCase();
  if (!raw) {
    return res.status(400).json({ status: "bad", message: "no uid" });
  }
  const user = getUserByUID(raw);
  const b = baseUrl(req);

  if (user) {
    return res.json({
      status: "ok",
      exists: true,
      uid: raw,
      url: `${b}/u/${user.id}`
    });
  }
  return res.json({
    status: "ok",
    exists: false,
    uid: raw,
    registerUrl: `${b}/register?uid=${encodeURIComponent(raw)}`
  });
}

module.exports = {
  postScan,
  getLastScanApi,
  getNdefUrl
};
