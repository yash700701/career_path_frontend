import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-[50vh] grid place-items-center text-center space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">The page you’re looking for doesn’t exist.</p>
      </div>
      <Button asChild className="bg-brand text-white hover:bg-brand/90">
        <Link href="/">Go home</Link>
      </Button>
    </div>
  )
}
