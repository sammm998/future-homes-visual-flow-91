// Retired. Use Cloud invitations and password recovery instead.
Deno.serve(() => Response.json({ error: 'Endpoint retired' }, { status: 410 }));