"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, X, Settings2, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// ============================================================================
// TYPES
// ============================================================================

export interface SelectableItem {
  id: string;
  name: string;
}

interface SearchableTagSelectProps<T extends SelectableItem> {
  /** Available items to select from */
  items: T[];
  /** Currently selected item IDs */
  selectedIds: string[];
  /** Callback when selection changes */
  onSelectionChange: (ids: string[]) => void;
  /** Callback when manage button is clicked */
  onManage?: () => void;
  /** Placeholder text for search input */
  placeholder?: string;
  /** Label for manage button */
  manageLabel?: string;
  /** Icon to show for each item */
  itemIcon?: React.ReactNode;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Whether to show the manage button */
  showManageButton?: boolean;
  /** Class name for the container */
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function SearchableTagSelect<T extends SelectableItem>({
  items,
  selectedIds,
  onSelectionChange,
  onManage,
  placeholder = "Tìm kiếm...",
  manageLabel = "Quản lý",
  itemIcon,
  disabled = false,
  showManageButton = true,
  className,
}: SearchableTagSelectProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Number of items to show when collapsed
  const COLLAPSED_ITEM_COUNT = 3;

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(query));
  }, [items, searchQuery]);

  // Get selected items
  const selectedItems = useMemo(() => {
    return items.filter((item) => selectedIds.includes(item.id));
  }, [items, selectedIds]);

  // Handlers
  const handleToggleItem = useCallback(
    (itemId: string) => {
      if (disabled) return;
      if (selectedIds.includes(itemId)) {
        onSelectionChange(selectedIds.filter((id) => id !== itemId));
      } else {
        onSelectionChange([...selectedIds, itemId]);
      }
      setSearchQuery("");
    },
    [selectedIds, onSelectionChange, disabled],
  );

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      if (disabled) return;
      onSelectionChange(selectedIds.filter((id) => id !== itemId));
    },
    [selectedIds, onSelectionChange, disabled],
  );

  const handleClearAll = useCallback(() => {
    if (disabled) return;
    onSelectionChange([]);
  }, [onSelectionChange, disabled]);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          placeholder={placeholder}
          disabled={disabled}
          className="pl-9 pr-9 rounded-lg"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 size-7"
            onClick={() => setSearchQuery("")}
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isSearchFocused && searchQuery && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-lg max-h-[200px] overflow-auto">
          {filteredItems.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground text-center">
              Không tìm thấy kết quả
            </p>
          ) : (
            <div className="p-1">
              {filteredItems.slice(0, 10).map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggleItem(item.id)}
                    className={cn(
                      "w-full flex items-center gap-2 p-2 rounded-md text-sm text-left",
                      "hover:bg-muted transition-colors",
                      isSelected && "bg-primary/10 text-primary",
                    )}
                  >
                    {itemIcon && (
                      <span className="text-muted-foreground">{itemIcon}</span>
                    )}
                    <span className="flex-1">{item.name}</span>
                    {isSelected && (
                      <Badge variant="secondary" className="text-xs">
                        Đã chọn
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Selected Items - Wrap Style with Show More */}
      {selectedItems.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Đã chọn ({selectedItems.length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleClearAll}
              disabled={disabled}
            >
              <X className="size-3 mr-1" />
              Xóa tất cả
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(isExpanded
              ? selectedItems
              : selectedItems.slice(0, COLLAPSED_ITEM_COUNT)
            ).map((item) => (
              <Badge
                key={item.id}
                variant="secondary"
                className={cn(
                  "rounded-full px-3 py-1.5 gap-1.5",
                  "bg-primary/10 text-primary border-primary/20",
                  "hover:bg-primary/20 cursor-pointer transition-colors",
                )}
                onClick={() => handleRemoveItem(item.id)}
              >
                {itemIcon && <span className="size-3">{itemIcon}</span>}
                {item.name}
                <X className="size-3" />
              </Badge>
            ))}
          </div>
          {selectedItems.length > COLLAPSED_ITEM_COUNT && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs w-full text-muted-foreground hover:text-foreground"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="size-3 mr-1" />
                  Ẩn bớt
                </>
              ) : (
                <>
                  <ChevronDown className="size-3 mr-1" />
                  Xem thêm ({selectedItems.length - COLLAPSED_ITEM_COUNT})
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Manage Button */}
      {showManageButton && onManage && (
        <Button
          variant="outline"
          className="w-full rounded-lg"
          onClick={onManage}
          disabled={disabled}
        >
          <Settings2 className="mr-2 size-4" />
          {manageLabel}
        </Button>
      )}
    </div>
  );
}
