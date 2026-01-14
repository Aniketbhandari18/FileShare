import HomePage from "@/components/pages/HomePage";
import { auth } from "@/lib/auth";

export default async function Home() {
  const { userId, email, role } = await auth();

  console.log("userId:", userId);
  console.log("email:", email);
  console.log("role:", role);

  return <HomePage />;
}
