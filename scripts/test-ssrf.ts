// DealNote SSRF unit checks (loop 2 fix verification).
// Run: npx tsx scripts/test-ssrf.ts
// Exits non-zero on any failure. No network, no server needed.
import { isValidAuditUrl } from "../lib/audit";

const blocked = [
  "http://169.254.169.254/latest/meta-data/",
  "http://169.254.1.1/",
  "http://[::ffff:127.0.0.1]/",
  "http://[::ffff:7f00:1]/",
  "http://[::ffff:0a00:1]/",
  "http://100.64.0.1/",
  "http://100.100.0.1/",
  "http://100.127.255.255/",
  "http://127.0.0.1/admin",
  "http://127.0.0.2/",
  "http://2130706433/", // decimal loopback
  "http://0x7f000001/", // hex loopback
  "http://0x7f.0.0.1/", // hex first octet
  "http://localhost/",
  "http://localhost:3000/",
  "http://0.0.0.0/",
  "http://10.0.0.5/",
  "http://192.168.1.1/",
  "http://172.16.0.1/",
  "http://172.31.255.255/",
  "http://[::1]/",
  "http://[fe80::1]/",
  "http://[fc00::1]/",
];

const allowed = [
  "https://example.com",
  "https://www.example.com/path?x=1",
  "http://example.com",
  "https://sub.domain.co.uk/",
  "https://100.128.0.1/", // just outside CGNAT (100.128/10 is public space)
  "https://8.8.8.8/",
];

let failures = 0;
for (const url of blocked) {
  const r = isValidAuditUrl(url);
  if (r.ok) {
    console.log(`FAIL blocked-but-allowed: ${url} -> ${r.url}`);
    failures++;
  } else {
    console.log(`ok blocked: ${url}`);
  }
}
for (const url of allowed) {
  const r = isValidAuditUrl(url);
  if (!r.ok) {
    console.log(`FAIL allowed-but-blocked: ${url} -> ${r.error}`);
    failures++;
  } else {
    console.log(`ok allowed: ${url}`);
  }
}
console.log(failures === 0 ? "SSRF: all checks passed" : `SSRF: ${failures} failures`);
process.exit(failures === 0 ? 0 : 1);
