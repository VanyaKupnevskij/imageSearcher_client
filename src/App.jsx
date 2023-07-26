import { Navigate, Route, Routes } from 'react-router-dom';
import './App.scss';
import 'materialize-css';

import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import ImagesPage from './pages/Images';
import CreateImagePage from './pages/CreateImage';
import ProfilePage from './pages/Profile';

import { AuthContext } from './context/context';
import { useEffect, useState } from 'react';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole] = useState(null);
  const [user_id, setUser_id] = useState(0);

  useEffect(() => {
    setIsAuth(Number(localStorage.getItem('user_id')) !== 0);
    setUser_id(Number(localStorage.getItem('user_id')));
    setRole(localStorage.getItem('role'));
  }, []);

  function logout() {
    localStorage.setItem('user_id', 0);
    localStorage.setItem('role', 0);

    setIsAuth(false);
    setUser_id(0);
    setRole(null);
  }

  function login(user_id, role) {
    localStorage.setItem('user_id', user_id);
    localStorage.setItem('role', role);

    setIsAuth(Number(user_id) !== 0);
    setUser_id(user_id);
    setRole(role);
  }

  return (
    <div className="App">
      <AuthContext.Provider
        value={{
          role,
          isAuth,
          logout,
          user_id,
          login,
        }}>
        {isAuth === true ? (
          role === 'creator' ? (
            <Routes>
              <Route index exact path="/images" element={<ImagesPage />} />
              <Route index exact path="/profile" element={<ProfilePage />} />
              <Route strict exact path="/image/create" element={<CreateImagePage />} />

              <Route path="*" element={<Navigate to="/images" />} />
            </Routes>
          ) : (
            <Routes>
              <Route strict exact path="/images" element={<ImagesPage />} />
              <Route index exact path="/profile" element={<ProfilePage />} />

              <Route path="*" element={<Navigate to="/images" />} />
            </Routes>
          )
        ) : (
          <Routes>
            <Route strict exact path="/images" element={<ImagesPage />} />
            <Route strict exact path="/login" element={<LoginPage />} />
            <Route strict exact path="/signup" element={<SignupPage />} />

            <Route path="*" element={<Navigate to="/images" />} />
          </Routes>
        )}
      </AuthContext.Provider>
    </div>
  );
}

export default App;
