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
        case "user":
          router.push("/dashboard/user");
          break;
        case "guest":
          router.push("/dashboard/guest");
          break;
        default:
          router.push("/");
      }
    } else if (status === "unauthenticated") {
      router.push("/authentification/signin");
    }
  }, [status, session, router]);

  return <p>Loading...</p>;  // Ajoutez un indicateur de chargement si nécessaire
}