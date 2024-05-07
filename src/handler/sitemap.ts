import { getAllPublicArticles } from "../service/article";
import { getAllPublicWorkshops } from "../service/workshop";
import { RequestHandler } from "express";
import { internalServerErrorHandler } from "./errorHandler";

export const sendSitemapHandler: RequestHandler = async (req, res, next) => {
  try {
    const sitemaps = [
      `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url><loc>https://inthava.me/</loc>
      <lastmod>date</lastmod>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
      </url>`,
      `<url>
          <loc>https://inthava.me/article/all</loc>
          <lastmod>date</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
      </url>`,
      `<url>
          <loc>https://inthava.me/workshop/all</loc>
          <lastmod>date</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
      </url>`,
    ];
    const allArticle = await getAllPublicArticles();
    const articleSitemap = allArticle.map((article) => {
      return `<url>
    <loc>https://inthava.me/article/${article.slug}</loc>
    <lastmod>${new Date(article.updatedAt).toISOString()}</lastmod>
     <changefreq>monthly</changefreq>
     <priority>1.0</priority>
    </url>`;
    });
    sitemaps[0] = sitemaps[0].replace(
      /date/g,
      new Date(allArticle[0].updatedAt).toISOString(),
    );
    sitemaps[1] = sitemaps[1].replace(
      "date",
      new Date(allArticle[0].updatedAt).toISOString(),
    );
    sitemaps.push(...articleSitemap);
    const allWorkshop = await getAllPublicWorkshops();
    const workshopSitemap = [];
    if (allWorkshop.length > 0) {
      sitemaps[2] = sitemaps[2].replace(
        "date",
        new Date(allWorkshop[0].updatedAt).toISOString(),
      );
      workshopSitemap.push(
        ...allWorkshop.map((workshop) => {
          return `<url>
                <loc>https://inthava.me/workshop/${workshop.slug}</loc>
                <lastmod>${new Date(workshop.updatedAt).toISOString()}</lastmod>
                <changefreq>monthly</changefreq>
                <priority>1.0</priority>
                </url>`;
        }),
      );
      sitemaps.push(...workshopSitemap);
    } else {
      sitemaps[2] = sitemaps[2].replace("date", "2023-09-26T00:00:00.000Z");
    }
    sitemaps.push(`</urlset>`);
    res.header("Content-Type", "application/xml");
    res.send(sitemaps.join(""));
  } catch (e) {
    const err = e as Error;
    internalServerErrorHandler(err, req, res, next);
  }
};
