import React from "react";
import { useAuth } from "../hooks/useAuth";

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authenticated = useAuth();
  if (authenticated === null) {
    return <div>Loading...</div>; // Show a loading state while checking auth
  }

  return authenticated ? <>{children}</> : null;
};

export default RequireAuth;
