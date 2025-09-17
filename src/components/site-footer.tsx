import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t px-4 md:px-36">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} CareerPath</p>
        <div className="flex items-center gap-4">
          <Link href="/community">Community</Link>
          <Link href="/trends">Market Trends</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
