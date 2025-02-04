import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminNavbar />
      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}
