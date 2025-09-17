import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardHub() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Assessment Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Start Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-brand text-white hover:bg-brand/90">
              <Link href="/assessment">Begin</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>See Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/assessment#paths">View Careers</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>View Roadmaps</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/roadmap">Open Roadmaps</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
