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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
const leftItems = menuData.filter((item) => item.position === "left");
const rightItems = menuData.filter((item) => item.position === "right");

function NavItems({ items }: { items: MenuItem[] }) {
  const { activeMenu, handleMouseEnter, handleMouseLeave, handleClick } =
    useNavbar();
  
  const router = useRouter();

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
            <Button
              variant="ute"
               className={cn(
                "uppercase font-extrabold hover:text-primary-foreground",
                activeMenu === item.id
                  ? " !bg-primary !text-primary-foreground"
                  : "bg-transparent",
              )}
              onClick={() => router.push(item.href || "#")}
            >
              <span className="font-inter-black">{item.label}</span>
            </Button>
          ) : (
            <Button
              variant="ute"
              onClick={() => handleClick(item.id)}
              className={cn(
                "uppercase font-extrabold",
                activeMenu === item.id
                  ? " !bg-primary !text-primary-foreground"
                  : "bg-transparent",
              )}
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
          className="absolute left-0 right-0 top-full z-50 bg-background border-b border-border shadow-xl"
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
                        <Container className="py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                          {item.type === "mega" ? (
                            <MegaMenuContent
                              item={item}
                              closeMenu={closeMenu}
                            />
                          ) : (
                            <DropdownContent
                              items={item.children}
                              closeMenu={closeMenu}
                            />
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

function MegaMenuContent({
  item,
  closeMenu,
}: {
  item: MenuItem;
  closeMenu: () => void;
}) {
  const isGroupLayout = item.layout === "group";
  const columns = item.columns || 3;

  if (isGroupLayout) {
    return (
      <div className="flex flex-col">
        {item.children?.map((group, groupIndex) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.05, duration: 0.2 }}
          >
            {groupIndex > 0 && <Separator className="my-5" />}
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-primary  uppercase">
                {group.label}
              </h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {group.children?.map((child, childIndex) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: groupIndex * 0.03 + childIndex * 0.015,
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
      className="grid gap-8"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {item.children?.map((column, columnIndex) => (
        <motion.div
          key={column.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: columnIndex * 0.05, duration: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <h3 className="text-lg font-semibold text-primary  uppercase">
              {column.label}
            </h3>
          </div>
          <div className="flex flex-col gap-0.5">
            {column.children?.map((child, childIndex) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: columnIndex * 0.03 + childIndex * 0.02,
                  duration: 0.15,
                }}
              >
                <MenuLink
                  item={child}
                  closeMenu={closeMenu}
                  variant="compact"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function DropdownContent({
  items,
  closeMenu,
}: {
  items: MenuItem[];
  closeMenu: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.02, duration: 0.15 }}
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

  const defaultContent = (
    <span
      className={cn(
        "group inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
        "",
      )}
    >
      {Icon && (
        <span className="flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors duration-200">
          <Icon className="w-4 h-4" />
        </span>
      )}
      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200 whitespace-nowrap">
        {item.label}
      </span>
      {isExternal && (
        <ExternalLink className="w-3 h-3 flex-shrink-0 text-muted-foreground group-hover:text-primary opacity-60 transition-all duration-200" />
      )}
    </span>
  );

  const compactContent = (
    <span
      className={cn(
        "group flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-all duration-200",
        "hover:bg-accent",
      )}
    >
      {Icon && (
        <span className="flex-shrink-0 p-1 rounded bg-muted/60 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
          <Icon className="w-3.5 h-3.5" />
        </span>
      )}
      <span className="flex items-center gap-1.5 min-w-0">
        <span className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors duration-200">
          {item.label}
        </span>
        {isExternal && (
          <ExternalLink className="w-3 h-3 flex-shrink-0 text-muted-foreground group-hover:text-primary opacity-50 transition-all duration-200" />
        )}
      </span>
    </span>
  );

  const linkContent = variant === "compact" ? compactContent : defaultContent;

  if (isExternal) {
    return (
      <a
        href={item.href || "#"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={closeMenu}
        className="inline-block"
      >
        {linkContent}
      </a>
    );
  }

  return (
    <Link href={item.href || "#"} onClick={closeMenu} className="inline-block">
      {linkContent}
    </Link>
  );
}
