"use client"

import { useAuth } from "@/contexts/auth-context"
import Login from "@/components/login"
import TeamBalancer from "@/components/team-balancer"

export default function Page() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return <TeamBalancer />;
}
