import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Overview() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>Complete your profile to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Your profile is incomplete. Add more information to get started.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Update your profile, change settings, and more.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}