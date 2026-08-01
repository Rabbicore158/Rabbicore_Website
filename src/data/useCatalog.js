import { useMemo } from "react";
import { products as baseProducts } from "./products.js";
import { articles as baseArticles } from "./articles.js";
import { useAdminData } from "../context/AppContext.jsx";

export function useAllProducts() {
  const ctx = useAdminData();
  return useMemo(() => {
    if (!ctx) return baseProducts;
    const { extraProducts, deletedProductIds } = ctx;
    const extraIds = new Set(extraProducts.map((p) => p.id));
    const visibleBase = baseProducts.filter((p) => !deletedProductIds.includes(p.id) && !extraIds.has(p.id));
    return [...extraProducts, ...visibleBase];
  }, [ctx]);
}

export function useAllArticles() {
  const ctx = useAdminData();
  return useMemo(() => {
    if (!ctx) return baseArticles;
    const { extraArticles, deletedArticleIds } = ctx;
    const extraIds = new Set(extraArticles.map((a) => a.id));
    const visibleBase = baseArticles.filter((a) => !deletedArticleIds.includes(a.id) && !extraIds.has(a.id));
    return [...extraArticles, ...visibleBase];
  }, [ctx]);
}
