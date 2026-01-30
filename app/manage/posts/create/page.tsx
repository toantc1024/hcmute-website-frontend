"use client";

import { PostForm } from "@/features/posts";

export default function CreatePostPage() {
  return (
    <div className="-m-4 md:-m-6 h-[calc(100%+2rem)] md:h-[calc(100%+3rem)]">
      <PostForm />
    </div>
  );
}
