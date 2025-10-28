import { redirect } from "@remix-run/node";

export async function loader() {
  return redirect("/landing");
}

export default function Index() {
  return null;
}
