import { createContext } from 'react';

function logout() {}
function login(user_id, role) {}

export const AuthContext = createContext({
  role: '',
  logout: logout,
  login: login,
  isAuth: false,
  user_id: 0,
});
