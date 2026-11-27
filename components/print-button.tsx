"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button className="btn btn-primary" onClick={() => window.print()}>
      <Printer size={18} strokeWidth={1.5} aria-hidden /> Print sample report to PDF
    </button>
  );
}
