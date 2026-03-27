/**
 * Página de Dashboard
 * Exibe estatísticas de uso e limites de plano
 */

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Network,
  Activity,
  TrendingUp,
  Zap,
  AlertCircle,
} from "lucide-react";
import MainLayout from "@/components/Layout/MainLayout";
import { useAuthStore } from "@/stores/authStore";
import { getDashboardStats, DashboardStats } from "@/services/dashboard";
import toast from "react-hot-toast";
import { useLocation } from "wouter";
import { useUpgradeModal } from "@/stores/uiStore";

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, navigate] = useLocation();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        toast.error("Erro ao carregar estatísticas");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);



  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Bem-vindo, {user?.username || "Usuário"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Plano: <span className="font-semibold text-cyan-400">{user?.plan || "FREE"}</span>
            </p>
          </div>
          <Button
            onClick={() => navigate("/notes/new")}
            className="bg-cyan-600 hover:bg-cyan-700 gap-2"
          >
            <FileText className="w-4 h-4" />
            Nova Nota
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Notas */}
          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Notas</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.notesCount || 0}/{stats?.maxNotes || 0}
                </p>
              </div>
              <FileText className="w-8 h-8 text-cyan-500" />
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all bg-green-500"
                style={{
                  width: `${Math.round(((stats?.notesCount || 0) / (stats?.maxNotes || 1)) * 100)}%`,
                }}
              />
            </div>
          </Card>

          {/* Entidades */}
          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Entidades</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.entitiesCount || 0}/{stats?.maxEntities || 0}
                </p>
              </div>
              <Network className="w-8 h-8 text-cyan-500" />
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all bg-green-500"
                style={{
                  width: `${Math.round(((stats?.entitiesCount || 0) / (stats?.maxEntities || 1)) * 100)}%`,
                }}
              />
            </div>
          </Card>

          {/* Hábitos */}
          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Hábitos</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.habitsCount || 0}/{stats?.maxHabits || 0}
                </p>
              </div>
              <Zap className="w-8 h-8 text-cyan-500" />
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all bg-green-500"
                style={{
                  width: `${Math.round(((stats?.habitsCount || 0) / (stats?.maxHabits || 1)) * 100)}%`,
                }}
              />
            </div>
          </Card>
        </div>

        {/* Vault Storage */}
        <Card className="p-6 border-border bg-card">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-foreground">Armazenamento Vault</p>
              <p className="text-sm text-muted-foreground">
                {(stats?.vaultUsedMB || 0).toFixed(2)} MB / {stats?.maxVaultMB || 0} MB
              </p>
            </div>
            <div className="w-full bg-secondary rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all bg-green-500"
                style={{
                  width: `${Math.round(((stats?.vaultUsedMB || 0) / (stats?.maxVaultMB || 1)) * 100)}%`,
                }}
              />
            </div>
          </div>
        </Card>

        {/* Top Mentions */}
        {stats?.topMentions && stats.topMentions.length > 0 && (
          <Card className="p-6 border-border bg-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">Menciones Frequentes</h2>
            <div className="space-y-2">
              {stats.topMentions.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-background/80 transition-colors"
                >
                  <span className="text-foreground font-medium">{item.name}</span>
                  <span className="text-sm text-cyan-400 font-medium">{item.count}x</span>
                </div>
              ))}
            </div>
          </Card>
        )}


      </div>
    </MainLayout>
  );
}
