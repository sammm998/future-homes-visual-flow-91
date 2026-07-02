import { forwardRef } from "react";
import logo from "@/assets/future-homes-logo.png";
import { Slide, PresentationTheme, SLIDE_W, SLIDE_H } from "./types";

interface Props {
  slide: Slide;
  theme: PresentationTheme;
  /** scale factor applied via CSS transform (1 = full 1280x720) */
  scale?: number;
}

/**
 * Renders a single slide at full 1280x720 resolution and optionally scales it
 * down with a CSS transform. Used both for the editor preview and PDF export.
 */
const SlideView = forwardRef<HTMLDivElement, Props>(({ slide, theme, scale = 1 }, ref) => {
  const wrapperStyle: React.CSSProperties = {
    width: SLIDE_W * scale,
    height: SLIDE_H * scale,
  };
  const inner: React.CSSProperties = {
    width: SLIDE_W,
    height: SLIDE_H,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
    position: "relative",
    overflow: "hidden",
    background: "#ffffff",
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    color: theme.primary,
  };

  const Logo = ({ dark = false, size = 46 }: { dark?: boolean; size?: number }) => (
    <img
      src={logo}
      alt="Future Homes"
      crossOrigin="anonymous"
      style={{
        height: size,
        objectFit: "contain",
        filter: dark ? "brightness(0) invert(1)" : "none",
      }}
    />
  );

  const content = () => {
    switch (slide.layout) {
      case "cover":
        return (
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            {slide.image && (
              <img
                src={slide.image}
                crossOrigin="anonymous"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.75) 100%)",
              }}
            />
            <div style={{ position: "absolute", top: 56, left: 64 }}>
              <Logo dark size={56} />
            </div>
            <div style={{ position: "absolute", left: 64, bottom: 80, right: 64, color: "#fff" }}>
              <div
                style={{ width: 90, height: 5, background: theme.accent, marginBottom: 28 }}
              />
              <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.05 }}>
                {slide.title}
              </div>
              {slide.subtitle && (
                <div style={{ fontSize: 30, marginTop: 18, opacity: 0.9 }}>
                  {slide.subtitle}
                </div>
              )}
              {slide.body && (
                <div
                  style={{
                    fontSize: 40,
                    marginTop: 26,
                    color: theme.accent,
                    fontWeight: 700,
                  }}
                >
                  {slide.body}
                </div>
              )}
            </div>
          </div>
        );

      case "image-full":
        return (
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            {slide.image ? (
              <img
                src={slide.image}
                crossOrigin="anonymous"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "#eee" }} />
            )}
            {(slide.title || slide.subtitle) && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  padding: "40px 64px",
                  width: "100%",
                  background:
                    "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
                  color: "#fff",
                }}
              >
                <div style={{ fontSize: 40, fontWeight: 700 }}>{slide.title}</div>
                {slide.subtitle && (
                  <div style={{ fontSize: 24, opacity: 0.9 }}>{slide.subtitle}</div>
                )}
              </div>
            )}
          </div>
        );

      case "image-text":
        return (
          <div style={{ display: "flex", width: "100%", height: "100%" }}>
            <div style={{ width: "48%", height: "100%" }}>
              {slide.image ? (
                <img
                  src={slide.image}
                  crossOrigin="anonymous"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#eee" }} />
              )}
            </div>
            <div
              style={{
                width: "52%",
                padding: "72px 64px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 70, height: 5, background: theme.accent, marginBottom: 24 }} />
              <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 24 }}>
                {slide.title}
              </div>
              <div style={{ fontSize: 21, lineHeight: 1.6, color: "#333", whiteSpace: "pre-wrap" }}>
                {slide.body}
              </div>
            </div>
          </div>
        );

      case "specs":
        return (
          <div style={{ padding: "72px 64px", height: "100%" }}>
            <Logo size={40} />
            <div style={{ fontSize: 44, fontWeight: 700, margin: "28px 0 8px" }}>
              {slide.title}
            </div>
            {slide.subtitle && (
              <div style={{ fontSize: 24, color: "#666", marginBottom: 30 }}>
                {slide.subtitle}
              </div>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 18,
                marginTop: 20,
              }}
            >
              {(slide.specs || []).map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderLeft: `5px solid ${theme.accent}`,
                    background: "#f7f5f0",
                    padding: "18px 24px",
                  }}
                >
                  <span style={{ fontSize: 22, color: "#666" }}>{s.label}</span>
                  <span style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "gallery": {
        const imgs = (slide.images || []).slice(0, 6);
        return (
          <div style={{ padding: "56px 64px", height: "100%" }}>
            <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 24 }}>
              {slide.title}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gridAutoRows: "244px",
                gap: 14,
              }}
            >
              {imgs.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  crossOrigin="anonymous"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ))}
            </div>
          </div>
        );
      }

      case "closing":
        return (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: theme.primary,
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: 64,
            }}
          >
            <Logo dark size={80} />
            <div style={{ fontSize: 48, fontWeight: 700, marginTop: 40 }}>{slide.title}</div>
            {slide.subtitle && (
              <div style={{ fontSize: 26, opacity: 0.85, marginTop: 16 }}>{slide.subtitle}</div>
            )}
            {slide.body && (
              <div style={{ fontSize: 22, color: theme.accent, marginTop: 30 }}>{slide.body}</div>
            )}
          </div>
        );

      case "text":
      default:
        return (
          <div style={{ padding: "80px 72px", height: "100%" }}>
            <Logo size={40} />
            <div style={{ width: 70, height: 5, background: theme.accent, margin: "30px 0 24px" }} />
            <div style={{ fontSize: 46, fontWeight: 700, marginBottom: 28 }}>{slide.title}</div>
            <div style={{ fontSize: 24, lineHeight: 1.7, color: "#333", whiteSpace: "pre-wrap" }}>
              {slide.body}
            </div>
          </div>
        );
    }
  };

  return (
    <div style={wrapperStyle}>
      <div ref={ref} style={inner}>
        {content()}
      </div>
    </div>
  );
});

SlideView.displayName = "SlideView";
export default SlideView;
