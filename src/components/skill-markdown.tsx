import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/ui/code-block";

function textOf(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (typeof node === "object" && "props" in node) {
    return textOf((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

export function SkillMarkdown({ content }: { content: string }) {
  return (
    <div className="prose-skill">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          pre({ children }) {
            const child = Array.isArray(children) ? children[0] : children;
            const props =
              child && typeof child === "object" && "props" in child
                ? (child as { props: { className?: string; children?: ReactNode } }).props
                : { className: "", children };
            const lang = /language-([\w-]+)/.exec(props.className ?? "")?.[1] ?? "text";
            return <CodeBlock code={textOf(props.children)} lang={lang} title={lang} />;
          },
          table({ children }) {
            return (
              <div className="table-wrap">
                <table>{children}</table>
              </div>
            );
          },
          a({ href, children }) {
            const external = /^https?:/.test(href ?? "");
            return (
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
