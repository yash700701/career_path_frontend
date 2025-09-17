import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ResumeToolPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">AI Resume Builder</h1>
      <Card>
        <CardHeader>
          <CardTitle>Create or Tailor Resume</CardTitle>
          <CardDescription>Aligned to your chosen career path</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="bg-brand text-white hover:bg-brand/90">Start New Resume</Button>
          <Button variant="outline">Upload Existing</Button>
        </CardContent>
      </Card>
    </div>
  )
}
