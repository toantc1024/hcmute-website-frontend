import type { Metadata } from "next";
import { API_CONFIG } from "@/lib/api-client";
import NewsDetailContent from "./news-detail-content";

const SITE_NAME = "HCM-UTE - Trường Đại học Công nghệ Kỹ thuật TP.HCM";

/**
 * Strip HTML tags and decode HTML entities to get plain text for meta description.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Truncate text to a maximum length, ending at a word boundary.
 */
function truncate(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

async function fetchPostBySlug(slug: string) {
  try {
    const res = await fetch(`${API_CONFIG.baseUrl}/api/v1/posts/slug/${slug}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-ID": API_CONFIG.tenantId,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    return {
      title: "Bài viết không tồn tại | " + SITE_NAME,
      description: "Bài viết không tồn tại hoặc đã bị xóa.",
    };
  }

  // Extract plain text description from excerpt or content
  const rawDescription = post.excerpt
    ? stripHtml(post.excerpt)
    : stripHtml(post.content);
  const description = truncate(rawDescription, 200);

  const title = post.title;
  const publishedTime = post.publishedAt || post.createdAt;
  const modifiedTime = post.updatedAt;
  const authors =
    post.authors?.map((a: { displayName: string }) => a.displayName) ?? [];
  const category = post.categories?.[0]?.name;
  const tags = post.tags?.map((t: { name: string }) => t.name) ?? [];

  // Build canonical URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hcmute.edu.vn";
  const canonicalUrl = `${siteUrl}/tin-tuc/${slug}`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    keywords: [
      ...tags,
      category,
      "HCM-UTE",
      "Đại học Công nghệ Kỹ thuật",
      "tin tức",
    ].filter(Boolean) as string[],
    authors: authors.map((name: string) => ({ name })),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "vi_VN",
      ...(post.coverImageUrl && {
        images: [
          {
            url: post.coverImageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
      ...(publishedTime && {
        publishedTime,
      }),
      ...(modifiedTime && {
        modifiedTime,
      }),
      ...(authors.length > 0 && {
        authors,
      }),
      ...(category && {
        section: category,
      }),
      ...(tags.length > 0 && {
        tags,
      }),
    },
    twitter: {
      card: post.coverImageUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(post.coverImageUrl && {
        images: [post.coverImageUrl],
      }),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function NewsDetailPage() {
  return <NewsDetailContent />;
}
