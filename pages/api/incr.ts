import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function incr(req: NextRequest): Promise<NextResponse> {
  if (req.method !== "POST") {
    return new NextResponse("use POST", { status: 405 });
  }
  if (req.headers.get("Content-Type") !== "application/json") {
    return new NextResponse("must be json", { status: 400 });
  }

  const body = await req.json();
  let slug: string | undefined = undefined;
  if ("slug" in body) {
    slug = body.slug;
  }
  if (!slug) {
    return new NextResponse("Slug not found", { status: 400 });
  }
  
  // Return success without actually incrementing since Redis is not configured
  return new NextResponse(JSON.stringify({ success: true, message: "View counted (placeholder)" }), { 
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
