import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Tables<"user_settings"> | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    getSettings();
  }, []);

  async function getSettings() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) return;

      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error("Error loading settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load settings",
      });
    }
  }

  async function updateSettings() {
    if (!settings) return;
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("No session");

      const { error } = await supabase
        .from("user_settings")
        .update({
          theme: settings.theme,
          notifications_enabled: settings.notifications_enabled,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update settings",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!settings) return null;

  return (
    <div className="container max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>App Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about important updates
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications_enabled || false}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, notifications_enabled: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">
                Choose between light and dark theme
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSettings({
                  ...settings,
                  theme: settings.theme === "light" ? "dark" : "light",
                });
              }}
            >
              {settings.theme === "light" ? "Dark" : "Light"} Mode
            </Button>
          </div>
          <Button
            className="w-full"
            onClick={updateSettings}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}