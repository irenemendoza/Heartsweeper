const API_URL = "https://heartsweeper-api.mendozagonzalez-irene.workers.dev";

export async function saveScore({ rows, cols, difficulty, playerName, time_ms }) {
    const response = await fetch(`${API_URL}/api/scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows, cols, difficulty, player_name: playerName, time_ms }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
}

export async function getTopScores({ rows, cols, difficulty }) {
    const response = await fetch(
        `${API_URL}/api/scores?rows=${rows}&cols=${cols}&difficulty=${difficulty}`
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
}