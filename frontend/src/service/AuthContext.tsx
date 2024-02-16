import React, { createContext, useContext, ReactNode, useState } from 'react';


interface User {
    id: string;
    role: UserRole;
  }
  
  enum UserRole {
    Admin = "admin",
    SAdmin = "sAdmin",
    Examiner = "examiner",
    Finance = "Finance",
  }

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};