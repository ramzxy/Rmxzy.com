import Home from "./home-client";
import { getAllPostSummaries } from "../lib/blog";

export default function Page() {
  const latestPosts = getAllPostSummaries()
    .slice(0, 3)
    .map(({ searchText, ...post }) => post);

  return <Home latestPosts={latestPosts} />;
}
