import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SkillsHubPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Skill Gap Analyzer</h1>
      <Card>
        <CardHeader>
          <CardTitle>Compare Your Skills vs Market</CardTitle>
          <CardDescription>See what's in demand and close gaps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Upload your skills or sync from profile; we’ll compare to market skills.
          </div>
          <Button variant="outline">Analyze Skills</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Learning Hub</CardTitle>
          <CardDescription>AI-curated courses and projects</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
          {["Coursera", "Udemy", "NPTEL"].map((s) => (
            <div key={s} className="border rounded-lg p-4">
              <h3 className="font-medium">{s}</h3>
              <p className="text-muted-foreground">Recommended playlists and tracks</p>
              <Button size="sm" className="mt-2">
                Browse
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gamified Progress</CardTitle>
          <CardDescription>Badges and streaks</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Earn badges as you complete modules and keep your daily streak alive!
        </CardContent>
      </Card>
    </div>
  )
}
