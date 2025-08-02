import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import supabase from "../client";


/*export default function ProtectedRoute({ children }){

}*/
function ProtectedRoute({ children }) {
  const [session, setSession] = useState();
  const [isSessionChecked, setIsSessionChecked] = useState(false);

  useEffect(() => {
    // Check session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(() => session ?? null);
      setIsSessionChecked(() => true);
    });

    // Listen for changes to auth session
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(() => session ?? null);
    });

    // Cleanup listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (!isSessionChecked) {
    return <div>Loading...</div>;
  } else {
    return <>{session ? children : <Navigate to="/login" />}</>;
  }
}

export default ProtectedRoute;
