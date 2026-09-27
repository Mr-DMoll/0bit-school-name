"use client";
import { use } from "react";
import { PostFormPage } from "@/features/admin/pages/PostFormPage";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PostFormPage postId={id} />;
}
