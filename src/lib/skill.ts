import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

export type Heading = { depth: 2 | 3; text: string; id: string };

export type Skill = {
  raw: string;
  content: string;
  name: string;
  description: string;
  headings: Heading[];
};

function extractHeadings(md: string): Heading[] {
  const slugger = new GithubSlugger();
  const out: Heading[] = [];
  let inFence = false;
  for (const line of md.split("\n")) {
    if (/^```/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = /^(##|###)\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/`/g, "");
    out.push({ depth: m[1].length as 2 | 3, text, id: slugger.slug(text) });
  }
  return out;
}

export function getSkill(): Skill {
  const file = path.join(process.cwd(), "content", "skill.md");
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    raw,
    content,
    name: String(data.name ?? "one-hackathon"),
    description: String(data.description ?? ""),
    headings: extractHeadings(content),
  };
}
