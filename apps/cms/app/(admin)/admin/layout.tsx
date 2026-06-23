import { AdminLayout } from "@blawness/admin-kit/shell";
import { requireUser } from "@blawness/admin-kit/auth-helpers";
import type { NavItem } from "@blawness/admin-kit/shell/sidebar";

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "Home" },
  { label: "Listings", href: "/admin/listings", icon: "Building2" },
  { label: "Agents", href: "/admin/agents", icon: "Users" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "Star" },
  { label: "Articles", href: "/admin/articles", icon: "FileText" },
  { label: "Inquiries", href: "/admin/inquiries", icon: "MessageSquare" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
  { label: "Media", href: "/admin/media", icon: "Image" },
  { label: "Users", href: "/admin/users", icon: "UserRound" },
];

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return (
    <AdminLayout navItems={navItems} brandName="Property CMS">
      {children}
    </AdminLayout>
  );
}
