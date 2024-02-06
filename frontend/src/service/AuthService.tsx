// import { useState, useEffect } from 'react';

type User = any; // Define your User type here
type Token = string;

const useSessionStorage = () => {
  const getUser = (): User | null => {
    const user = sessionStorage.getItem('user');
    return user === 'undefined' || !user ? null : JSON.parse(user);
  };

  const getToken = (): Token | null => {
    return sessionStorage.getItem('token');
  };

  const setUserSession = (user: User, token: Token) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('token', token);
  };

  const resetUserSession = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  };

  return {
    getUser,
    getToken,
    setUserSession,
    resetUserSession,
  };
};

export default useSessionStorage;
