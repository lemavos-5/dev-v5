import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import apiClient from '../api/client';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, fetchMe } = useAuthStore();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) { setUsername(user.username); setEmail(user.email); }
  }, [user]);

  const updateProfile = async () => {
    setSaving(true);
    try {
      await apiClient.patch('/account/me', { username, email });
      await fetchMe();
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
    setSaving(false);
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword) return;
    try {
      await apiClient.post('/account/password/change', { currentPassword, newPassword });
      setCurrentPassword(''); setNewPassword('');
      toast.success('Password changed');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 animate-fade-in">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      <section className="surface-elevated p-6 mb-6">
        <h2 className="text-sm font-semibold mb-4">Account</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2" />
          </div>
          <button onClick={updateProfile} disabled={saving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:bg-primary/90 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </section>

      <section className="surface-elevated p-6 mb-6">
        <h2 className="text-sm font-semibold mb-4">Change Password</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Current password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted-foreground">New password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2" />
          </div>
          <button onClick={changePassword}
            className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-smooth hover:bg-secondary/80">
            Update password
          </button>
        </div>
      </section>

      <section className="surface-elevated p-6">
        <h2 className="text-sm font-semibold mb-2">Plan</h2>
        <div className="flex items-center gap-3">
          <span className="inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            {user?.plan || 'FREE'}
          </span>
          <span className="text-xs text-muted-foreground">
            {user?.maxEntities} entities · {user?.maxNotes} notes · {user?.maxHabits} habits
          </span>
        </div>
      </section>
    </div>
  );
}
