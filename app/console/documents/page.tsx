import { getAdminDataSource } from "@/lib/admin";
import { DocumentsClient } from "./DocumentsClient";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const ds = getAdminDataSource();
  const documents = await ds.getDocuments();

  return <DocumentsClient documents={documents} />;
}
