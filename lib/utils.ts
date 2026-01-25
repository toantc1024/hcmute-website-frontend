import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString?: string | null, options?: {
  includeTime?: boolean;
  locale?: string;
}): string {
  if (!dateString) return "";
  
  const { includeTime = false, locale = "vi-VN" } = options || {};
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  
  if (includeTime) {
    return date.toLocaleString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateString?: string | null, locale = "vi-VN"): string {
  return formatDate(dateString, { includeTime: true, locale });
}

export function formatRelativeTime(dateString?: string | null): string {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24) return `${diffHour} giờ trước`;
  if (diffDay < 7) return `${diffDay} ngày trước`;
  
  return formatDate(dateString);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 100);
}

export function formatNumber(num: number, locale = "vi-VN"): string {
  return num.toLocaleString(locale);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}
