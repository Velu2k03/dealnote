"use client";

// Sakuga VFX controls (28 Nov 2026, MIT, Justin Finkelman,
// https://github.com/finktheartist/sakuga-vfx, commit c3dabb1).
// SkillSpector scan: score 50, MEDIUM, CAUTION — the HIGH findings are
// AE1 parser-limit false positives on look.mjs references, plus one
// MEDIUM for no declared tool scope; no network, credential, or
// exfiltration findings. Installed to ~/workspace/custom-skills/sakuga-vfx.
// The component files are used by hand, exactly as shipped (plain script
// tags, not modules, never split or rewritten, per the skill's "Wire it
// in" section). The repo's own scripts (tools/build.mjs, tools/test.mjs,
// look.mjs) are NOT run here.
//
// Each file carries its own copy of the core; the first loaded sets
// window.SakugaFX and the rest reuse it, so any mix shares one canvas
// and one animation loop. Scripts live in public/sakuga-vfx/ (copied
// from the repo, plus LICENSE.txt). They are static assets, not part of
// the webpack bundle: First Load JS does not grow, but the browser
// downloads ~44 KB per control used on a page, and toggle.js is ~506 KB
// (43 painted frames), so the toggle is lazy-loaded only on the pages
// that use it (/audit, /sample).
//
// Palette: the Sakuga defaults are pinkish already (accent #ff5fa8,
// primary #8f8df7, lavender #b8b3ff, violet line #5a4fd8, ink #1d1a4a)
// and the page's :root --sk-* variables in globals.css set them
// explicitly. The pink accent is decorative (wedges, checks, bursts),
// never body text: readable pink text and buttons use the site accent
// #be185d (6.04:1 on white, AA).
//
// React 18 + custom elements, two gotchas fixed in the wrappers below
// (verified live 28 Nov 2026): (1) React's initial value/checked/
// selected prop lands as an OWN data property on a not-yet-upgraded
// element and permanently shadows the component's prototype
// getter/setter, so no wrapper passes those as JSX props; each sync
// effect deletes any own shadowing property and assigns through the
// real setter once the tag is defined. (2) React writes
// disabled={false} as the string attribute disabled="false", which
// the button reads as disabled via hasAttribute, so disabled is also
// set imperatively, never as a JSX prop.
// No Sakuga element is used on /terms or /privacy (simple fade only),
// and no Sakuga code touches PDFs or print (lib/pdf-html.ts).

import Script from "next/script";
import {
  forwardRef,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

/** A Sakuga custom element: a plain HTMLElement with the control's
 *  properties and methods attached by its script. */
export type SakugaEl = HTMLElement & Record<string, unknown>;

// React 18 JSX intrinsic elements for the eleven Sakuga tags.
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "sakuga-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        variant?: "primary" | "secondary";
        type?: "button" | "submit";
        disabled?: boolean;
      };
      "sakuga-toggle": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string;
        checked?: boolean;
        name?: string;
        value?: string;
        disabled?: boolean;
      };
      "sakuga-slider": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string;
        value?: string | number;
        min?: string | number;
        max?: string | number;
        step?: string | number;
        unit?: string;
        name?: string;
        disabled?: boolean;
      };
      "sakuga-checkbox": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        checked?: boolean;
        name?: string;
        value?: string;
        disabled?: boolean;
      };
      "sakuga-radio": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string;
        value?: string;
        name?: string;
        disabled?: boolean;
      };
      "sakuga-input": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string;
        placeholder?: string;
        value?: string;
        type?: string;
        autocomplete?: string;
        name?: string;
        disabled?: boolean;
      };
      "sakuga-tabs": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string;
        selected?: string | number;
      };
      "sakuga-progress": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string;
        value?: string | number;
        "done-label"?: string;
      };
      "sakuga-rating": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        label?: string;
        value?: string | number;
        name?: string;
        disabled?: boolean;
      };
      "sakuga-toast": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        duration?: string | number;
        message?: string;
      };
      "sakuga-tooltip": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        text?: string;
        label?: string;
      };
    }
  }
}

const LOADED = new Set<string>();

/** React can render a Sakuga tag before its script has defined it. On
 *  a not-yet-upgraded element React's initial value/checked/selected
 *  prop lands as an OWN data property, which then permanently shadows
 *  the component's prototype getter/setter even after upgrade: el.value
 *  reads the stale own property while the real control holds the new
 *  value (verified live 28 Nov 2026: typed text sat in the shadow
 *  input while el.value stayed "", a clicked 5-star set score 5 while
 *  el.value stayed 0). So no wrapper passes value/checked/selected as
 *  a JSX prop; each sync effect deletes any own shadowing property and
 *  assigns through the real setter once the tag is defined. */
function unshadow(el: SakugaEl, prop: string) {
  if (Object.prototype.hasOwnProperty.call(el, prop)) {
    delete (el as Record<string, unknown>)[prop];
  }
}

function whenDefined(tag: string, fn: () => void) {
  if (typeof customElements === "undefined") return;
  if (customElements.get(tag)) fn();
  else customElements.whenDefined(tag).then(fn);
}

/** Load Sakuga scripts. `strategy` is afterInteractive for the small
 *  controls every page needs (button, toast, tooltip) and lazyOnload
 *  for the rest, so the first paint never waits on them. */
export function SakugaScripts({
  names,
  strategy = "lazyOnload",
}: {
  names: string[];
  strategy?: "afterInteractive" | "lazyOnload";
}) {
  return (
    <>
      {names.map((name) => (
        <Script
          key={name}
          src={`/sakuga-vfx/${name}.js`}
          strategy={strategy}
          onLoad={() => LOADED.add(name)}
        />
      ))}
    </>
  );
}

/** Fire a toast through the singleton host in the layout. The toast
 *  element is one at a time and replaces its message on a repeat show. */
export function showToast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("dealnote:toast", { detail: message }));
}

/** The one <sakuga-toast> on the page, fixed bottom-left. It keeps its
 *  236x56 place while hidden, so it is positioned fixed here. */
export function SakugaToastHost() {
  const ref = useRef<SakugaEl | null>(null);
  useEffect(() => {
    const onToast = (e: Event) => {
      const el = ref.current;
      const msg = (e as CustomEvent<string>).detail;
      if (el && typeof el.show === "function" && msg) (el.show as (m: string) => void)(msg);
    };
    window.addEventListener("dealnote:toast", onToast);
    return () => window.removeEventListener("dealnote:toast", onToast);
  }, []);
  return (
    <sakuga-toast
      ref={ref as never}
      style={{ position: "fixed", left: 24, bottom: 24, zIndex: 60 }}
      aria-live="polite"
    />
  );
}

/** Primary Sakuga button. The click plays the impact whatever happens
 *  next; call el.done() only when the action actually worked. For a
 *  form submit use type="submit": the script must already be loaded
 *  (it is, afterInteractive in the layout), otherwise an unregistered
 *  custom element cannot submit. */
export const SakugaButton = forwardRef<
  SakugaEl,
  {
    children: ReactNode;
    variant?: "primary" | "secondary";
    type?: "button" | "submit";
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
  }
>(function SakugaButton({ children, variant, type = "button", disabled, onClick, className }, ref) {
  const inner = useRef<SakugaEl | null>(null);
  // disabled must NOT be a JSX prop: React writes disabled={false} on
  // a custom element as the string attribute disabled="false", and the
  // component reads disabled as hasAttribute, so every button would
  // be disabled (verified live 28 Nov 2026: the inner shadow button
  // was disabled with running=false, and neither a real mouse click
  // nor a shadow .click() reached the host). Set it through the real
  // setter instead, after deleting any own shadowing property.
  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    unshadow(el, "disabled");
    whenDefined("sakuga-button", () => {
      if (el.isConnected) el.disabled = !!disabled;
    });
  }, [disabled]);
  return (
    <sakuga-button
      ref={(node: SakugaEl | null) => {
        inner.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as { current: SakugaEl | null }).current = node;
      }}
      variant={variant}
      type={type}
      onClick={onClick}
      className={className}
    >
      {children}
    </sakuga-button>
  );
});

/** A real switch. Setting checked from code jumps to the end without
 *  the animation; only a person flipping it plays the drawing. */
export function SakugaToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const ref = useRef<SakugaEl | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    unshadow(el, "checked");
    const on = () => onChange(Boolean(el.checked));
    el.addEventListener("change", on);
    return () => el.removeEventListener("change", on);
  }, [onChange]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    unshadow(el, "checked");
    whenDefined("sakuga-toggle", () => {
      if (el.isConnected) el.checked = checked;
    });
  }, [checked]);
  return <sakuga-toggle ref={ref as never} label={label} />;
}

/** Range slider. Fires input while it moves and change when let go. */
export function SakugaSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  const ref = useRef<SakugaEl | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    unshadow(el, "value");
    const on = () => {
      const v = Number(el.value);
      if (!Number.isNaN(v)) onChange(v);
    };
    el.addEventListener("change", on);
    el.addEventListener("input", on);
    return () => {
      el.removeEventListener("change", on);
      el.removeEventListener("input", on);
    };
  }, [onChange]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    unshadow(el, "value");
    whenDefined("sakuga-slider", () => {
      if (el.isConnected && Number(el.value) !== value) el.value = value;
    });
  }, [value]);
  return (
    <sakuga-slider
      ref={ref as never}
      label={label}
      min={min}
      max={max}
      step={step}
      unit={unit}
    />
  );
}

/** Checkbox. The text inside is the label; underneath is a real checkbox. */
export function SakugaCheckbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  const ref = useRef<SakugaEl | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    unshadow(el, "checked");
    const on = () => onChange(Boolean(el.checked));
    el.addEventListener("change", on);
    return () => el.removeEventListener("change", on);
  }, [onChange]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    unshadow(el, "checked");
    whenDefined("sakuga-checkbox", () => {
      if (el.isConnected) el.checked = checked;
    });
  }, [checked]);
  return (
    <sakuga-checkbox ref={ref as never}>
      {children}
    </sakuga-checkbox>
  );
}

/** Radio group. Options are read once, when it first appears, so the
 *  options list must be static; changing them afterwards does nothing. */
export function SakugaRadio({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string; selected?: boolean }[];
  value: string;
  onChange: (value: string) => void;
}) {
  const ref = useRef<SakugaEl | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    unshadow(el, "value");
    const on = () => onChange(String(el.value ?? ""));
    el.addEventListener("change", on);
    return () => el.removeEventListener("change", on);
  }, [onChange]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    unshadow(el, "value");
    whenDefined("sakuga-radio", () => {
      if (el.isConnected && el.value !== value) el.value = value;
    });
  }, [value]);
  return (
    <sakuga-radio ref={ref as never} label={label}>
      {options.map((o) => (
        <option key={o.value} value={o.value} selected={o.selected}>
          {o.label}
        </option>
      ))}
    </sakuga-radio>
  );
}

/** Text input. Every key kicks up dust where the caret is. It has no
 *  validation styles and does not pass required/pattern through, so
 *  callers must validate the value themselves (the audit page does,
 *  via isValidAuditUrl). */
export function SakugaInput({
  label,
  type = "text",
  placeholder,
  value,
  name,
  autoFocus,
  onInput,
  onKeyDown,
  ariaLabel,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  name?: string;
  autoFocus?: boolean;
  onInput: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  ariaLabel?: string;
}) {
  const ref = useRef<SakugaEl | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    unshadow(el, "value");
    const on = () => onInput(String(el.value ?? ""));
    el.addEventListener("input", on);
    return () => el.removeEventListener("input", on);
  }, [onInput]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    unshadow(el, "value");
    whenDefined("sakuga-input", () => {
      if (el.isConnected && el.value !== value) el.value = value;
    });
  }, [value]);
  useEffect(() => {
    if (autoFocus) ref.current?.focus?.();
  }, [autoFocus]);
  return (
    <sakuga-input
      ref={ref as never}
      label={label}
      type={type}
      placeholder={placeholder}
      name={name}
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
    />
  );
}

/** Tabs. It only draws the tabs; the caller shows the panel on change. */
export function SakugaTabs({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: number;
  onChange: (detail: { index: number; value: string; label: string }) => void;
}) {
  const ref = useRef<SakugaEl | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    unshadow(el, "selected");
    const on = (e: Event) => onChange((e as CustomEvent).detail as { index: number; value: string; label: string });
    el.addEventListener("change", on);
    return () => el.removeEventListener("change", on);
  }, [onChange]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    unshadow(el, "selected");
    whenDefined("sakuga-tabs", () => {
      if (el.isConnected && el.selected !== selected) el.selected = selected;
    });
  }, [selected]);
  return (
    <sakuga-tabs ref={ref as never} label={label}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </sakuga-tabs>
  );
}

/** Progress bar. Drive it with set(n), 0 to 1; it eases toward the
 *  number, and sakuga:done fires once when the bar itself reaches 1. */
export const SakugaProgress = forwardRef<
  SakugaEl,
  { label: string; progress: number; onDone?: () => void }
>(function SakugaProgress({ label, progress, onDone }, ref) {
  const inner = useRef<SakugaEl | null>(null);
  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    unshadow(el, "value");
    whenDefined("sakuga-progress", () => {
      if (el.isConnected && typeof el.set === "function") (el.set as (n: number) => void)(progress);
    });
  }, [progress]);
  useEffect(() => {
    const el = inner.current;
    if (!el || !onDone) return;
    el.addEventListener("sakuga:done", onDone);
    return () => el.removeEventListener("sakuga:done", onDone);
  }, [onDone]);
  return (
    <sakuga-progress
      ref={(node: SakugaEl | null) => {
        inner.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as { current: SakugaEl | null }).current = node;
      }}
      label={label}
    />
  );
});

/** Five stars. Clicking the lit star again clears it to 0. */
export function SakugaRating({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const ref = useRef<SakugaEl | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    unshadow(el, "value");
    const on = () => onChange(Number(el.value) || 0);
    el.addEventListener("change", on);
    return () => el.removeEventListener("change", on);
  }, [onChange]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    unshadow(el, "value");
    whenDefined("sakuga-rating", () => {
      if (el.isConnected && Number(el.value) !== value) el.value = value;
    });
  }, [value]);
  return <sakuga-rating ref={ref as never} label={label} />;
}

/** Help button. Opens on hover, focus and tap; Escape closes it. */
export function SakugaTooltip({ text, label }: { text: string; label?: string }) {
  return <sakuga-tooltip text={text} label={label ?? "Help"} />;
}
