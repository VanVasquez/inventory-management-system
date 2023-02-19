import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function PrivateRoutes({ children, roles = [], ...rest }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    const storedData = localStorage.getItem("user");
    if (storedData) setUser(JSON.parse(storedData));
    setLoading(false);
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) return <Navigate to="/login" />;
  if (roles.length && !roles.includes(user.user_role))
    return <Navigate to="/login" />;
  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoutes;
