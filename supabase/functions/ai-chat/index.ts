// Retired: the site redirects visitors to the external AI service.
Deno.serve(() => Response.json({ error: 'Endpoint retired' }, { status: 410 }));