import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export function SidebarProfile({ isCollapsed }: { isCollapsed: boolean }) {
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('No session');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: settings, refetch: refetchSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('No session');

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleThemeToggle = async () => {
    if (!settings) return;

    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    const { error } = await supabase
      .from('user_settings')
      .update({ theme: newTheme })
      .eq('id', settings.id);

    if (!error) {
      refetchSettings();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth/login');
  };

  return (
    <div className="border-t p-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2",
              isCollapsed && "justify-center"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>
                {profile?.first_name?.[0]}
                {profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium">
                  {profile?.first_name} {profile?.last_name}
                </span>
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start" side="top">
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <h4 className="text-sm font-medium">Account</h4>
              <p className="text-xs text-muted-foreground">
                Manage your account settings
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="theme-toggle">Dark Mode</Label>
              <Switch
                id="theme-toggle"
                checked={settings?.theme === 'dark'}
                onCheckedChange={handleThemeToggle}
              />
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}