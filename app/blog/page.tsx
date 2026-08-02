import { BlogExplorer } from "./components/blog-explorer";
import { ScrollBlogIntro } from "./components/scroll-blog-intro";
import { getAllPostSummaries } from "../../lib/blog";

export default function BlogPage() {
  const posts = getAllPostSummaries();
  const latest = posts[0];

  return (
    <main id="blog-content" className="blog-main blog-main--animated">
      {latest && <ScrollBlogIntro latest={latest} />}
      <div className="blog-archive-wrap">
        <BlogExplorer posts={posts} />
      </div>
    </main>
  );
}
