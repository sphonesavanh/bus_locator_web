import { useEffect } from "react";

const Signup = () => {
  useEffect(() => {
    document.title = "Signup | Bus Tracking System";
  }, []);
  return (
    <>
      <h1>Sign up page</h1>
    </>
  );
};

export default Signup;
