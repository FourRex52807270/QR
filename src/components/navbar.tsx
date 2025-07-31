import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../Context/AuthContext";

export default function Navbar() {
  const { user, isLoggedIn, logOut } = useAuthContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate()
  const Login = async (e: any) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <nav  className="bg-[#C19AB7] w-screen h-16 flex items-center justify-between px-4 text-black relative z-10">
      <span className="text-xl font-semibold" onClick={()=>navigate("/")}>Thrash Credit</span>
            <span>TRC:0.0000{user?.bal}</span>

      {isLoggedIn ? (
        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2"
          >
            <img
            referrerPolicy="no-referrer"
            loading="lazy"
              className="rounded-full w-12 h-12 border-2 border-white"
              src={user?.pfpUrl}
              alt="Profile"
            />
            <span className="hidden md:block font-medium">{user?.username}</span>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-28 py-2 text-center z-50">
              <button
                onClick={() => {
                  logOut();
                  setMenuOpen(false);
                }}
                className="w-full text-sm px-4 py-2 hover:bg-red-100 text-red-600"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          className="bg-[#228CDB] text-white px-4 py-2 rounded-md hover:scale-105 transition"
          onClick={Login}
        >
          Login
        </button>
      )}
    </nav>
  );
}
