"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { postService, type Post } from "@/shared/services/post.service";
import { Spinner } from "@/shared/components/ui/Spinner";

// ─── Confirm delete ───────────────────────────────────────────────────────────
function ConfirmDelete({ title, onConfirm, onCancel }: { title: string; onConfirm: () => Promise<void>; onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  if (typeof document === "undefined") return null;
  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={onCancel}>
      <div style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-border)", borderRadius: "12px", width: "100%", maxWidth: "360px", padding: "24px", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "8px" }}>Delete "{title}"?</div>
        <div style={{ fontSize: "13px", color: "var(--color-text-muted)", marginBottom: "20px" }}>This can't be undone.</div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "9px", background: "none", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "13px", color: "var(--color-text-muted)", cursor: "pointer" }}>Cancel</button>
          <button onClick={async () => { setLoading(true); await onConfirm(); setLoading(false); }} disabled={loading} style={{ flex: 1, padding: "9px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: loading ? "default" : "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export function WorkPage() {
  const [tab,       setTab]       = useState<"NEWS" | "BLOG">("NEWS");
  const [items,     setItems]     = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleting,  setDeleting]  = useState<Post | null>(null);

  const fetchItems = () => {
    setIsLoading(true);
    postService.list().then((res) => setItems(res.data.data.posts)).finally(() => setIsLoading(false));
  };
  useEffect(fetchItems, []);

  const filtered = items.filter((p) => p.type === tab);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, fontFamily: "var(--font-display), Georgia, serif", color: "var(--color-text-primary)" }}>News &amp; Blog</h1>
          <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "4px" }}>
            News is always visible. Blog only appears on the public site once you publish at least one blog post.
          </p>
        </div>
        <Link href="/admin/work/new" style={{ padding: "9px 18px", background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", textDecoration: "none", display: "inline-block" }}>
          + Add Post
        </Link>
      </div>

      <div style={{ display: "flex", gap: "4px", marginBottom: "20px", borderBottom: "1px solid var(--color-border)" }}>
        {(["NEWS", "BLOG"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 14px", fontSize: "13px", fontWeight: 600, background: "none", border: "none",
              borderBottom: tab === t ? "2px solid var(--color-accent)" : "2px solid transparent",
              color: tab === t ? "var(--color-text-primary)" : "var(--color-text-muted)",
              cursor: "pointer", marginBottom: "-1px",
            }}
          >
            {t === "NEWS" ? "News" : "Blog"} ({items.filter((p) => p.type === t).length})
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "60px", color: "var(--color-text-muted)" }}>
          <Spinner size={16} />
          <span style={{ fontSize: "13px" }}>Loading...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ fontSize: "14px", color: "var(--color-text-muted)", marginBottom: "16px" }}>No {tab === "NEWS" ? "news" : "blog"} posts yet.</p>
          <Link href="/admin/work/new" style={{ padding: "9px 18px", background: "var(--color-accent)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "inline-block" }}>
            Add your first post
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
          {filtered.map((p) => (
            <div key={p.id} style={{ background: "var(--color-card-bg)", border: "1px solid var(--color-card-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--color-card-shadow)", overflow: "hidden" }}>
              {p.image && (
                <img src={p.image} alt={p.title} style={{ width: "100%", height: "120px", objectFit: "cover" }} />
              )}
              <div style={{ padding: "14px 16px" }}>
                {!p.published && (
                  <span style={{ display: "inline-block", fontSize: "10px", fontWeight: 700, color: "var(--color-text-muted)", background: "var(--color-bg-subtle)", padding: "2px 6px", borderRadius: "4px", marginBottom: "6px", textTransform: "uppercase" }}>Draft</span>
                )}
                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "4px" }}>{p.title}</p>
                <p style={{ fontSize: "12px", color: "var(--color-text-muted)", lineHeight: 1.5, marginBottom: "10px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{p.excerpt}</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Link href={`/admin/work/${p.id}`} style={{ flex: 1, padding: "6px 10px", fontSize: "12px", background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "6px", cursor: "pointer", color: "var(--color-text-secondary)", textDecoration: "none", textAlign: "center" }}>Edit</Link>
                  <button onClick={() => setDeleting(p)} style={{ padding: "6px 10px", fontSize: "12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", cursor: "pointer", color: "#ef4444" }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleting && (
        <ConfirmDelete title={deleting.title} onConfirm={async () => { await postService.delete(deleting.id); fetchItems(); setDeleting(null); }} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}
