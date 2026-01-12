"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from "lucide-react";
import Link from "next/link";

interface MarkdownContentProps {
  content: string;
  isUserDocs: boolean;
  section: string;
  currentPath: string;
  docFiles: any[];
  siteConfig: any;
}

export function MarkdownContent({ content, isUserDocs, section, currentPath, docFiles, siteConfig }: MarkdownContentProps) {
  const [copiedBlocks, setCopiedBlocks] = useState<Set<number>>(new Set());
  const [showFeedback, setShowFeedback] = useState(false);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBlocks(prev => new Set(prev).add(index));
      setShowFeedback(true);
      
      // Hide feedback after 2 seconds
      setTimeout(() => setShowFeedback(false), 2000);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedBlocks(prev => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <>
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
            const codeText = String(children).replace(/\n$/, '');
            const blockIndex = Math.random(); // Simple unique identifier

            return !isInline && match ? (
              <div className="relative group">
                <button
                  onClick={() => copyToClipboard(codeText, blockIndex)}
                  className="absolute top-2 right-2 p-2 rounded-md bg-background/90 backdrop-blur-sm border border-border/50 shadow-sm hover:bg-background transition-colors duration-200 opacity-0 group-hover:opacity-100"
                  title="Copy code"
                >
                  <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-lg border bg-muted p-4 my-4 overflow-x-auto"
                  {...props}
                >
                  {codeText}
                </SyntaxHighlighter>
              </div>
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
      
      {/* Copy Success Feedback */}
      {showFeedback && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">Copied to clipboard</span>
          </div>
        </div>
      )}
    </>
  );
}