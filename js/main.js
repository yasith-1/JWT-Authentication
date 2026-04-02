
/* ── SIMULATOR STEPS ── */
const STEPS = [
    {
        badge: 'OVERVIEW', bc: 'bd-blue', title: 'JWT Authentication — Hotel POS System',
        desc: '"Play All" ඔබලා JWT flow step-by-step animate වෙනවා. හෝ Next / Back use කරන්න.',
        hi: [], pkt: null, dir: null, jwt: false, cst: '', sst: '', dst: '', dbx: false, scb: false
    },
    {
        badge: 'STEP 1', bc: 'bd-blue', title: '1. Login Request — Credentials Server-ට POST',
        desc: 'Cashier POST /api/auth/login request. <strong>username + password</strong> backend-ට. Token මෙහිදී නෑ.',
        hi: ['nc', 'ns'], pkt: 'p-login', dir: 'r', jwt: false, cst: 'Sending credentials…', sst: 'Receiving…', dst: '', dbx: false, scb: false
    },
    {
        badge: 'STEP 2', bc: 'bd-red', title: '2. Database Validate (Login-ලදී ONLY!)',
        desc: 'Server <strong>Database query</strong> — credentials valid ද? ⚠ JWT-ල DB hit = login step-ලදී <strong>පමණයි</strong>. ඉන් පසු DB query නෑ.',
        hi: ['ns', 'nd'], pkt: 'p-db', dir: 'r2', jwt: false, cst: '', sst: 'Querying DB…', dst: 'SELECT user…', dbx: false, scb: false
    },
    {
        badge: 'STEP 3', bc: 'bd-green', title: '3. JWT Create + Return (Secret Key-ල Sign)',
        desc: 'Valid user: <strong>generateAccessToken(userId, role)</strong>. Secret Key-ල HMAC-SHA256 sign. <strong>Payload Base64 readable</strong> — passwords, card numbers දාන්නේ නෑ!',
        hi: ['ns', 'nc'], pkt: 'p-ret', dir: 'l', jwt: true, cst: 'JWT in memory 🔐', sst: 'Signed & returned', dst: '', dbx: false, scb: false
    },
    {
        badge: 'STEP 4', bc: 'bd-orange', title: '4. API Request — Authorization: Bearer JWT',
        desc: '<strong>Authorization: Bearer [token]</strong> header-ල. JwtAuthFilter intercept + <strong>Signature verify. Database query නෑ!</strong> ඕනෑ server-ලා verify.',
        hi: ['nc', 'ns'], pkt: 'p-api', dir: 'r', jwt: true, cst: 'Bearer token sent →', sst: 'JwtAuthFilter…', dst: '', dbx: true, scb: false
    },
    {
        badge: 'STEP 5', bc: 'bd-purple', title: '5. Stateless — Any of 3 Servers, No DB!',
        desc: 'Secret Key-ල Signature verify — <strong>Database query නෑ!</strong> Server 1, 2, 3 ඕනෑ එකක් verify. <strong>Horizontally scalable!</strong> Session-based-ල Redis ඕන — JWT-ල නෑ.',
        hi: ['ns'], pkt: 'p-ver', dir: 'r2', jwt: true, cst: '✓ Access Granted', sst: '✓ Signature verified', dst: '', dbx: true, scb: true
    }
];

let cur = 0, playing = false;
const $ = id => document.getElementById(id);

function animPkt(id, dir) {
    return new Promise(res => {
        if (!id) { res(); return; }
        const p = $(id);
        p.style.animation = 'none'; p.style.opacity = '0';
        void p.offsetWidth;
        if (dir === 'r') { p.style.setProperty('--tv', 'calc(100% + 300px)'); p.style.left = '0'; p.style.right = 'auto'; p.classList.add('ar'); }
        else if (dir === 'l') { p.style.setProperty('--tv', '-130%'); p.style.right = '0'; p.style.left = 'auto'; p.classList.add('al'); }
        else { p.style.setProperty('--tv', 'calc(67% + 200px)'); p.style.left = '33%'; p.style.right = 'auto'; p.classList.add('ar'); }
        setTimeout(() => { p.classList.remove('ar', 'al'); p.style.opacity = '0'; res(); }, 2050);
    });
}

function applyStep(s) {
    ['nc', 'ns', 'nd'].forEach(id => { const n = $(id); if (n) n.classList.remove('hi'); });
    s.hi.forEach(id => { const n = $(id); if (n) n.classList.add('hi'); });
    $('sbadge').textContent = s.badge; $('sbadge').className = 'sbadge ' + s.bc;
    $('stitle').textContent = s.title; $('sdesc').innerHTML = s.desc;
    const cst = $('nc-st'), sst = $('ns-st'), dst = $('nd-st');
    if (cst) cst.textContent = s.cst;
    if (sst) { sst.textContent = s.sst; sst.style.color = s.dbx ? 'var(--orange)' : 'var(--green)'; }
    if (dst) dst.textContent = s.dst;
    const dbx = $('db-x'); if (dbx) dbx.style.display = s.dbx ? 'flex' : 'none';
    const scb = $('sc-badge'); if (scb) scb.style.display = s.scb ? 'block' : 'none';
    const jb = $('jwt-box'); if (jb) jb.classList.toggle('vis', s.jwt);
    document.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.remove('active', 'done');
        if (i === cur) d.classList.add('active'); else if (i < cur) d.classList.add('done');
    });
    $('b-prev').disabled = cur === 0 || playing;
    $('b-next').disabled = cur === STEPS.length - 1 || playing;
    $('b-play').disabled = playing;
}

function gS(n) { if (playing) return; cur = n; applyStep(STEPS[cur]); animPkt(STEPS[cur].pkt, STEPS[cur].dir); }
function nxt() { if (cur < STEPS.length - 1) { cur++; gS(cur); } }
function prev() { if (cur > 0) { cur--; gS(cur); } }

async function playAll() {
    if (playing) return;
    playing = true; cur = 0;
    $('running').style.display = 'inline';
    $('b-play').disabled = true; $('b-prev').disabled = true; $('b-next').disabled = true;
    for (let i = 0; i < STEPS.length; i++) {
        cur = i; applyStep(STEPS[i]);
        if (STEPS[i].pkt) await animPkt(STEPS[i].pkt, STEPS[i].dir);
        await new Promise(r => setTimeout(r, 700));
    }
    playing = false; $('running').style.display = 'none';
    $('b-play').disabled = false; $('b-prev').disabled = cur === 0; $('b-next').disabled = cur === STEPS.length - 1;
}

applyStep(STEPS[0]);

/* ── CODE TABS ── */
function showTab(paneId, tabEl) {
    const panel = tabEl.parentElement.nextElementSibling;
    panel.querySelectorAll('.code-pane').forEach(p => p.classList.remove('active'));
    const t = document.getElementById(paneId); if (t) t.classList.add('active');
    tabEl.parentElement.querySelectorAll('.ctab').forEach(t => t.classList.remove('active'));
    tabEl.classList.add('active');
}

function showTabGrp(paneId, grpId, tabEl) {
    const panel = document.getElementById(grpId);
    if (panel) { panel.querySelectorAll('.code-pane').forEach(p => p.classList.remove('active')); }
    const t = document.getElementById(paneId); if (t) t.classList.add('active');
    tabEl.parentElement.querySelectorAll('.ctab').forEach(t => t.classList.remove('active'));
    tabEl.classList.add('active');
}

/* ── COPY ── */
function copyCode(id, btn) {
    const el = document.getElementById(id); if (!el) return;
    navigator.clipboard.writeText(el.innerText).then(() => {
        btn.textContent = 'Copied!'; btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
    });
}

/* ── ACCESS TOKEN TIMER ── */
let atPct = 100;
const atBar = $('at-bar'), atVal = $('at-val');
setInterval(() => {
    atPct = Math.max(0, atPct - 0.045);
    if (atBar) atBar.style.width = atPct + '%';
    if (atVal) {
        const s = Math.round(atPct * 9), m = Math.floor(s / 60), sec = s % 60;
        atVal.textContent = `${m}:${sec.toString().padStart(2, '0')} remaining`;
        if (atPct < 25) { atBar.style.background = 'linear-gradient(90deg,#f87171,#fb923c)'; atVal.style.color = 'var(--red)'; }
        if (atPct <= 0) {
            atVal.textContent = '⚠ Expired! Using Refresh Token…';
            setTimeout(() => {
                atPct = 100;
                atBar.style.background = 'linear-gradient(90deg,#34d399,#4f9cf9)';
                atVal.style.color = 'var(--green)';
            }, 2000);
        }
    }
}, 120);