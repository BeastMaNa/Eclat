import { permanentRedirect } from "next/navigation";

// /catalog was renamed to /products. next.config.ts handles the 308 at the
// edge; this server component is a belt-and-braces fallback for any SSR path.
export default function CatalogRedirect() {
  permanentRedirect("/products");
}
