/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://oem-x.my.id",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: [
    "/_allauth/*",
    "/api/*",
    "/drf/*",
    "/ninja/*",
    "/account/*",   // 🚫 jangan index halaman akun
    "/admin/*",     // 🚫 jangan index halaman admin
    "/blog/not-found",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: ["/blog", "/blog/*"], // ✅ blog publik tetap boleh
        disallow: [
          "/_allauth",
          "/api",
          "/drf",
          "/ninja",
          "/account",
          "/admin",
          "/blog/not-found",
        ],
      },
    ],
    additionalSitemaps: [
      "https://oem-x.my.id/sitemap.xml",        // default sitemap
      "https://oem-x.my.id/server-sitemap.xml", // bisa untuk backend (jika ada)
    ],
  },
}
