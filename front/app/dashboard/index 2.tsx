import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      switch (session?.user?.role) {
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "member":
          router.push("/dashboard/member");
          break;
        case "moderator":
          router.push("/dashboard/moderator");
          break;
        default:
          router.push("/dashboard");
      }
    } else if (status === "unauthenticated") {
      router.push("/authentification/signin");
    }
  }, [status, session, router]);

  return <p>Loading...</p>;  
}