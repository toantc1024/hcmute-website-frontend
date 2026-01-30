"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FileText,
  Image,
  Folder,
  ArrowRight,
  Loader2,
  X,
  Command,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command as CommandUI,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: "post" | "media" | "page";
  href: string;
  status?: string;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Quick navigation items
const quickNavItems = [
  { id: "posts", label: "Bài viết", href: "/manage/posts", icon: FileText },
  { id: "media", label: "Đa phương tiện", href: "/manage/media", icon: Image },
  {
    id: "create-post",
    label: "Tạo bài viết mới",
    href: "/manage/posts/create",
    icon: FileText,
  },
];

// Recent searches (mock - in real app, store in localStorage)
const recentSearches = [
  "Tuyển sinh 2024",
  "Thông báo nghỉ lễ",
  "Sự kiện khoa CNTT",
];

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  // Mock search function - replace with actual API call
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Mock results - replace with actual API call
    const mockResults: SearchResult[] = [
      {
        id: "1",
        title: `Kết quả cho "${searchQuery}"`,
        description: "Bài viết mẫu chứa từ khóa tìm kiếm",
        type: "post",
        href: "/manage/posts/1",
        status: "published",
      },
      {
        id: "2",
        title: `Thông báo về ${searchQuery}`,
        description: "Thông báo chính thức từ nhà trường",
        type: "post",
        href: "/manage/posts/2",
        status: "draft",
      },
    ];

    setResults(mockResults);
    setIsSearching(false);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleSelect = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  const getTypeIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "post":
        return FileText;
      case "media":
        return Image;
      default:
        return Folder;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const variants: Record<string, { label: string; className: string }> = {
      published: {
        label: "Đã xuất bản",
        className: "bg-green-500/10 text-green-500",
      },
      draft: { label: "Nháp", className: "bg-yellow-500/10 text-yellow-500" },
      pending: {
        label: "Chờ duyệt",
        className: "bg-blue-500/10 text-blue-500",
      },
    };

    const variant = variants[status] || {
      label: status,
      className: "bg-muted",
    };

    return (
      <Badge variant="outline" className={cn("text-xs", variant.className)}>
        {variant.label}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Tìm kiếm</DialogTitle>
        </DialogHeader>

        <CommandUI className="rounded-lg border-0" shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            {isSearching ? (
              <Loader2 className="mr-2 size-4 shrink-0 animate-spin opacity-50" />
            ) : (
              <Search className="mr-2 size-4 shrink-0 opacity-50" />
            )}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết, đa phương tiện..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="ml-2 rounded p-1 hover:bg-muted"
              >
                <X className="size-4 opacity-50" />
              </button>
            )}
          </div>

          <CommandList className="max-h-[400px] overflow-y-auto">
            <AnimatePresence mode="wait">
              {query ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {results.length === 0 && !isSearching ? (
                    <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                      Không tìm thấy kết quả cho "{query}"
                    </CommandEmpty>
                  ) : (
                    <CommandGroup heading="Kết quả tìm kiếm">
                      {results.map((result) => {
                        const Icon = getTypeIcon(result.type);
                        return (
                          <CommandItem
                            key={result.id}
                            onSelect={() => handleSelect(result.href)}
                            className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                          >
                            <div className="flex size-8 items-center justify-center rounded-md border bg-muted">
                              <Icon className="size-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium truncate">
                                  {result.title}
                                </span>
                                {getStatusBadge(result.status)}
                              </div>
                              {result.description && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {result.description}
                                </p>
                              )}
                            </div>
                            <ArrowRight className="size-4 shrink-0 opacity-50" />
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="suggestions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <CommandGroup heading="Điều hướng nhanh">
                    {quickNavItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <CommandItem
                          key={item.id}
                          onSelect={() => handleSelect(item.href)}
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                        >
                          <div className="flex size-8 items-center justify-center rounded-md border bg-muted">
                            <Icon className="size-4" />
                          </div>
                          <span className="flex-1">{item.label}</span>
                          <ArrowRight className="size-4 shrink-0 opacity-50" />
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>

                  <CommandSeparator />

                  <CommandGroup heading="Tìm kiếm gần đây">
                    {recentSearches.map((search) => (
                      <CommandItem
                        key={search}
                        onSelect={() => setQuery(search)}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                      >
                        <Search className="size-4 opacity-50" />
                        <span className="flex-1">{search}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </motion.div>
              )}
            </AnimatePresence>
          </CommandList>

          <div className="flex items-center justify-between border-t bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">↑↓</span>
              </kbd>
              <span>để chọn</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                Enter
              </kbd>
              <span>để mở</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                Esc
              </kbd>
              <span>để đóng</span>
            </div>
          </div>
        </CommandUI>
      </DialogContent>
    </Dialog>
  );
}

// Hook to use search dialog with keyboard shortcut
export function useSearchDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return { open, setOpen };
}
