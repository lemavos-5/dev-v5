/**
 * Página de Vault
 * Gerencia upload e download de arquivos com validação de tamanho
 */

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { uploadFile, listFiles, deleteFile, getVaultStats, VaultFile, VaultStats } from "@/services/vault";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Trash2, Download, AlertCircle } from "lucide-react";
import MainLayout from "@/components/Layout/MainLayout";

export default function Vault() {
  const { user } = useAuthStore();
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [stats, setStats] = useState<VaultStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Carregar arquivos e estatísticas
  useEffect(() => {
    const loadVault = async () => {
      try {
        setLoading(true);
        const [filesData, statsData] = await Promise.all([
          listFiles(),
          getVaultStats(),
        ]);
        setFiles(filesData);
        setStats(statsData);
      } catch (error: any) {
        toast.error("Erro ao carregar Vault");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadVault();
  }, []);

  // Lidar com upload de arquivo
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const maxSizeMB = user?.maxVaultMB || 100;
      
      // Fazer upload
      const uploadedFile = await uploadFile(file, maxSizeMB);
      
      // Atualizar lista
      setFiles([uploadedFile, ...files]);
      
      // Atualizar stats
      const newStats = await getVaultStats();
      setStats(newStats);
      
      toast.success("Arquivo enviado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer upload");
      console.error(error);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  // Deletar arquivo
  const handleDeleteFile = async (fileId: string) => {
    try {
      await deleteFile(fileId);
      setFiles(files.filter((f) => f.id !== fileId));
      
      // Atualizar stats
      const newStats = await getVaultStats();
      setStats(newStats);
      
      toast.success("Arquivo deletado");
    } catch (error: any) {
      toast.error("Erro ao deletar arquivo");
      console.error(error);
    }
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

  const usagePercentage = stats ? Math.round((stats.usedMB / stats.maxMB) * 100) : 0;
  const isNearLimit = usagePercentage > 80;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vault</h1>
          <p className="text-muted-foreground mt-1">
            Gerenciar seus arquivos armazenados
          </p>
        </div>

        {/* Storage Stats */}
        <Card className="p-6 border-border bg-card">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-foreground">Armazenamento Usado</p>
              <p className="text-sm text-muted-foreground">
                {stats?.usedMB.toFixed(2)} MB / {stats?.maxMB} MB
              </p>
            </div>
            <div className="w-full bg-secondary rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  isNearLimit ? "bg-red-500" : "bg-green-500"
                }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>
          
          {isNearLimit && (
            <div className="flex items-start gap-2 mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">
                Você está próximo do limite de armazenamento. Considere fazer upgrade.
              </p>
            </div>
          )}
        </Card>

        {/* Upload Area */}
        <Card className="p-8 border-2 border-dashed border-border bg-card hover:border-cyan-500/50 transition-colors">
          <div className="text-center">
            <Upload className="w-12 h-12 text-cyan-500 mx-auto mb-3" />
            <p className="text-foreground font-medium mb-2">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Máximo: {user?.maxVaultMB || 100} MB por arquivo
            </p>
            <label className="inline-block">
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <Button
                disabled={uploading}
                className="bg-cyan-600 hover:bg-cyan-700 cursor-pointer"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Selecionar Arquivo
                  </>
                )}
              </Button>
            </label>
          </div>
        </Card>

        {/* Files List */}
        {files.length > 0 ? (
          <Card className="p-6 border-border bg-card">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Arquivos ({files.length})
            </h2>
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.uploadedAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="p-12 border-border bg-card text-center">
            <p className="text-muted-foreground">
              Nenhum arquivo enviado ainda. Comece fazendo upload de um arquivo.
            </p>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
