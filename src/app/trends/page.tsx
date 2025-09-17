import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TrendsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Job Market & Future Trends</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Rising Roles</CardTitle>
            <CardDescription>India + Global</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Data Engineer, AI Engineer, Product Analyst
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Declining Roles</CardTitle>
            <CardDescription>Keep an eye</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Manual QA, legacy back-office operations</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Skills in Demand</CardTitle>
            <CardDescription>Current snapshot</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Python, SQL, Cloud, React, Generative AI</CardContent>
        </Card>
      </div>
      <p className="text-sm text-muted-foreground">
        Real-time trends can be integrated later (LinkedIn/Indeed APIs or datasets).
      </p>
    </div>
  )
}
