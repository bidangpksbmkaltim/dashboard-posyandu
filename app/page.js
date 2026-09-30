// app/page.js
import { redirect } from "next/navigation";
import { isLoggedIn } from "@/lib/session";

export default function RootPage() {
  redirect(isLoggedIn() ? "/dashboard" : "/login");
}
