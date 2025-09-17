import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RoadmapPage({ params }: { params: { slug: string } }) {
  const title = params.slug
    .split("-")
    .map((s) => s[0]?.toUpperCase() + s.slice(1))
    .join(" ")
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{title} Roadmap</h1>

      <Card>
        <CardHeader>
          <CardTitle>Short-Term Plan</CardTitle>
          <CardDescription>Next 6 months</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <ul className="list-disc pl-5">
            <li>Master foundational skills</li>
            <li>Complete 2–3 hands-on projects</li>
            <li>Earn one industry certification</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Long-Term Plan</CardTitle>
          <CardDescription>2–3 years</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <ul className="list-disc pl-5">
            <li>Advanced specialization</li>
            <li>Build a portfolio of 6–10 projects</li>
            <li>Mentor juniors or contribute to community</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>Courses, certifications, projects</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-3 text-sm">
          <div>
            <h3 className="font-medium">Courses</h3>
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>Coursera Specializations</li>
              <li>Udemy Bootcamps</li>
              <li>NPTEL Modules</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium">Certifications</h3>
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>Google Data Analytics</li>
              <li>Meta Frontend</li>
              <li>Azure Fundamentals</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium">Projects</h3>
            <ul className="list-disc pl-5 text-muted-foreground">
              <li>Capstone dashboard</li>
              <li>End-to-end case study</li>
              <li>Open-source contribution</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
