/**
 * Página de Login
 * Implementa autenticação com email/senha
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, LogIn } from "lucide-react";

import { login } from "@/services/auth";
import { useAuthStore } from "@/stores/authStore";

// ============================================================================
// SCHEMA DE VALIDAÇÃO
// ============================================================================

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================================
// COMPONENTE
// ============================================================================

export default function Login() {
  const [, setLocation] = useLocation();
  const { setUser, setError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await login(data);
      setUser(response.user);
      toast.success("Login realizado com sucesso!");
      setLocation("/dashboard");
    } catch (err: any) {
      const message = err.message || "Erro ao fazer login";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 border border-border">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <LogIn className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Continuum</h1>
          <p className="text-sm text-muted-foreground">
            Personal Knowledge Management & Productivity
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="mt-1 bg-card border-border text-foreground placeholder:text-muted-foreground"
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="mt-1 bg-card border-border text-foreground placeholder:text-muted-foreground"
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full mt-6 bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 rounded-lg transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </>
            )}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 space-y-2 text-center text-sm">
          <p className="text-muted-foreground">
            Não tem conta?{" "}
            <button
              onClick={() => setLocation("/register")}
              className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors"
            >
              Criar conta
            </button>
          </p>
          <p>
            <button
              onClick={() => setLocation("/forgot-password")}
              className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors"
            >
              Esqueceu a senha?
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
