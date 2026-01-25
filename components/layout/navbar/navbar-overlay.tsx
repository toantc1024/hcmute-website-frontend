"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavbar } from "./navbar-context";

export function NavbarOverlay() {
  const { isOpen, closeMenu } = useNavbar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={closeMenu}
          className="fixed inset-0 top-16 z-40 backdrop-blur-sm"
     
          aria-hidden="true"
        />
      )}
    </AnimatePresence>,
    document.body
  );
}
