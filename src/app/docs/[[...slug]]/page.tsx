import { getDocContent, getDocFiles } from "@/lib/docs";
import { siteConfig } from "@/lib/config";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home, FileText, Users, Code2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
  params: {
    slug?: string[];
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const title = params.slug ? params.slug.join(" / ") : "Documentation";
  return {
    title: `${title} | Gambit Pairing`,
    description: "Documentation for Gambit Pairing software.",
  };
}

/**
 * generateStaticParams - required for static export when using catch-all routes.
 * Enumerates user and dev docs so Next can pre-render them during `next export`.
 */
export async function generateStaticParams() {
  const params: { slug: string[] }[] = [];

  // Include the docs root
  params.push({ slug: [] });

  try {
    const [userFiles, devFiles] = await Promise.all([
      getDocFiles("user"),
      getDocFiles("dev")
    ]);

    for (const f of userFiles) {
      const name = f.name.replace(".md", "");
      params.push({ slug: ["user", name] });
    }

    for (const f of devFiles) {
      const name = f.name.replace(".md", "");
      params.push({ slug: ["dev", name] });
    }

    // Ensure READMEs are always present even if API failed or files were missing
    if (!params.some(p => p.slug[0] === "user" && p.slug[1] === "README")) {
      params.push({ slug: ["user", "README"] });
    }
    if (!params.some(p => p.slug[0] === "dev" && p.slug[1] === "README")) {
      params.push({ slug: ["dev", "README"] });
    }
  } catch (error) {
    console.error("Error generating static params:", error);
    // Fallback to minimal set of pages to avoid build failure and ensure core links work
    params.push({ slug: ["user", "README"] });
    params.push({ slug: ["dev", "README"] });
  }

  return params;
}

export default async function DocsPage({ params }: Props) {
  const isRoot = !params.slug || params.slug.length === 0;
  const section = params.slug?.[0];
  const isUserDocs = section === "user";
  const isDevDocs = section === "dev";
  
  // If we are in a specific section, fetch the relevant docs
  let content = null;
  let docFiles: any[] = [];

  if (isUserDocs) {
    // Fetch user docs
    // Remove "user" from slug for fetching content
    const contentSlug = params.slug!.slice(1);
    [content, docFiles] = await Promise.all([
      getDocContent(contentSlug, "user"),
      getDocFiles("user")
    ]);
  } else if (isDevDocs) {
    // Fetch dev docs
    // Remove "dev" from slug for fetching content
    const contentSlug = params.slug!.slice(1);
    [content, docFiles] = await Promise.all([
      getDocContent(contentSlug, "dev"),
      getDocFiles("dev")
    ]);
  } else if (!isRoot) {
    // Unknown section, maybe redirect or 404?
    // For now let's just 404 if it's not user or dev and not root
    notFound();
  }

  if (!content && !isRoot) {
    notFound();
  }

  const currentPath = params.slug ? params.slug.join("/") : "";

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 overflow-x-auto pb-2">
            <Link href="/" className="hover:text-primary transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/docs" className="hover:text-primary transition-colors font-medium">
              Docs
            </Link>
            {params.slug?.map((segment, index) => (
              <div key={segment} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-foreground capitalize">
                  {segment.replace(/-/g, " ")}
                </span>
              </div>
            ))}
          </div>

          {isRoot ? (
            <div className="space-y-12">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Documentation</h1>
                <p className="text-xl text-muted-foreground">
                  Whether you're organizing a tournament or contributing code, we have the resources you need.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* User Documentation Section */}
                <div className="p-8 rounded-xl border bg-card text-card-foreground shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">User Guide</h2>
                  </div>
                  <p className="text-muted-foreground mb-8 min-h-[3rem]">
                    Complete guides for tournament directors. Learn how to install, pair players, and manage events.
                  </p>
                  <div className="grid gap-2">
                    <Link 
                      href="/docs/user/README"
                      className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-accent transition-colors"
                    >
                      <span className="font-medium">Start Reading</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </div>
                </div>

                {/* Developer Documentation Section */}
                <div className="p-8 rounded-xl border bg-card text-card-foreground shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Code2 className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Developer Docs</h2>
                  </div>
                  <p className="text-muted-foreground mb-8 min-h-[3rem]">
                    Technical resources for contributors. Architecture and setup guides.
                  </p>
                  <div className="grid gap-2">
                    <Link 
                      href="/docs/dev/README"
                      className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-accent transition-colors"
                    >
                      <span className="font-medium">Start Reading</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
              {/* Sidebar */}
              <aside className="lg:block space-y-6">
                <div className="sticky top-24">
                  <h3 className="font-semibold mb-3">
                    {isUserDocs ? "User Guide" : "Developer Docs"}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {docFiles.map((file) => {
                      const fileSlug = file.name.replace(".md", "");
                      // Construct the full path for the link: /docs/section/fileSlug
                      const linkPath = `/docs/${section}/${fileSlug}`;
                      // Check if active: currentPath is "section/slug", so we compare with that
                      // Actually currentPath is params.slug.join("/") which is "section/slug"
                      // So we check if currentPath ends with fileSlug
                      const isActive = currentPath.endsWith(fileSlug);
                      
                      return (
                        <li key={file.name}>
                          <Link 
                            href={linkPath} 
                            className={`flex items-center gap-2 py-1 hover:text-primary transition-colors ${
                              isActive ? "text-primary font-medium" : "text-muted-foreground"
                            }`}
                          >
                            <FileText className="h-4 w-4" />
                            {fileSlug.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </Link>
                        </li>
                      );
                    })}
                    <li className="pt-4 border-t">
                      <Link 
                        href={isUserDocs 
                          ? `https://github.com/${siteConfig.github.owner}/${siteConfig.github.userDocsRepo}`
                          : `https://github.com/${siteConfig.github.owner}/${siteConfig.github.repo}/tree/main/docs`
                        }
                        target="_blank"
                        className="flex items-center gap-2 py-1 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        View on GitHub
                      </Link>
                    </li>
                  </ul>
                </div>
              </aside>

              {/* Content */}
              <article className="prose prose-slate dark:prose-invert max-w-none lg:prose-lg prose-headings:scroll-mt-20 prose-headings:font-semibold prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-7 prose-strong:text-foreground prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-pre:bg-muted prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-table:text-sm prose-th:bg-muted prose-th:text-muted-foreground prose-th:font-medium prose-th:p-3 prose-th:text-left prose-td:p-3 prose-td:border-t prose-li:text-muted-foreground">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold tracking-tight text-foreground mb-6" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-semibold tracking-tight text-foreground mt-8 mb-4" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-foreground mt-6 mb-3" {...props} />,
                    h4: ({node, ...props}) => <h4 className="text-lg font-semibold text-foreground mt-4 mb-2" {...props} />,
                    h5: ({node, ...props}) => <h5 className="text-base font-semibold text-foreground mt-3 mb-2" {...props} />,
                    h6: ({node, ...props}) => <h6 className="text-sm font-semibold text-foreground mt-2 mb-1" {...props} />,
                    p: ({node, ...props}) => <p className="text-muted-foreground leading-7 mb-4" {...props} />,
                    a: ({node, ...props}) => {
                      // Handle relative links to other docs
                      const href = props.href || "";
                      if (href.startsWith("http")) {
                        return <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline underline-offset-4" />;
                      }
                      // If it's a relative link to a markdown file, rewrite it to /docs/...
                      if (href.endsWith(".md")) {
                        return <Link href={`/docs/${href.replace(".md", "")}`} className="text-primary hover:text-primary/80 underline underline-offset-4">{props.children}</Link>;
                      }
                      return <a {...props} className="text-primary hover:text-primary/80 underline underline-offset-4" />;
                    },
                    code: ({node, className, children, ...props}: any) => {
                      const match = /language-(\w+)/.exec(className || '');
                      const isInline = !match;
                      return !isInline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg border bg-muted p-4 my-4 overflow-x-auto"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary" {...props}>
                          {children}
                        </code>
                      );
                    },
                    pre: ({node, ...props}) => <pre className="bg-muted p-4 rounded-lg border overflow-x-auto my-4" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 my-4 text-muted-foreground" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1 my-4 text-muted-foreground" {...props} />,
                    li: ({node, ...props}) => <li className="text-muted-foreground" {...props} />,
                    table: ({node, ...props}) => <table className="w-full border-collapse border border-border my-4" {...props} />,
                    th: ({node, ...props}) => <th className="bg-muted text-muted-foreground font-medium p-3 text-left border-b border-border" {...props} />,
                    td: ({node, ...props}) => <td className="p-3 border-t border-border text-muted-foreground" {...props} />,
                    hr: ({node, ...props}) => <hr className="border-border my-8" {...props} />,
                    img: ({node, ...props}) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img {...props} className="rounded-lg border shadow-sm my-4" alt={props.alt || "Doc image"} />
                    ),
                    strong: ({node, ...props}) => <strong className="text-foreground font-semibold" {...props} />,
                    em: ({node, ...props}) => <em className="text-muted-foreground italic" {...props} />,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </article>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
