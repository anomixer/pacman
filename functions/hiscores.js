
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method === "GET") {
    const highScores = await env.HISCORES.get("scores");
    if (highScores === null) {
      return new Response(JSON.stringify([10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000]), {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(highScores, {
      headers: { "Content-Type": "application/json" },
    });
  } else if (request.method === "POST") {
    const highScores = await request.text();
    await env.HISCORES.put("scores", highScores);
    return new Response("Scores updated successfully", {
      status: 200,
    });
  }

  return new Response("Method not allowed", {
    status: 405,
  });
}
