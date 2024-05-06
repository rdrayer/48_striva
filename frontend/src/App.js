import React , { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useLocalStorage from './useLocalStorage'
import './App.css';
import StrivaApi from "./api";
import Home from "./Home";
import NavBar from "./NavBar";
import { jwtDecode } from 'jwt-decode';
import Login from "./Login";
import SignUp from "./SignUp";
import Profile from "./Profile";
import ActivitiesList from "./ActivitiesList"
import CreateActivity from "./CreateActivity";
import ActivityDetail from "./ActivityDetail";

export const UserContext = createContext();

function App() {
  const [token, setToken] = useLocalStorage('strivaToken');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwtDecode(token);
          StrivaApi.token = token;
          let currentUser = await StrivaApi.getCurrentUser(username);
          setCurrentUser(currentUser);
          console.log("user is logged in");
        }
        catch (error) {
        setCurrentUser(null);
        console.error("user is NOT logged in", error)
        }
      }
    }
    getCurrentUser();
  }, [token]);

  async function login(loginData) {
    const token = await StrivaApi.login(loginData);
    setToken(token);
  }

  async function signup(signupData) {
    const token = await StrivaApi.signup(signupData);
    setToken(token);
  }

  function logout() {
    setToken(null);
    setCurrentUser(null);
  }

  return (
    <div className="App">
      <UserContext.Provider value={{ currentUser, logout }}>
        <BrowserRouter>
          <NavBar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login login={login} />} />
              <Route path="/signup" element={<SignUp signup={signup} />} />
              <Route path="/users/:username" element={<Profile />} />
              <Route path="/activities/:username" element={<ActivitiesList />}/>
              <Route path="/activities/:id" element={<ActivityDetail />}/>
              <Route path="/activities/:username/new" element={<CreateActivity />}/>
              <Route element={<p>Hmm, I can't seem to find the page you're looking for.</p>} />
            </Routes>     
          </main>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;

