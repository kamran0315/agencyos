import { PageHeader } from "@/components/common/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { isDemoMode } from "@/lib/supabase/config";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Workspace preferences and account." />

      <div className="grid gap-4 p-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarFallback className="bg-foreground text-background">A</AvatarFallback>
              </Avatar>
              <Button size="sm" variant="outline">
                Change photo
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" defaultValue="Agency Owner" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="admin@agencyos.app" />
              </div>
            </div>
            <Button>Save changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PrefRow label="Deadline reminders" hint="48 hours before due" defaultChecked />
            <PrefRow label="Task assignments" defaultChecked />
            <PrefRow label="Status changes" defaultChecked />
            <PrefRow label="Weekly digest" hint="Sent Monday at 8am" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <IntegrationRow
              name="Supabase"
              status={isDemoMode ? "Demo mode — set env vars to connect" : "Connected"}
              connected={!isDemoMode}
            />
            <IntegrationRow
              name="OpenAI"
              status="Set OPENAI_API_KEY to enable live AI generation"
              connected={false}
            />
            <IntegrationRow name="Slack" status="Not connected" connected={false} />
            <IntegrationRow name="Stripe" status="Not connected" connected={false} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PrefRow({
  label,
  hint,
  defaultChecked,
}: {
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function IntegrationRow({
  name,
  status,
  connected,
}: {
  name: string;
  status: string;
  connected: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border px-4 py-3">
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{status}</p>
      </div>
      <Button size="sm" variant={connected ? "outline" : "default"}>
        {connected ? "Manage" : "Connect"}
      </Button>
    </div>
  );
}
