"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavbar } from "./navbar-context";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function NavbarOverlay() {
  const { isOpen, closeMenu } = useNavbar();
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

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
          className="fixed inset-0 top-0 z-40 bg-black/20 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}
    </AnimatePresence>,
    document.body,
  );
}
