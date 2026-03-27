/**
 * Página de Hábitos
 * Gerencia hábitos com heatmap de 90 dias
 */

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { getHabits, markHabitComplete, unmarkHabitComplete, Habit, HabitStats } from "@/services/habits";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Flame } from "lucide-react";
import MainLayout from "@/components/Layout/MainLayout";
import { useLocation } from "wouter";

export default function Habits() {
  const { user } = useAuthStore();
  const [habitStats, setHabitStats] = useState<HabitStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  // Carregar hábitos
  useEffect(() => {
    const loadHabits = async () => {
      try {
        setLoading(true);
        const data = await getHabits();
        setHabitStats(data);
      } catch (error: any) {
        toast.error("Erro ao carregar hábitos");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadHabits();
  }, []);

  // Lidar com clique em data do heatmap
  const handleDateClick = async (habitId: string, date: string, isCompleted: boolean) => {
    try {
      if (isCompleted) {
        await unmarkHabitComplete(habitId, date);
      } else {
        await markHabitComplete(habitId, date);
      }
      
      // Recarregar hábitos
      const data = await getHabits();
      setHabitStats(data);
    } catch (error: any) {
      toast.error("Erro ao atualizar hábito");
      console.error(error);
    }
  };

  // Gerar array de datas dos últimos 90 dias
  const generateDates = () => {
    const dates = [];
    for (let i = 89; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  // Obter cor baseada na intensidade
  const getHeatmapColor = (intensity: number | undefined) => {
    if (!intensity) return "bg-secondary";
    if (intensity === 1) return "bg-green-900";
    if (intensity === 2) return "bg-green-700";
    if (intensity === 3) return "bg-green-500";
    return "bg-green-300";
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
        </div>
      </MainLayout>
    );
  }

  const dates = generateDates();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Hábitos</h1>
            <p className="text-muted-foreground mt-1">
              Rastreie seus hábitos: {habitStats?.totalHabits || 0}/{habitStats?.maxHabits || 0}
            </p>
          </div>
          <Button
            onClick={() => navigate("/habits/new")}
            className="bg-cyan-600 hover:bg-cyan-700 gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Hábito
          </Button>
        </div>

        {/* Habits List */}
        {habitStats?.habits && habitStats.habits.length > 0 ? (
          <div className="space-y-6">
            {habitStats.habits.map((habit) => (
              <Card key={habit.id} className="p-6 border-border bg-card">
                {/* Habit Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{habit.name}</h2>
                    {habit.description && (
                      <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-orange-400 font-semibold">
                        <Flame className="w-4 h-4" />
                        {habit.currentStreak}
                      </div>
                      <p className="text-xs text-muted-foreground">Streak atual</p>
                    </div>
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: habit.color }}
                    />
                  </div>
                </div>

                {/* Heatmap */}
                <div className="overflow-x-auto">
                  <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(13, minmax(0, 1fr))` }}>
                    {dates.map((date) => {
                      const entry = habit.entries.find((e) => e.date === date);
                      return (
                        <button
                          key={date}
                          onClick={() => handleDateClick(habit.id, date, entry?.completed || false)}
                          className={`w-4 h-4 rounded transition-all hover:scale-125 cursor-pointer ${getHeatmapColor(entry?.intensity)}`}
                          title={date}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 mt-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Streak Maior</p>
                    <p className="text-sm font-semibold text-foreground">{habit.longestStreak}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Completados</p>
                    <p className="text-sm font-semibold text-foreground">
                      {habit.entries.filter((e) => e.completed).length}/90
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 border-border bg-card text-center">
            <p className="text-muted-foreground mb-4">
              Nenhum hábito criado ainda. Comece a rastrear seus hábitos!
            </p>
            <Button
              onClick={() => navigate("/habits/new")}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Hábito
            </Button>
          </Card>
        )}

        {/* Legend */}
        <Card className="p-4 border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground mb-3">Legenda</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-secondary" />
              <span className="text-xs text-muted-foreground">Sem dados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-900" />
              <span className="text-xs text-muted-foreground">Baixo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-700" />
              <span className="text-xs text-muted-foreground">Médio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span className="text-xs text-muted-foreground">Alto</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-300" />
              <span className="text-xs text-muted-foreground">Máximo</span>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
