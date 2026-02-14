"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

type NavbarContextType = {
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
  handleMouseEnter: (id: string) => void;
  handleMouseLeave: () => void;
  handleContentMouseEnter: () => void;
  handleClick: (id: string) => void;
  closeMenu: () => void;
  isOpen: boolean;
};

const NavbarContext = createContext<NavbarContextType | null>(null);

export function NavbarProvider({ children }: { children: React.ReactNode }) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback((id: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMenu(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 15);
  }, []);

  const handleContentMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleClick = useCallback((id: string) => {
    setActiveMenu((prev) => (prev === id ? null : id));
  }, []);

  const closeMenu = useCallback(() => {
    setActiveMenu(null);
  }, []);

  const isOpen = activeMenu !== null;

  return (
    <NavbarContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        handleMouseEnter,
        handleMouseLeave,
        handleContentMouseEnter,
        handleClick,
        closeMenu,
        isOpen,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbar must be used within NavbarProvider");
  }
  return context;
}
