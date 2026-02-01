"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Calendar,
  Eye,
  User,
  Tag,
  Share2,
  Clock,
  Facebook,
  Twitter,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  postsApi,
  type PostDetailView,
  type PostAuditView,
} from "@/lib/api-client";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatReadTime = (content: string) => {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} phút đọc`;
};

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

const extractHeadings = (content: string): TableOfContentsItem[] => {
  const headingRegex = /<h([2-4])[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h[2-4]>/gi;
  const headings: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3].trim(),
    });
  }

  return headings;
};

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<PostDetailView | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<PostAuditView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>(
    [],
  );

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await postsApi.getPostBySlug(slug);
      setPost(data);
      setTableOfContents(extractHeadings(data.content));

      if (data.categories.length > 0) {
        const related = await postsApi.getPublishedPosts({
          categoryId: data.categories[0].id,
          limit: 4,
        });
        setRelatedPosts(
          related.content.filter((p) => p.id !== data.id).slice(0, 3),
        );
      }
    } catch (err) {
      setError("Không tìm thấy bài viết");
      console.error("Failed to fetch post:", err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug, fetchPost]);

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll("h2[id], h3[id], h4[id]");
      let currentHeading = "";

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 150) {
          currentHeading = heading.id;
        }
      });

      setActiveHeading(currentHeading);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      "_blank",
    );
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post?.title || "")}`,
      "_blank",
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="px-4 sm:px-8 lg:px-16 xl:px-24">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="aspect-video bg-gray-200 rounded-2xl mb-8" />
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error || "Không tìm thấy bài viết"}
          </h1>
          <Link href="/tin-tuc">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="px-4 sm:px-8 lg:px-16 xl:px-24 py-4">
          <Link
            href="/tin-tuc"
            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách tin tức
          </Link>
        </div>
      </div>

      <article className="px-4 sm:px-8 lg:px-16 xl:px-24 py-8 lg:py-12">
        <div className="flex gap-8">
          <aside className="hidden xl:block w-56 shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  Chia sẻ
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={shareOnFacebook}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1877F2] text-white text-sm hover:opacity-90 transition-opacity"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </button>
                <button
                  onClick={shareOnTwitter}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1DA1F2] text-white text-sm hover:opacity-90 transition-opacity"
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </button>
                <button
                  onClick={copyLink}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      Đã sao chép!
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-4 h-4" />
                      Sao chép link
                    </>
                  )}
                </button>
              </div>

              {post.tags.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      Thẻ
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/tin-tuc?tag=${tag.id}`}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200 transition-colors"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          <main className="flex-1 min-w-0 max-w-4xl">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              {post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/tin-tuc?category=${category.id}`}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {post.authors.length > 0 && (
                  <div className="flex items-center gap-2">
                    {post.authors[0].avatarUrl ? (
                      <Image
                        src={post.authors[0].avatarUrl}
                        alt={post.authors[0].displayName}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                    <span className="font-medium text-gray-700">
                      {post.authors[0].displayName}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt || post.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatReadTime(post.content)}
                </div>
                {post.viewCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {post.viewCount} lượt xem
                  </div>
                )}
              </div>
            </motion.header>

            {post.coverImageUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative aspect-video rounded-2xl overflow-hidden mb-8"
              >
                <Image
                  src={post.coverImageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose prose-lg max-w-none prose-headings:scroll-mt-24 prose-a:text-blue-600 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="xl:hidden mt-8 pt-8 border-t">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tin-tuc?tag=${tag.id}`}
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={shareOnFacebook}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#1877F2] text-white text-sm"
                >
                  <Facebook className="w-4 h-4" />
                  Chia sẻ
                </button>
                <button
                  onClick={copyLink}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <LinkIcon className="w-4 h-4" />
                  )}
                  {copied ? "Đã sao chép" : "Sao chép"}
                </button>
              </div>
            </div>
          </main>

          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              {tableOfContents.length > 0 && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-foreground mb-4">
                    Mục lục
                  </h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm transition-colors ${
                          item.level === 3 ? "pl-4" : ""
                        } ${item.level === 4 ? "pl-8" : ""} ${
                          activeHeading === item.id
                            ? "text-blue-600 font-medium"
                            : "text-gray-600 hover:text-foreground"
                        }`}
                      >
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="bg-white border-t py-12">
          <div className="px-4 sm:px-8 lg:px-16 xl:px-24">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Bài viết liên quan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/tin-tuc/${relatedPost.slug}`}
                >
                  <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-video overflow-hidden">
                      {relatedPost.coverImageUrl ? (
                        <Image
                          src={relatedPost.coverImageUrl}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600" />
                      )}
                    </div>
                    <div className="p-5">
                      <div className="text-xs text-gray-500 mb-2">
                        {formatDate(
                          relatedPost.publishedAt || relatedPost.createdAt,
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
