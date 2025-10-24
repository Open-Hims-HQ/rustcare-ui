// Catch-all route for .well-known requests (like Chrome DevTools)
// Returns 404 silently without logging errors

export function loader() {
  return new Response(null, { status: 404 });
}
