"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/Authcontext";

const ProtectedRoute = ({ children, requiredRoles }: { children: React.ReactNode; requiredRoles: string[] }) => {
  const { token, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      // Si no hay token, redirigir al inicio de sesión
      router.push("/");
    } else if (role && !requiredRoles.includes(role)) {
      // Si el rol no está en los roles requeridos, redirigir a una página de acceso denegado o similar
      router.push("/access-denied");
    }
  }, [token, role, router, requiredRoles]);

  return <>{token && role && requiredRoles.includes(role) ? children : null}</>;
};

export default ProtectedRoute;
