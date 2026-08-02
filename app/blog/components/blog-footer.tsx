import Link from "next/link";

export function BlogFooter() {
  return (
    <footer className="blog-footer">
      <div>
        <span className="font-mono">rmxzy/writing</span>
        <p>Notes on systems, security, and whatever I am building.</p>
      </div>
      <div className="blog-footer__links">
        <Link href="/">home</Link>
        <a href="mailto:me@rmxzy.com">email</a>
        <a href="https://github.com/ramzxy" target="_blank" rel="noreferrer">github</a>
        <a href="/feed.xml">rss</a>
      </div>
    </footer>
  );
}

