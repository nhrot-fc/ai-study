"use client";

import React, { useState } from "react";
import { APP_TITLE, PAGE_TITLES } from "@/lib/constants";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { UserIcon, BellIcon, ShieldIcon, KeyIcon } from "lucide-react";

const ProfileForm = () => {
  const [profileData, setProfileData] = useState({
    full_name: "John Doe",
    nickname: "johndoe",
    email: "john.doe@example.com",
    avatar_url: "",
    bio: "I'm a software developer interested in AI, machine learning, and web development.",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profileData)
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to update profile');
      // }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={profileData.full_name}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nickname">Nickname</Label>
          <Input
            id="nickname"
            value={profileData.nickname}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatar_url">Avatar URL</Label>
          <Input
            id="avatar_url"
            value={profileData.avatar_url}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          className="bg-gradient-primary hover:glow-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

const PasswordForm = () => {
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.new !== passwordData.confirm) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Mock API call
      // const response = await fetch('/api/user/password', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     currentPassword: passwordData.current,
      //     newPassword: passwordData.new
      //   })
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to update password');
      // }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear form
      setPasswordData({ current: "", new: "", confirm: "" });
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error("Failed to update password");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="current">Current Password</Label>
          <Input
            id="current"
            type="password"
            value={passwordData.current}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new">New Password</Label>
          <Input
            id="new"
            type="password"
            value={passwordData.new}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <Input
            id="confirm"
            type="password"
            value={passwordData.confirm}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button
          className="bg-gradient-primary hover:glow-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Updating..." : "Change Password"}
        </Button>
      </div>
    </form>
  );
};

const SettingsPage = () => {
  return (
    <div className="space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {PAGE_TITLES.SETTINGS}
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="bg-card mb-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <BellIcon className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldIcon className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <KeyIcon className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProfileForm />
            </CardContent>
          </Card>{" "}
          <Card>
            <CardHeader>
              <CardTitle>Personal Bio</CardTitle>
              <CardDescription>
                Share a brief bio to help others get to know you better.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  className="w-full min-h-32 p-3 rounded-md border bg-background text-foreground"
                  defaultValue="I'm a software developer interested in AI, machine learning, and web development."
                />
              </div>
              <div className="flex justify-end">
                <Button className="bg-gradient-primary hover:glow-primary">
                  Save Bio
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications from {APP_TITLE}
                .
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Course Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified about updates to your enrolled courses
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Resources</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new resources are available
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PasswordForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Verification</CardTitle>
              <CardDescription>
                Verify your email address to secure your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Verification Status</p>
                  <p className="text-sm text-muted-foreground">
                    Your email address has not been verified
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => toast.info("Verification email sent!")}
                >
                  Resend Verification
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>
                Manage your active sessions and sign out from other devices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Device</p>
                  <p className="text-sm text-muted-foreground">
                    You&apos;re currently logged in on this device
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    toast.success("All other sessions terminated");
                  }}
                >
                  Sign out all other devices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
              <CardDescription>
                Customize the appearance of your {APP_TITLE} interface.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Theme Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred theme
                  </p>
                </div>
                <ThemeToggle />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Animation Effects</p>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable UI animations
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
