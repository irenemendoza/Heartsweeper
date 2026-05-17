const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function error(message, status = 400) {
  return json({ error: message }, status);
}

async function handlePostScore(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return error("Invalid JSON");
  }

  const { player_name, time_ms, rows, cols, difficulty } = body;

  // Validaciones
  if (typeof player_name !== "string" || player_name.length > 20) {
    return error("player_name must be 20 characters or fewer");
  }
  if (!Number.isInteger(time_ms) || time_ms < 500 || time_ms > 3_600_000) {
    return error("time_ms must be an integer between 500ms and 1 hour");
  }
  if (!Number.isInteger(rows) || rows < 2 || rows > 50) {
    return error("rows out of range");
  }
  if (!Number.isInteger(cols) || cols < 2 || cols > 50) {
    return error("cols out of range");
  }
  if (!["1", "2", "3"].includes(difficulty)) {
    return error("difficulty must be 1, 2 or 3");
  }

  await env.DB.prepare(
    `INSERT INTO rankings (player_name, time_ms, rows, cols, difficulty, created_at)
     VALUES (?, ?, ?, ?, ?, datetime('now'))`
  )
    .bind(player_name.trim() || "Anonymus", time_ms, rows, cols, difficulty)
    .run();

  return json({ success: true }, 201);
}

async function handleGetScores(request, env) {
  const url = new URL(request.url);
  const rows = parseInt(url.searchParams.get("rows"));
  const cols = parseInt(url.searchParams.get("cols"));
  const difficulty = url.searchParams.get("difficulty");

  if (!rows || !cols || !difficulty) {
    return error("rows, cols and difficulty are required query params");
  }

  const { results } = await env.DB.prepare(
    `SELECT player_name, time_ms, created_at
     FROM rankings
     WHERE rows = ? AND cols = ? AND difficulty = ?
     ORDER BY time_ms ASC
     LIMIT 5`
  )
    .bind(rows, cols, difficulty)
    .all();

  return json(results);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Preflight CORS
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (url.pathname === "/api/scores") {
      if (request.method === "POST") return handlePostScore(request, env);
      if (request.method === "GET") return handleGetScores(request, env);
    }

    return error("Not found", 404);
  },
};
