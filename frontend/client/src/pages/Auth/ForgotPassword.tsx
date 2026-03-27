/**
 * Página de Forgot Password
 * Implementa reset de senha
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
import { Loader2, Mail } from "lucide-react";

import { forgotPassword } from "@/services/auth";
import { usePublicRoute } from "@/hooks/useProtectedRoute";

// ============================================================================
// SCHEMA DE VALIDAÇÃO
// ============================================================================

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ============================================================================
// COMPONENTE
// ============================================================================

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Redirecionamento é feito pela página Index.tsx

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      await forgotPassword(data.email);
      setSubmitted(true);
      toast.success("Email de reset enviado! Verifique sua caixa de entrada.");
    } catch (err: any) {
      const message = err.message || "Erro ao enviar email";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md p-8 border border-border text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Email Enviado</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Verifique sua caixa de entrada para o link de reset de senha.
          </p>
          <Button
            onClick={() => setLocation("/login")}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            Voltar ao Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 border border-border">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Recuperar Senha</h1>
          <p className="text-sm text-muted-foreground">
            Digite seu email para receber um link de reset
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

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full mt-6 bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 rounded-lg transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Enviar Link
              </>
            )}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            <button
              onClick={() => setLocation("/login")}
              className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors"
            >
              Voltar ao Login
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
