import type { VercelRequest, VercelResponse } from "@vercel/node";

const PROJECT_ID = "karatpay-retailers";
const APP_BASE_URL = "https://karatpay-retailers.vercel.app";

// Safely extract a string value from a Firestore REST API field
function str(field: any): string {
    return field?.stringValue ?? field?.integerValue ?? field?.doubleValue ?? "";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { retailerId, designId } = req.query as {
        retailerId: string;
        designId: string;
    };

    // The destination URL in the app for this design
    const appViewUrl = `${APP_BASE_URL}/view/${retailerId}?designId=${designId}&activeTab=designs`;

    // Defaults if Firestore fetch fails
    let designName = "Jewelry Design";
    let designPurity = "";
    let designCategory = "";
    let designDescription = "";
    let shopName = "Karatpay";

    try {
        // Fetch design details from Firestore REST API (public read)
        const designRes = await fetch(
            `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/designs/${designId}`
        );
        if (designRes.ok) {
            const designData = await designRes.json();
            const f = designData.fields ?? {};
            designName = str(f.name) || designName;
            designPurity = str(f.purity);
            designCategory = str(f.category);
            designDescription = str(f.description);
        }

        // Fetch retailer config for shop name
        const retailerRes = await fetch(
            `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${retailerId}`
        );
        if (retailerRes.ok) {
            const retailerData = await retailerRes.json();
            const f = retailerData.fields ?? {};
            shopName = str(f.shopName) || shopName;
        }
    } catch (_) {
        // Use defaults if network/Firestore fails
    }

    // Build OG title + description
    const ogTitle = `${designName}${designPurity ? ` · ${designPurity}` : ""}`;
    const descParts = [
        designCategory,
        designDescription || "Exquisite handcrafted jewelry",
        `Available at ${shopName}`,
    ].filter(Boolean);
    const ogDescription = descParts.join(" · ");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(ogTitle)} | ${escapeHtml(shopName)}</title>

  <!-- Open Graph (WhatsApp, Facebook, iMessage) -->
  <meta property="og:type"        content="product" />
  <meta property="og:site_name"   content="${escapeHtml(shopName)}" />
  <meta property="og:title"       content="${escapeHtml(ogTitle)}" />
  <meta property="og:description" content="${escapeHtml(ogDescription)}" />
  <meta property="og:url"         content="${escapeHtml(appViewUrl)}" />

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary" />
  <meta name="twitter:title"       content="${escapeHtml(ogTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(ogDescription)}" />

  <!-- Canonical -->
  <link rel="canonical" href="${escapeHtml(appViewUrl)}" />

  <!-- Instant redirect for real users -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(appViewUrl)}" />

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; background: #FFF8E1;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .card {
      text-align: center; padding: 32px 24px; max-width: 360px;
      background: #fff; border-radius: 16px;
      box-shadow: 0 4px 24px rgba(93,64,55,0.12);
    }
    .icon { font-size: 48px; margin-bottom: 12px; }
    .shop  { font-size: 13px; color: #8D6E63; margin-bottom: 8px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
    .name  { font-size: 20px; color: #3E2723; font-weight: 700; margin-bottom: 4px; }
    .meta  { font-size: 14px; color: #6D4C41; margin-bottom: 20px; }
    .btn   {
      display: inline-block; padding: 12px 28px;
      background: #D4AF37; color: #fff; border-radius: 24px;
      text-decoration: none; font-weight: 600; font-size: 15px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">💍</div>
    <div class="shop">${escapeHtml(shopName)}</div>
    <div class="name">${escapeHtml(ogTitle)}</div>
    <div class="meta">${escapeHtml(descParts.slice(0, 2).join(" · "))}</div>
    <a class="btn" href="${escapeHtml(appViewUrl)}">View Design →</a>
  </div>
  <script>window.location.replace('${escapeJs(appViewUrl)}');</script>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60");
    res.status(200).send(html);
}

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function escapeJs(s: string): string {
    return s.replace(/'/g, "\\'").replace(/\\/g, "\\\\");
}
