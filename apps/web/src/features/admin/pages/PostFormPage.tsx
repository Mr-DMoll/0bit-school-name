"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { postService, type Post } from "@/shared/services/post.service";
import { Spinner } from "@/shared/components/ui/Spinner";
import { ImageInput } from "@/shared/components/ui/ImageInput";

const labelStyle: React.CSSProperties = {
  fontSize: "11px", fontWeight: 600, textTransform: "uppercase",
  letterSpacing: "0.06em", color: "var(--color-text-muted)", display: "block", marginBottom: "6px",
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", fontSize: "13px", color: "var(--color-text-primary)",
  background: "var(--color-bg)", border: "1px solid var(--color-border)",
  borderRadius: "8px", outline: "none", boxSizing: "border-box",
};
const fieldGroup: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "5px", marginBottom: "16px" };
const card: React.CSSProperties = {
  background: "var(--color-card-bg)", border: "1px solid var(--color-card-border)",
  borderRadius: "var(--radius-lg)", boxShadow: "var(--color-card-shadow)", padding: "20px 24px",
};

// Full-page create/edit for a News or Blog post — was a modal, moved to its
// own route since a post's body is long-form content, not a quick edit.
export function PostFormPage({ postId }: { postId?: string }) {
  const router = useRouter();
  const isEdit = !!postId;

  const [loading, setLoading] = useState(isEdit);
  const [type,      setType]      = useState<"NEWS" | "BLOG">("NEWS");
  const [title,     setTitle]     = useState("");
  const [category,  setCategory]  = useState("");
  const [excerpt,   setExcerpt]   = useState("");
  const [body,      setBody]      = useState("");
  const [image,     setImage]     = useState("");
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  // No GET-by-id endpoint exists yet — fetching the list and finding the
  // match is fine at a school's post-count scale, and avoids a new route.
  useEffect(() => {
    if (!postId) return;
    postService.list().then((res) => {
      const post = res.data.data.posts.find((p) => p.id === postId);
      if (post) {
        setType(post.type); setTitle(post.title); setCategory(post.category ?? "");
        setExcerpt(post.excerpt); setBody(post.body ?? ""); setImage(post.image ?? "");
        setPublished(post.published);
      } else {
        setError("Post not found.");
      }
    }).finally(() => setLoading(false));
  }, [postId]);

  const handleSave = async () => {
    if (!title.trim() || !excerpt.trim()) { setError("Title and excerpt are required."); return; }
    setSaving(true); setError(null);
    try {
      const payload: Partial<Post> = {
        type,
        title: title.trim(), excerpt: excerpt.trim(),
        category: category.trim() || null,
        body: body.trim() || null,
        image: image.trim() || null,
        published,
      };
      if (isEdit) await postService.update(postId!, payload);
      else await postService.create(payload);
      router.push("/admin/work");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to save.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "80px", color: "var(--color-text-muted)" }}>
        <Spinner size={16} /><span style={{ fontSize: "13px" }}>Loading...</span>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/work" style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "var(--color-text-muted)", textDecoration: "none", marginBottom: "16px" }}>
        <ChevronLeft size={14} /> Back to News &amp; Blog
      </Link>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, fontFamily: "var(--font-display), Georgia, serif", color: "var(--color-text-primary)" }}>
          {isEdit ? "Edit Post" : "Add Post"}
        </h1>
        <button onClick={handleSave} disabled={saving} style={{ padding: "9px 20px", background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1, whiteSpace: "nowrap" }}>
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Post"}
        </button>
      </div>

      {error && (
        <div style={{ fontSize: "12px", color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "9px 12px", marginBottom: "16px" }}>{error}</div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", alignItems: "start" }}>
        <div style={card}>
          <div style={fieldGroup}>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Class of 2025 Matric Results" />
          </div>
          <div style={fieldGroup}>
            <label style={labelStyle}>Excerpt *</label>
            <textarea style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Shown on the card preview" />
          </div>
          <div style={{ ...fieldGroup, marginBottom: 0 }}>
            <label style={labelStyle}>Body</label>
            <textarea style={{ ...inputStyle, minHeight: "320px", resize: "vertical" }} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Full post content (optional)" />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={card}>
            <div style={fieldGroup}>
              <label style={labelStyle}>Type</label>
              <select style={inputStyle} value={type} onChange={(e) => setType(e.target.value as "NEWS" | "BLOG")}>
                <option value="NEWS">News</option>
                <option value="BLOG">Blog</option>
              </select>
            </div>
            <div style={fieldGroup}>
              <label style={labelStyle}>Category</label>
              <input style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Academics, Sport, Facilities" />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--color-text-secondary)", cursor: "pointer" }}>
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              Published (visible on the public site)
            </label>
          </div>
          <div style={card}>
            <ImageInput label="Image" value={image} onChange={setImage} aspect="landscape" />
          </div>
        </div>
      </div>
    </div>
  );
}
