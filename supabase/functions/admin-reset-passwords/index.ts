// Retired. Password changes require the account's recovery session.
Deno.serve(() => Response.json({ error: 'Endpoint retired' }, { status: 410 }));