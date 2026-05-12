import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ENSO Admin",
  robots: { index: false, follow: false }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Keep this layout minimal so `/admin/login` can have its own full-page UI.
  return <>{children}</>;
}


