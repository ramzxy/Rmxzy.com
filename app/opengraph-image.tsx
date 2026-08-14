import { ImageResponse } from "next/server";

export const runtime = "edge";
export const alt = "rmxzy — systems, security, and experiments by Ilia Mirzaali";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#111011";
const PAPER = "#e8e1d1";
const PINK = "#ff2d78";
const ACID = "#b7ef24";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: INK,
          color: PAPER,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 34,
            left: 44,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 18,
            letterSpacing: "0.08em",
          }}
        >
          <div style={{ width: 54, height: 9, background: PINK }} />
          <span>ILIA MIRZAALI / RMXZY</span>
        </div>

        <div
          style={{
            width: "67%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "86px 40px 80px 44px",
          }}
        >
          <div
            style={{
              maxWidth: 720,
              display: "flex",
              flexDirection: "column",
              fontSize: 94,
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: "-0.015em",
            }}
          >
            <span>I TAKE SYSTEMS APART.</span>
            <span style={{ marginTop: 18, padding: "6px 16px 10px", background: PINK, color: INK }}>
              SOME GO BACK TOGETHER.
            </span>
          </div>
          <div style={{ marginTop: 36, fontSize: 22, color: "#a7a0a0" }}>
            systems / security / sound / experiments
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 72,
            right: 45,
            width: 340,
            height: 470,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 28,
            background: PINK,
            color: INK,
            transform: "rotate(2deg)",
            boxShadow: `15px 17px 0 ${ACID}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
            <span>NO. 01</span><span>2026</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 74, fontWeight: 900, lineHeight: 0.82, letterSpacing: "-0.015em" }}>
            <span>SEEMED</span><span>LIKE A</span><span>GOOD IDEA</span>
          </div>
          <div style={{ alignSelf: "flex-end", padding: "7px 12px", background: PAPER, fontSize: 13 }}>
            so I built it
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: -20,
            bottom: 17,
            left: -20,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: ACID,
            color: INK,
            fontSize: 16,
            letterSpacing: "0.12em",
            transform: "rotate(-1deg)",
          }}
        >
          RMXZY.COM / UPDATED WHENEVER I FEEL LIKE IT
        </div>
      </div>
    ),
    { ...size },
  );
}
