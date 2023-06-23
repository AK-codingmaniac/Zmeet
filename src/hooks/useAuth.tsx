import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../app/utils/FirebaseConfig";
import { setUser } from "../app/slices/AuthSlice";

function useAuth() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (!currentUser) navigate("/login");
      else {
        dispatch(
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName,
          })
        );
      }
    });
    return () => unsubscribe();
  }, [dispatch, navigate]);
}

export default useAuth;
