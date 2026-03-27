/**
 * Página de Registro
 * Implementa criação de nova conta
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
import { Loader2, UserPlus } from "lucide-react";

import { register as registerUser } from "@/services/auth";
import { useAuthStore } from "@/stores/authStore";
import { usePublicRoute } from "@/hooks/useProtectedRoute";

// ============================================================================
// SCHEMA DE VALIDAÇÃO
// ============================================================================

const registerSchema = z
  .object({
    username: z.string().min(3, "Username deve ter no mínimo 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// ============================================================================
// COMPONENTE
// ============================================================================

export default function Register() {
  const [, setLocation] = useLocation();
  const { setUser, setError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Redirecionamento é feito pela página Index.tsx

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      setUser(response.user);
      toast.success("Conta criada com sucesso! Verifique seu email.");
      setLocation("/dashboard");
    } catch (err: any) {
      const message = err.message || "Erro ao criar conta";
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
              <UserPlus className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Criar Conta</h1>
          <p className="text-sm text-muted-foreground">
            Junte-se ao Continuum PKM
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div>
            <Label htmlFor="username" className="text-sm font-medium text-foreground">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="seu_username"
              className="mt-1 bg-card border-border text-foreground placeholder:text-muted-foreground"
              {...register("username")}
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-xs text-destructive mt-1">{errors.username.message}</p>
            )}
          </div>

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

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirmar Senha
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="mt-1 bg-card border-border text-foreground placeholder:text-muted-foreground"
              {...register("confirmPassword")}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>
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
                Criando conta...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Criar Conta
              </>
            )}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Já tem conta?{" "}
            <button
              onClick={() => setLocation("/login")}
              className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors"
            >
              Fazer login
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
