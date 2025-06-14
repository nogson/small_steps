import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSessionUser } from "../api/auth";
import { useUser } from "../context/UserContext";

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const checkAuth = async () => {
      const userInfo = await getSessionUser();

      setUser(userInfo);
      setAuthenticated(userInfo !== null);
      if (!userInfo) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  return authenticated;
};
