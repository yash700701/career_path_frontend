import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-[50vh] mt-24 grid place-items-center text-center space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">The page you’re looking for doesn’t exist.</p>
      </div>
      <Button asChild className="">
        <Link href="/">Go home</Link>
      </Button>
    </div>
  )
}
