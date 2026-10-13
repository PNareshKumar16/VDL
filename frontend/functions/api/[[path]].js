// Cloudflare Pages Function: Proxy all /api/* requests to Render backend
// This eliminates CORS entirely - browser calls same-origin, CF proxies to Render

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Forward to Render backend
  const targetUrl = `https://vdl-tre7.onrender.com${url.pathname}${url.search}`;

  // Copy headers but strip host/origin to avoid issues
  const headers = new Headers(request.headers);
  headers.set('Host', 'vdl-tre7.onrender.com');
  headers.delete('CF-Connecting-IP');
  headers.delete('CF-RAY');

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'follow',
    });

    // Return the backend response directly to the browser
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Backend unreachable', detail: err.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
