import { ImageResponse } from "next/server";

export const runtime = "edge";
export const alt = "rmxzy — hacker · systems engineer · fullstack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#0a0a0a",
          backgroundImage:
            "radial-gradient(ellipse at center, rgba(57,255,20,0.18) 0%, transparent 65%)",
          fontFamily: "monospace",
          color: "#fafafa",
          position: "relative",
        }}
      >
        {/* Top-left status */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 48,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 20,
            color: "#a1a1aa",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              background: "#39ff14",
              borderRadius: 999,
              boxShadow: "0 0 12px #39ff14",
            }}
          />
          <span>rmxzy.com</span>
        </div>

        {/* Top-right hint */}
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 48,
            fontSize: 20,
            color: "#52525b",
          }}
        >
          Netherlands · available for work
        </div>

        {/* Big title */}
        <div
          style={{
            display: "flex",
            fontSize: 220,
            lineHeight: 1,
            fontWeight: 900,
            letterSpacing: "-0.05em",
            color: "#fafafa",
            textShadow:
              "0 0 30px rgba(57,255,20,0.7), 0 0 80px rgba(57,255,20,0.35), 0 0 140px rgba(57,255,20,0.18)",
          }}
        >
          rmxzy_
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 30,
            color: "#a1a1aa",
            letterSpacing: "0.04em",
          }}
        >
          hacker · systems engineer · fullstack
        </div>

        {/* Bottom prompt */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 48,
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            color: "#a1a1aa",
          }}
        >
          <span style={{ color: "#39ff14", fontWeight: 700 }}>$</span>
          <span style={{ color: "#fafafa" }}>cat work projects</span>
        </div>

        {/* Bottom-right palette hint */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 48,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 22,
            color: "#52525b",
          }}
        >
          <span>press</span>
          <span
            style={{
              padding: "4px 12px",
              border: "1px solid #262626",
              borderRadius: 6,
              color: "#39ff14",
              fontWeight: 700,
            }}
          >
            cmd k
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
