"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ChevronRight, ExternalLink } from "lucide-react";
import { menuData, MenuItem } from "./menu-data";
import { navbarConfig } from "./navbar-config";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { logo, actions, topBar } = navbarConfig;
  const [currentLang, setCurrentLang] = useState(topBar.defaultLanguage);

  const selectedLang = topBar.languages.find((l) => l.id === currentLang);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="w-6 h-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:w-[400px] p-0 overflow-hidden flex flex-col"
      >
        <SheetHeader className="p-4 border-b text-left flex-shrink-0">
          <SheetTitle>
            <Link href={logo.href} onClick={() => setOpen(false)}>
              <img
                src={logo.image}
                alt={logo.alt}
                className="h-9 w-auto"
              />
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Language Selector */}
          {topBar.enabled && topBar.languages.length > 0 && (
            <div className="px-4 py-3 border-b border-border/50">
              <Select value={currentLang} onValueChange={setCurrentLang}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      <span className={cn("fi rounded-sm", `fi-${selectedLang?.flagCode}`)} />
                      <span>{selectedLang?.label}</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {topBar.languages.map((lang) => (
                    <SelectItem key={lang.id} value={lang.id}>
                      <span className="flex items-center gap-2">
                        <span className={cn("fi rounded-sm", `fi-${lang.flagCode}`)} />
                        <span>{lang.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Menu Items */}
          <div className="flex flex-col py-2">
            {menuData.map((item) => (
              <MobileMenuItem key={item.id} item={item} setOpen={setOpen} level={0} />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {actions.length > 0 && (
          <div className="p-4 border-t flex-shrink-0 space-y-2">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant={action.variant}
                  className="w-full justify-center"
                  size="sm"
                  asChild
                >
                  <Link href={action.href} onClick={() => setOpen(false)}>
                    {action.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function MobileMenuItem({
  item,
  setOpen,
  level,
}: {
  item: MenuItem;
  setOpen: (open: boolean) => void;
  level: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;
  const isExternal = item.isExternal;

  const toggleExpand = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleLinkClick = () => {
    setOpen(false);
  };

  const paddingLeft = level === 0 ? "pl-4" : level === 1 ? "pl-6" : "pl-10";

  if (item.type === "link" || (!hasChildren && item.href)) {
    const linkContent = (
      <span
        className={cn(
          "flex items-center gap-3 w-full py-3 pr-4 text-sm font-medium transition-colors",
          "hover:bg-accent/50",
          paddingLeft,
          level > 0 && "text-muted-foreground hover:text-foreground"
        )}
      >
        {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
        <span className="flex-1">{item.label}</span>
        {isExternal && <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />}
      </span>
    );

    if (isExternal) {
      return (
        <a
          href={item.href || "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkClick}
          className="block"
        >
          {linkContent}
        </a>
      );
    }

    return (
      <Link href={item.href || "#"} onClick={handleLinkClick} className="block">
        {linkContent}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={toggleExpand}
        className={cn(
          "flex items-center justify-between w-full py-3 pr-4 text-sm font-medium transition-colors",
          "hover:bg-accent/50",
          paddingLeft,
          isExpanded && "bg-accent/30",
          level > 0 && "text-muted-foreground"
        )}
      >
        <span className="flex items-center gap-3">
          {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
          <span className={cn(isExpanded && level === 0 && "text-primary font-semibold")}>
            {item.label}
          </span>
        </span>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden bg-accent/10"
          >
            {item.children?.map((child) => {
              if (child.children && child.children.length > 0) {
                return (
                  <div key={child.id}>
                    <div className="pl-6 pr-4 py-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {child.label}
                      </span>
                    </div>
                    {child.children.map((subChild) => (
                      <MobileMenuItem
                        key={subChild.id}
                        item={subChild}
                        setOpen={setOpen}
                        level={2}
                      />
                    ))}
                  </div>
                );
              }
              return (
                <MobileMenuItem key={child.id} item={child} setOpen={setOpen} level={1} />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
