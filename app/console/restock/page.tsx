import { redirect } from "next/navigation";

export default function RestockRedirect() {
  redirect("/console/stock?view=restock");
}
