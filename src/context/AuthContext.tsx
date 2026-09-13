import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StudentProfile, IndustryProfile, AcademicianProfile, UserRole } from '../types';
import { storageService } from '../services/storageService';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole;
  studentProfile?: StudentProfile;
  industryProfile?: IndustryProfile;
  academicianProfile?: AcademicianProfile;
  login: (email: string, role: UserRole) => Promise<boolean>;
  signup: (name: string, email: string, role: UserRole, organization: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  refreshUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => storageService.getCurrentUser());
  const [studentProfile, setStudentProfile] = useState<StudentProfile | undefined>(() =>
    currentUser ? storageService.getStudentProfile(currentUser.id) : undefined
  );
  const [industryProfile, setIndustryProfile] = useState<IndustryProfile | undefined>(() =>
    currentUser ? storageService.getIndustryProfile(currentUser.id) : undefined
  );
  const [academicianProfile, setAcademicianProfile] = useState<AcademicianProfile | undefined>(() =>
    currentUser ? storageService.getAcademicianProfile(currentUser.id) : undefined
  );

  const refreshUserData = () => {
    const user = storageService.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setStudentProfile(storageService.getStudentProfile(user.id) || storageService.getStudentProfiles()[0]);
      setIndustryProfile(storageService.getIndustryProfile(user.id) || storageService.getIndustryProfiles()[0]);
      setAcademicianProfile(storageService.getAcademicianProfile(user.id) || storageService.getAcademicianProfiles()[0]);
    } else {
      setStudentProfile(undefined);
      setIndustryProfile(undefined);
      setAcademicianProfile(undefined);
    }
  };

  useEffect(() => {
    refreshUserData();

    const handleStorageUpdate = () => {
      refreshUserData();
    };

    window.addEventListener('skillbridge_storage_updated', handleStorageUpdate);
    return () => {
      window.removeEventListener('skillbridge_storage_updated', handleStorageUpdate);
    };
  }, []);

  const login = async (email: string, role: UserRole): Promise<boolean> => {
    const users = storageService.getUsers();
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // Find default user of this role or create one
      user = users.find(u => u.role === role) || {
        id: `user-${role}-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role,
        createdAt: new Date().toISOString(),
      };
      storageService.addUser(user);
    }

    storageService.setCurrentUser(user);
    refreshUserData();
    return true;
  };

  const signup = async (name: string, email: string, role: UserRole, organization: string): Promise<boolean> => {
    const newUser: User = {
      id: `user-${role}-${Date.now()}`,
      name,
      email,
      role,
      institutionOrCompany: organization,
      createdAt: new Date().toISOString(),
    };

    storageService.addUser(newUser);

    if (role === 'student') {
      const defaultStudent = storageService.getStudentProfiles()[0];
      storageService.updateStudentProfile({
        ...defaultStudent,
        userId: newUser.id,
        fullName: name,
        email,
        institution: organization,
      });
    } else if (role === 'industry') {
      const defaultInd = storageService.getIndustryProfiles()[0];
      storageService.updateIndustryProfile({
        ...defaultInd,
        userId: newUser.id,
        companyName: organization || name,
        contactEmail: email,
      });
    } else if (role === 'academician') {
      const defaultAcad = storageService.getAcademicianProfiles()[0];
      storageService.updateAcademicianProfile({
        ...defaultAcad,
        userId: newUser.id,
        fullName: name,
        institution: organization,
      });
    }

    storageService.setCurrentUser(newUser);
    refreshUserData();
    return true;
  };

  const logout = () => {
    storageService.setCurrentUser(null);
    refreshUserData();
  };

  const switchRole = (role: UserRole) => {
    const user = storageService.switchUserByRole(role);
    setCurrentUser(user);
    refreshUserData();
  };

  const currentRole: UserRole = currentUser?.role || 'student';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        studentProfile,
        industryProfile,
        academicianProfile,
        login,
        signup,
        logout,
        switchRole,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
