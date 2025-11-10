// routes_public.js — Public pages
const {
  getLeaderboardRows,
  getUserFullById,
  getTotalByUserId,
  createUserWithUid,
  getUserByUID
} = require("./db");
const { layoutPublic } = require("./layouts");

// GET /
function getIndex(req, res) {
  const rows = getLeaderboardRows();

  if (!rows.length) {
    const body = `
    <div class="board">
      <div class="board-header">
        <div>
          <div class="board-title">Ranger уудийн жагсаалт</div>
          <div class="board-sub">Одоогоор гүйлгээ хийгдээгүй байна.</div>
        </div>
        <div class="chip">Waiting for first NFC tap</div>
      </div>
      <div class="table-wrap">
        <div class="empty">
          Эхний NFC гүйлгээг хийхэд leaderboard автоматаар гарч ирнэ.
        </div>
      </div>
    </div>`;
    return res.send(layoutPublic(body));
  }

  let html = `
  <div class="board">
    <div class="board-header">
      <div>
        <div class="board-title">LIVE SCOREBOARD</div>
        <div class="board-sub">
          Зөвхөн хэрэглэгчийн хоч (эсвэл нэр) + нийт хөнгөлөлтийн дүн.
        </div>
      </div>
      <div class="chip">
        <span>Players: ${rows.length}</span>
      </div>
    </div>
    <div class="table-wrap">
      <div class="row head">
        <div>#</div>
        <div>Player</div>
        <div>Total (₮)</div>
      </div>`;

  rows.forEach((r, idx) => {
    const rank = idx + 1;
    const label = r.label || `Player ${r.id}`;
    const total = r.total.toLocaleString("en-US");

    let cls = "";
    if (rank === 1) cls = " gold";
    else if (rank === 2) cls = " silver";
    else if (rank === 3) cls = " bronze";
    else if (rank === 4) cls = " r4";
    else if (rank === 5) cls = " r5";

    html += `
      <div class="row${cls}">
        <div class="rank">#${rank}</div>
        <div class="name">${label}</div>
        <div class="amt">${total}</div>
      </div>`;
  });

  html += `
    </div>
  </div>`;

  res.send(layoutPublic(html));
}


// GET /u/:id
function getProfile(req, res) {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.redirect("/");
  const user = getUserFullById(id);
  if (!user) return res.redirect("/");

  const t = getTotalByUserId(id);
  const total = t ? t.total.toLocaleString("en-US") : "0";
  const label =
    (user.nickname && user.nickname.trim()) || user.name || `Player ${id}`;

  const body = `
  <div class="hero">
    <div class="hero-title">${label}</div>
    <div class="hero-sub">Нийт хөнгөлөлт: <strong>${total} ₮</strong></div>
    <p class="hero-sub">ID: ${user.id}${
    user.profession ? " · " + user.profession : ""
  }</p>
    <p class="hero-sub"><a href="/">← Leaderboard руу буцах</a></p>
  </div>`;
  res.send(layoutPublic(body, `${label} · Profile`));
}

// GET /register
function getRegister(req, res) {
  const uid = (req.query.uid || "").toString().toUpperCase();
  const exists = uid ? getUserByUID(uid) : null;
  const msg = exists
    ? "Энэ NFC аль хэдийн нэг хэрэглэгчтэй холбогдсон байна."
    : uid
    ? "Энэ NFC-г өөртэйгөө холбож бүртгүүлэх боломжтой. Бүртгэл хийсний дараа writer-аар дахин уншуул."
    : "NFC UID параметрээр ирвэл автоматаар бөглөгдөнө.";

  const body = `
  <div class="hero">
    <div class="hero-title">NFC бүртгэл</div>
    <div class="hero-sub">${msg}</div>
    <form method="post" action="/register">
      <input type="hidden" name="uid" value="${uid}">
      <p style="margin-top:10px;font-size:12px;color:#9ca3af;">
        NFC UID: <strong>${uid || "(одоогоор тодорхойгүй)"} </strong>
      </p>
      <p><input name="name" placeholder="Нэр" required style="width:100%;padding:8px;border-radius:8px;border:1px solid #374151;background:#020817;color:#e5e7eb;"></p>
      <p><input name="nickname" placeholder="Хоч (optional)" style="width:100%;padding:8px;border-radius:8px;border:1px solid #374151;background:#020817;color:#e5e7eb;"></p>
      <p><input name="profession" placeholder="Мэргэжил (optional)" style="width:100%;padding:8px;border-radius:8px;border:1px solid #374151;background:#020817;color:#e5e7eb;"></p>
      <button type="submit" style="margin-top:4px;width:100%;padding:9px;border-radius:999px;border:none;background:#38bdf8;color:#020817;font-weight:600;cursor:pointer;">
        Бүртгүүлэх
      </button>
    </form>
    <p style="margin-top:6px;font-size:11px;color:#9ca3af;text-align:center;">
      Бүртгэлийн дараа NFC writer-аар UID-гаа дахин уншуулж profile линк бичүүлнэ.
    </p>
  </div>`;
  res.send(layoutPublic(body, "Register NFC"));
}

// POST /register
function postRegister(req, res) {
  const uid = (req.body.uid || "").toString().toUpperCase().trim();
  const name = (req.body.name || "").toString().trim();
  const nickname = (req.body.nickname || "").toString().trim();
  const profession = (req.body.profession || "").toString().trim();

  if (!name) {
    return res.send(
      layoutPublic(
        `<div class="hero"><p>Нэр шаардлагатай.</p>
         <p><a href="/register${
           uid ? "?uid=" + encodeURIComponent(uid) : ""
         }">Буцах</a></p></div>`,
        "Register NFC"
      )
    );
  }

  const userId = createUserWithUid({
    name,
    nickname,
    profession,
    uid
  });

  const body = `
  <div class="hero">
    <div class="hero-title">Бүртгэл амжилттай</div>
    <div class="hero-sub">Таны хэрэглэгч үүсгэлээ.</div>
    <p class="hero-sub">
      NFC writer-аар UID уншуулбал профайл линк бичигдэнэ.
    </p>
    <p style="margin-top:8px;"><a href="/u/${userId}">Миний профайлыг харах</a></p>
    <p><a href="/">Leaderboard руу буцах</a></p>
  </div>`;
  res.send(layoutPublic(body, "Registered"));
}

// GET /r/:uid — NFC direct resolve
function getResolveUID(req, res) {
  const raw = (req.params.uid || "").toString().trim().toUpperCase();
  if (!raw) return res.redirect("/");
  const user = getUserByUID(raw);
  if (user) return res.redirect(`/u/${user.id}`);
  return res.redirect(`/register?uid=${encodeURIComponent(raw)}`);
}

function registerPublicRoutes(app) {
  app.get("/", getIndex);
  app.get("/u/:id", getProfile);
  app.get("/register", getRegister);
  app.post("/register", postRegister);
  app.get("/r/:uid", getResolveUID);
}

module.exports = { registerPublicRoutes };
