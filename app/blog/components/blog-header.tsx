import Link from "next/link";
import { ThemeToggle } from "../../components/theme-toggle";

export function BlogHeader() {
  return (
    <header className="blog-header">
      <div className="blog-header__inner">
        <Link href="/" className="blog-wordmark" aria-label="Rmxzy home">
          rmxzy<span>_</span>
        </Link>

        <nav className="blog-nav" aria-label="Blog navigation">
          <Link href="/#work"><span>[01]</span> work</Link>
          <Link href="/#projects"><span>[02]</span> projects</Link>
          <Link href="/blog" className="blog-nav__active"><span>[03]</span> writing</Link>
          <Link href="/#about"><span>[04]</span> about</Link>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
