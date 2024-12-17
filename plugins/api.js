import auth from "@/api/auth";
import media from "@/api/media";
import users from "@/api/users";
import brands from "@/api/brands";
import products from "@/api/products";
import partners from "@/api/partners";
import merchants from "@/api/merchants";
import campaigns from "@/api/campaigns";
import reports from "@/api/reports";
import hubspot from "@/api/hubspot";
import promos from "@/api/promos";

export default (ctx, inject) => {
  let api = {};
  api.auth = auth(ctx);
  api.media = media(ctx);
  api.users = users(ctx);
  api.brands = brands(ctx);
  api.products = products(ctx);
  api.partners = partners(ctx);
  api.merchants = merchants(ctx);
  api.campaigns = campaigns(ctx);
  api.reports = reports(ctx);
  api.hubspot = hubspot(ctx);
  api.promos = promos(ctx);
  inject("api", api);
};
