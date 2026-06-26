exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "" };
  if (!isAdmin(event)) return json(401, { error: "Unauthorized" });

  const { label } = JSON.parse(event.body || "{}");
  if (!label) return json(400, { error: "Missing label" });

  const code = generateCode();
  const sb = supabase();

  const r = await sb("access_codes", {
    method: "POST",
    body: JSON.stringify({ code, label: label.trim(), active: true }),
  });
  if (!r.ok) return json(500, { error: await r.text() });

  return json(200, await r.json());
};

function generateCode() {
  const adjs  = ["BLUE","RED","GOLD","SWIFT","BOLD","CALM","WISE","KEEN","BRIGHT","JADE"];
  const nouns = ["TIGER","EAGLE","RIVER","STONE","STAR","MOON","WIND","WAVE","FOX","PINE"];
  const adj  = adjs[Math.floor(Math.random() * adjs.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num  = Math.floor(1000 + Math.random() * 9000);
  return `${adj}-${noun}-${num}`;
}

function isAdmin(event) {
  return event.headers["x-admin-key"] === process.env.ADMIN_KEY;
}

function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  return (path, options = {}) =>
    fetch(`${url}/rest/v1/${path}`, {
      ...options,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
        ...(options.headers || {}),
      },
    });
}

function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}
