export async function loader() {
  // Redirect favicon requests to the logo
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/logo.png",
    },
  });
}
