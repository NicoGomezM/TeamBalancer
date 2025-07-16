"use client"

import { AuthProvider, useAuth } from "@/contexts/auth-context"
import Login from "@/components/login"
import TeamBalancer from "@/components/team-balancer"

function MainApp() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return <TeamBalancer />;
}

export default function Page() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
