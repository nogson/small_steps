import { useEffect } from "react";
import { useUser } from "../context/UserContext";

const ExamplePage: React.FC = () => {
  const { user } = useUser();

  useEffect(() => {
    // This effect runs when the component mounts
    console.log("User in ExamplePage:", user);
  }, [user]); // Dependency array to run effect when user changes

  return (
    <div>
      <h1>Welcome {user?.email}</h1>
    </div>
  );
};

export default ExamplePage;
