"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { menuData, MenuItem } from "./menu-data";
import { cn } from "@/lib/utils";
import { useNavbar } from "./navbar-context";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

const leftItems = menuData.filter((item) => item.position === "left");
const rightItems = menuData.filter((item) => item.position === "right");

function NavItems({ items }: { items: MenuItem[] }) {
  const {
    activeMenu,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
  } = useNavbar();

  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          className="relative "
          onMouseEnter={() => item.type !== "link" && handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
          {item.type === "link" ? (
            <Link
              href={item.href || "#"}
              className=" px-3  py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md"
            >
              {item.label}
            </Link>
          ) : (
            <Button
              onClick={() => handleClick(item.id)}
             
                className={
                  activeMenu === item.id ? " !bg-primary !text-primary-foreground" : "bg-background"
                }
                variant="outline"
            >
              {item.label}
              <motion.div
                animate={{ rotate: activeMenu === item.id ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </Button>
          )}
        </div>
      ))}
    </>
  );
}

export function DesktopNavLeft() {
  return (
    <nav className="hidden lg:flex items-center gap-0.5 relative z-[60]">
      <NavItems items={leftItems} />
    </nav>
  );
}

export function DesktopNavRight() {
  return (
    <nav className="hidden lg:flex items-center gap-0.5 relative z-[60]">
      <NavItems items={rightItems} />
    </nav>
  );
}

export function DesktopNav() {
  const {
    activeMenu,
    handleMouseLeave,
    handleContentMouseEnter,
    closeMenu,
    isOpen,
  } = useNavbar();
  
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="menu-container"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1],
            height: { duration: 0.25 },
          }}
          className="absolute left-0 right-0 top-full z-50 bg-background border-b border-border shadow-xl overflow-hidden"
          onMouseEnter={handleContentMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div ref={contentRef}>
            <LayoutGroup>
              <AnimatePresence mode="wait">
                {menuData.map((item) => {
                  if (activeMenu === item.id && item.children) {
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                      >
                        <Container className="py-8">
                          {item.type === "mega" ? (
                            <MegaMenuContent item={item} closeMenu={closeMenu} />
                          ) : (
                            <DropdownContent items={item.children} closeMenu={closeMenu} />
                          )}
                        </Container>
                      </motion.div>
                    );
                  }
                  return null;
                })}
              </AnimatePresence>
            </LayoutGroup>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MegaMenuContent({ item, closeMenu }: { item: MenuItem; closeMenu: () => void }) {
  const isGroupLayout = item.layout === "group";
  const columns = item.columns || (isGroupLayout ? item.children?.length : 3);

  if (isGroupLayout) {
    return (
      <div className="space-y-6 ">
        {item.children?.map((group, groupIndex) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.05, duration: 0.2 }}
          >
            {groupIndex > 0 && <div className="border-t border-border my-4" />}
            <div className="mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </h3>
            </div>
            <div className="grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
              {group.children?.map((child, childIndex) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: groupIndex * 0.05 + childIndex * 0.02,
                    duration: 0.15,
                  }}
                >
                  <MenuLink item={child} closeMenu={closeMenu} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid gap-8 "
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {item.children?.map((column, columnIndex) => (
        <motion.div
          key={column.id}
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: columnIndex * 0.05, duration: 0.2 }}
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
            {column.label}
          </h3>
          <div className="space-y-0.5">
            {column.children?.map((child, childIndex) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: columnIndex * 0.05 + childIndex * 0.02,
                  duration: 0.15,
                }}
              >
                <MenuLink item={child} closeMenu={closeMenu} variant="compact" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function DropdownContent({ items, closeMenu }: { items: MenuItem[]; closeMenu: () => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03, duration: 0.15 }}
        >
          <MenuLink item={item} closeMenu={closeMenu} showDescription />
        </motion.div>
      ))}
    </div>
  );
}

function MenuLink({
  item,
  closeMenu,
  variant = "default",
  showDescription = false,
}: {
  item: MenuItem;
  closeMenu: () => void;
  variant?: "default" | "compact";
  showDescription?: boolean;
}) {
  const Icon = item.icon;
  const isExternal = item.isExternal;

  const linkContent = (
    <span
      className={cn(
        "group flex items-start gap-3 p-3 rounded-lg transition-all duration-150",
        "hover:bg-accent hover:shadow-sm",
        variant === "compact" && "p-2 gap-2"
      )}
    >
      {Icon && (
        <span
          className={cn(
            "flex-shrink-0 p-1.5 rounded-md bg-muted/50 text-muted-foreground",
            "group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-150",
            variant === "compact" && "p-1"
          )}
        >
          <Icon className={cn("w-4 h-4", variant === "compact" && "w-3.5 h-3.5")} />
        </span>
      )}
      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-1.5">
          <span
            className={cn(
              "text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-150",
              variant === "compact" && "text-[13px]"
            )}
          >
            {item.label}
          </span>
          {isExternal && (
            <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
          )}
        </span>
        {showDescription && item.description && (
          <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {item.description}
          </span>
        )}
      </span>
    </span>
  );

  if (isExternal) {
    return (
      <a
        href={item.href || "#"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={closeMenu}
      >
        {linkContent}
      </a>
    );
  }

  return (
    <Link href={item.href || "#"} onClick={closeMenu}>
      {linkContent}
    </Link>
  );
}
