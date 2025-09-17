import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RoadmapIndex() {
  const paths = [
    { slug: "data-analyst", title: "Data Analyst" },
    { slug: "software-engineer", title: "Software Engineer" },
    { slug: "ux-designer", title: "UX Designer" },
  ]
  return (
    <div className="space-y-4 px-4 md:px-36 mt-24">
      <h1 className="text-2xl font-semibold">Personalized Roadmaps</h1>
      <p>Get step-by-step learning plans based on your skills and goals. We help you stay on track with clear actions, resources, and milestones to build the career you want.</p>
      <div className="grid md:grid-cols-3 gap-4">
        {paths.map((p) => (
          <Card key={p.slug}>
            <CardHeader>
              <CardTitle className="text-base">{p.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={`/roadmap/${p.slug}`} className="text-brand underline">
                View roadmap
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
