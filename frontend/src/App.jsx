import { Route,Routes,Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import useAuthStore from "./stores/useAuthStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";


function App() {
  const {user,fetchProfile,fetchingProfile} = useAuthStore();

  useEffect (()=>{
    fetchProfile();
    console.log(user);
  },[fetchProfile]);
  if(fetchingProfile) return <LoadingSpinner/>;

  return (
   <div>
    <Navbar/>
      <Routes>
      <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />}></Route>
      <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />}></Route>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />}></Route>
      </Routes>
      <Toaster/>
   </div>
  );
}

export default App
