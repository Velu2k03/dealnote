#!/usr/bin/env python3
"""Convert fixed-px layout values to fluid rem/clamp in DealNote.
Rules (Velu, 28 Nov 2026): no fixed px for section widths, heights, or
positions. Allowed to stay: 1px/2px borders, focus rings, box-shadow blur
values, and px inside Sakuga vendor files (not touched here).
font-size, padding, margin, gap, max-width, min-width, min-height, height,
width, top/right/bottom/left, border-radius, scroll-margin-top -> rem.
Media breakpoints 640px -> 40rem, 860px -> 53.75rem.
"""
import re, sys, pathlib

def rem(n):
    v = n / 16
    s = f"{v:.4f}".rstrip("0").rstrip(".")
    return f"{s}rem"

LAYOUT_PROPS = (
    "font-size", "padding", "margin", "gap", "max-width", "min-width",
    "max-height", "min-height", "height", "width", "top", "right", "bottom",
    "left", "border-radius", "scroll-margin-top", "flex-basis",
    "letter-spacing",  # em values untouched; px here would convert
)

def convert_css(text):
    out = []
    in_comment = False
    for line in text.splitlines(keepends=True):
        stripped = line.strip()
        if "/*" in line and "*/" not in line.split("/*", 1)[1]:
            in_comment = True
        if in_comment:
            out.append(line)
            if "*/" in line:
                in_comment = False
            continue
        if stripped.startswith("/*") or stripped.startswith("*"):
            out.append(line)
            continue
        # breakpoints
        line = line.replace("@media (max-width: 640px)", "@media (max-width: 40rem)")
        line = line.replace("@media (max-width: 860px)", "@media (max-width: 53.75rem)")
        # box-shadow lines: leave px alone (blur/spread, not layout)
        if "box-shadow" in line or "text-shadow" in line:
            out.append(line)
            continue
        def sub(m):
            prop, val = m.group(1), m.group(2)
            if prop.strip() in ("outline",):
                return m.group(0)
            def px2rem(mm):
                n = int(mm.group(1))
                if n in (1, 2):
                    return mm.group(0)
                return rem(n)
            return f"{prop}{re.sub(r'(\d+)px', px2rem, val)};"
        line = re.sub(r"((?:font-size|padding|margin|gap|max-width|min-width|max-height|min-height|height|width|top|right|bottom|left|border-radius|scroll-margin-top)\s*:\s*)([^;{]+);", sub, line)
        out.append(line)
    return "".join(out)

def convert_tsx(text):
    # "Npx" strings -> rem (1px/2px borders stay)
    def px2rem(mm):
        n = int(mm.group(1))
        if n in (1, 2):
            return mm.group(0)
        return rem(n)
    text = re.sub(r"(\d+)px", px2rem, text)
    # Bare numeric layout values inside style={{ ... }} (React treats them as px):
    # paddingTop: 48 -> paddingTop: "3rem", gap: 12 -> gap: "0.75rem", etc.
    # minHeight: 44 is a 44px tap target -> "2.75rem". height: 1 / width: 1 are
    # 1px hairlines, leave them. maxWidth: 120/140/160 are image widths in px
    # inside style objects for <img> sizing; convert to rem too (fluid).
    BARE = ("paddingTop", "paddingBottom", "paddingLeft", "paddingRight",
            "marginTop", "marginBottom", "marginLeft", "marginRight",
            "height", "width", "fontSize", "gap", "minHeight", "maxWidth",
            "borderRadius", "top", "left", "right", "bottom")
    def style_block(m):
        inner = m.group(1)
        def bare(mm):
            prop, n = mm.group(1), int(mm.group(2))
            if n <= 2:
                return mm.group(0)
            return f'{prop}: "{rem(n)}"'
        inner = re.sub(r"\b(" + "|".join(BARE) + r")\s*:\s*(\d+)\b", bare, inner)
        return "style={{" + inner + "}}"
    text = re.sub(r"style=\{\{(.+?)\}\}", style_block, text, flags=re.S)
    return text

if __name__ == "__main__":
    for p in sys.argv[1:]:
        path = pathlib.Path(p)
        text = path.read_text()
        if p.endswith(".css"):
            text = convert_css(text)
        else:
            text = convert_tsx(text)
        path.write_text(text)
        print("converted", p)
