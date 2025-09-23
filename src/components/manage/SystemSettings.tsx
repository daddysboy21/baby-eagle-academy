import React, { useState, useEffect } from 'react';
import { settingsAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Settings, Save, Database, Mail, Shield, Globe } from 'lucide-react';

const SystemSettings = () => {
  const { toast } = useToast();
  
    const [settings, setSettings] = useState<Record<string, string | boolean> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchSettings = async () => {
        try {
          const data = await settingsAPI.getAll();
          setSettings(data);
        } catch (error) {
          toast({ title: 'Error', description: 'Failed to load settings', variant: 'destructive' });
        } finally {
          setLoading(false);
        }
      };
      fetchSettings();
    }, [toast]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      if (!settings) return;
      for (const [key, value] of Object.entries(settings)) {
        await settingsAPI.update(String(key), String(value));
      }
      toast({
        title: "Settings saved",
        description: "System settings have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  if (loading || !settings) {
    return <div className="py-12 text-center text-muted-foreground">Loading settings...</div>;
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">System Settings</h2>
        <p className="text-muted-foreground">Configure system preferences and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Site Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={String(settings.siteName)}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={String(settings.siteDescription)}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={String(settings.contactEmail)}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={String(settings.contactPhone)}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={String(settings.address)}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Feature Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Feature Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow New Registrations</Label>
                <p className="text-sm text-muted-foreground">Allow new users to register</p>
              </div>
              <Switch
                checked={Boolean(settings.allowRegistrations)}
                onCheckedChange={(checked) => handleInputChange('allowRegistrations', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Guest Comments</Label>
                <p className="text-sm text-muted-foreground">Allow non-registered users to comment</p>
              </div>
              <Switch
                checked={Boolean(settings.allowGuestComments)}
                onCheckedChange={(checked) => handleInputChange('allowGuestComments', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Put site in maintenance mode</p>
              </div>
              <Switch
                checked={Boolean(settings.maintenanceMode)}
                onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications</Label>
                <p className="text-sm text-muted-foreground">Enable system notifications</p>
              </div>
              <Switch
                checked={Boolean(settings.enableNotifications)}
                onCheckedChange={(checked) => handleInputChange('enableNotifications', checked)}
              />
            </div>
            
            <div>
              <Label htmlFor="postsPerPage">Posts Per Page</Label>
              <Input
                id="postsPerPage"
                type="number"
                value={String(settings.postsPerPage)}
                onChange={(e) => handleInputChange('postsPerPage', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                value={String(settings.smtpHost)}
                onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>
            
            <div>
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                value={String(settings.smtpPort)}
                onChange={(e) => handleInputChange('smtpPort', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="smtpUsername">SMTP Username</Label>
              <Input
                id="smtpUsername"
                value={String(settings.smtpUsername)}
                onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="smtpPassword">SMTP Password</Label>
              <Input
                id="smtpPassword"
                type="password"
                value={String(settings.smtpPassword)}
                onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={String(settings.sessionTimeout)}
                onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={String(settings.maxLoginAttempts)}
                onChange={(e) => handleInputChange('maxLoginAttempts', e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for admin users</p>
              </div>
              <Switch
                checked={Boolean(settings.enableTwoFactor)}
                onCheckedChange={(checked) => handleInputChange('enableTwoFactor', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>File Uploads</Label>
                <p className="text-sm text-muted-foreground">Allow file uploads</p>
              </div>
              <Switch
                checked={Boolean(settings.allowFileUploads)}
                onCheckedChange={(checked) => handleInputChange('allowFileUploads', checked)}
              />
            </div>
            
            <div>
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={String(settings.maxFileSize)}
                onChange={(e) => handleInputChange('maxFileSize', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="w-full md:w-auto">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SystemSettings;