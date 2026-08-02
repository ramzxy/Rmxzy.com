import { NextRequest, NextResponse } from "next/server";

const SSH_KEYS = [
  // Windows PC
  "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJI01kwHHUBoiFpT2pv2SJ8LQ3wySg39W0XaFNYTjNzN ilia1000500095@gmail.com",
  // Mac
  "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEN27dr/BoGx9YY7RWKTF8Se0kWMlOowQPKFBWNMDhtl ilia1000500095@gmail.com",
];

function generateScript(): string {
  const keys = SSH_KEYS.join("\n");

  return `#!/bin/sh
set -e
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo "${keys}" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
echo "Done. ${SSH_KEYS.length} key(s) added."
`;
}

const legacyBlogSlugs: Record<string, string> = {
  "you-can-have-the-dinner": "you-can-have-the-dinner",
  "chokerjoker-blog": "chokerjoker-blog",
  zeroclick: "zeroclick",
  "pe-loader": "pe-loader",
  "ilia-beer": "ilia-beer",
  "ilia.beer": "ilia-beer",
};

function legacyPostDestination(pathname: string): string | undefined {
  const match = /^\/\d{4}\/\d{2}\/\d{2}\/([^/]+)\/?$/i.exec(pathname);
  if (!match) return undefined;

  const requestedSlug = decodeURIComponent(match[1]).toLowerCase();
  const slug = legacyBlogSlugs[requestedSlug];
  return slug ? `/blog/${slug}` : undefined;
}

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const url = new URL(request.url);

  if (hostname === "ssh.rmxzy.com" || hostname === "ssh.rmxzy.com:3000") {
    const path = url.pathname;
    const body =
      path === "/keys" ? SSH_KEYS.join("\n") + "\n" : generateScript();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  const legacyPost = legacyPostDestination(url.pathname);
  if (legacyPost) {
    return NextResponse.redirect(new URL(legacyPost, "https://rmxzy.com"), 308);
  }

  if (hostname === "blog.rmxzy.com" || hostname.startsWith("blog.rmxzy.com:")) {
    if (url.pathname === "/atom.xml") {
      return NextResponse.redirect(new URL("/feed.xml", "https://rmxzy.com"), 308);
    }

    if (
      url.pathname === "/" ||
      /^\/(archives|categories|tags)(\/.*)?$/.test(url.pathname)
    ) {
      return NextResponse.redirect(new URL("/blog", "https://rmxzy.com"), 308);
    }
  }

  return NextResponse.next();
}
