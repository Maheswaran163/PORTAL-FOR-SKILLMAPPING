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
      setStudentProfile(storageService.getStudentProfile(user.id));
      setIndustryProfile(storageService.getIndustryProfile(user.id));
      setAcademicianProfile(storageService.getAcademicianProfile(user.id));
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

  /**
   * Login: strictly matches by email.
   * Returns false if no matching account found.
   */
  const login = async (email: string, _role: UserRole): Promise<boolean> => {
    const users = storageService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return false;
    }

    storageService.setCurrentUser(user);
    refreshUserData();
    return true;
  };

  /**
   * Signup: creates a brand new user with a blank profile.
   * Does NOT copy from any mock/seed profile.
   */
  const signup = async (name: string, email: string, role: UserRole, organization: string): Promise<boolean> => {
    const users = storageService.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists. Please sign in.');
    }

    const newUser: User = {
      id: `user-${role}-${Date.now()}`,
      name,
      email,
      role,
      institutionOrCompany: organization,
      createdAt: new Date().toISOString(),
    };

    storageService.addUser(newUser);

    // Create a fresh, minimal profile — do NOT copy seed data
    if (role === 'student') {
      storageService.updateStudentProfile({
        userId: newUser.id,
        fullName: name,
        email,
        institution: organization,
        branch: '',
        year: '1st Year',
        bio: '',
        skills: [],
        portfolioProjects: [],
        certifications: [],
        targetRoles: [],
        linkedinUrl: '',
        githubUrl: '',
      });
    } else if (role === 'industry') {
      storageService.updateIndustryProfile({
        userId: newUser.id,
        companyName: organization || name,
        contactEmail: email,
        industryType: '',
        description: '',
        website: '',
        location: '',
        verified: false,
      });
    } else if (role === 'academician') {
      storageService.updateAcademicianProfile({
        userId: newUser.id,
        fullName: name,
        institution: organization,
        department: '',
        designation: '',
        bio: '',
        researchAreas: [],
        experienceYears: 0,
        publicationsCount: 0,
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
