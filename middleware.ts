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

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";

  if (hostname === "ssh.rmxzy.com" || hostname === "ssh.rmxzy.com:3000") {
    const path = new URL(request.url).pathname;
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

  return NextResponse.next();
}
