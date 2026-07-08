import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();

  const hasSession = cookieStore.get(
    "csrf_refresh_token"
  );

  if (hasSession) {
    redirect("/dashboard");
  }

  redirect("/login");
}