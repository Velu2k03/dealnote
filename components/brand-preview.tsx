"use client";

// Interactive white-label brand preview, before checkout (Neon
// whole-site audit, missing-before-launch item). The visitor types a
// brand name, picks a color, or uploads a logo, and sees it on a mini
// report header right here on the sample page. It reads and writes the
// same brand profile the audit page uses (localStorage key
// dealnote-brand-v1), so a brand set here is already set on the audit
// page and in the real proposal PDFs. Nothing leaves the browser.

import { useEffect, useState } from "react";
import { DEFAULT_BRAND, type BrandProfile } from "@/lib/audit";

const BRAND_KEY = "dealnote-brand-v1";

function loadBrand(): BrandProfile {
  try {
    const raw = localStorage.getItem(BRAND_KEY);
    if (raw) return { ...DEFAULT_BRAND, ...(JSON.parse(raw) as BrandProfile) };
  } catch {
    // Keep the default brand profile.
  }
  return DEFAULT_BRAND;
}

export default function BrandPreview() {
  const [brand, setBrand] = useState<BrandProfile>(DEFAULT_BRAND);
  const [logoError, setLogoError] = useState("");

  useEffect(() => {
    setBrand(loadBrand());
  }, []);

  const saveBrand = (next: BrandProfile) => {
    setBrand(next);
    try {
      localStorage.setItem(BRAND_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable; the preview still works for this visit.
    }
  };

  const onLogoFile = (file: File | undefined) => {
    if (!file) return;
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      setLogoError("Choose a PNG or JPG logo.");
      return;
    }
    if (file.size > 512 * 1024) {
      setLogoError("Choose a logo under 512 KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      saveBrand({ ...brand, logoDataUrl: String(reader.result) });
      setLogoError("");
    };
    reader.readAsDataURL(file);
  };

  const logoSrc = brand.logoDataUrl || brand.logoUrl || "";
  const name = brand.brandName === DEFAULT_BRAND.brandName ? "Your Studio" : brand.brandName;
  const color = brand.primaryColor || "#0F766E";

  return (
    <div className="card glass mt-24 no-print">
      <h2 className="mt-0">Try your brand on this report</h2>
      <p className="reading">
        Type your studio name, pick your color, or upload your logo, and see it on the report header
        below. This is the same brand profile the audit page uses, stored only in this browser, so it
        carries straight into your real reports and proposal PDFs.
      </p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <label htmlFor="preview-brand-name">Brand / business name</label>
          <input
            id="preview-brand-name"
            type="text"
            value={brand.brandName === DEFAULT_BRAND.brandName ? "" : brand.brandName}
            placeholder="Your Studio"
            onChange={(e) => saveBrand({ ...brand, brandName: e.target.value })}
            style={{ minWidth: 220 }}
          />
        </div>
        <div>
          <label htmlFor="preview-brand-color">Primary brand color</label>
          <input
            id="preview-brand-color"
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(color) ? color : "#0F766E"}
            onChange={(e) => saveBrand({ ...brand, primaryColor: e.target.value })}
            style={{ width: 56, height: 40, padding: 4 }}
          />
        </div>
        <div>
          <label htmlFor="preview-logo">Logo (PNG or JPG, under 512 KB)</label>
          <input id="preview-logo" type="file" accept="image/png,image/jpeg" onChange={(e) => onLogoFile(e.target.files?.[0])} />
          {logoError ? <p className="field-error mt-8" role="alert">{logoError}</p> : null}
        </div>
      </div>
      <div
        className="mt-24"
        style={{ borderTop: `3px solid ${color}`, paddingTop: 16, background: "#fff" }}
        aria-label="Brand preview"
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoSrc} alt="" style={{ maxHeight: 40, maxWidth: 120 }} />
          ) : null}
          <p style={{ fontSize: 20, fontWeight: 700, color, margin: 0 }}>{name}</p>
        </div>
        <p className="mt-8 mb-0" style={{ color: "#475569" }}>
          Website Teardown and Proposal — prepared by {name}. This is how your brand looks on a client
          report. The DealNote name never appears on client reports.
        </p>
      </div>
    </div>
  );
}
