import { NextRequest, NextResponse } from "next/server";

const SSH_KEYS = `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEN27dr/BoGx9YY7RWKTF8Se0kWMlOowQPKFBWNMDhtl ilia1000500095@gmail.com
`;

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";

  if (hostname === "ssh.rmxzy.com" || hostname === "ssh.rmxzy.com:3000") {
    return new NextResponse(SSH_KEYS.trim() + "\n", {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  return NextResponse.next();
}
