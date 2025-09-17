import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function InterviewToolPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Mock Interview</h1>
      <Card>
        <CardHeader>
          <CardTitle>Role-based practice</CardTitle>
          <CardDescription>Get feedback and a confidence score</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="bg-brand text-white hover:bg-brand/90">Start Interview</Button>
          <p className="text-sm text-muted-foreground">We’ll ask questions and evaluate your responses.</p>
        </CardContent>
      </Card>
    </div>
  )
}
