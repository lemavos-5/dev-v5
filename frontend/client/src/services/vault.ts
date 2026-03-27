/**
 * Serviço de Vault (Backblaze B2)
 * Gerencia upload e download de arquivos
 */

import { api } from "@/services/api";

export interface VaultFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  url: string;
}

export interface VaultStats {
  usedMB: number;
  maxMB: number;
  fileCount: number;
  maxFiles: number;
}

/**
 * Upload de arquivo com validação de tamanho
 * @param file - Arquivo a ser enviado
 * @param maxSizeMB - Tamanho máximo permitido em MB
 */
export async function uploadFile(
  file: File,
  maxSizeMB: number
): Promise<VaultFile> {
  // Validar tamanho do arquivo
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    throw new Error(
      `Arquivo excede o limite de ${maxSizeMB}MB. Tamanho: ${fileSizeMB.toFixed(2)}MB`
    );
  }

  // Criar FormData
  const formData = new FormData();
  formData.append("file", file);

  // Fazer upload
  const response = await api.post<VaultFile>("/api/vault/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

/**
 * Obter lista de arquivos do vault
 */
export async function listFiles(): Promise<VaultFile[]> {
  const response = await api.get<VaultFile[]>("/api/vault/files");
  return response.data;
}

/**
 * Deletar arquivo do vault
 */
export async function deleteFile(fileId: string): Promise<void> {
  await api.delete(`/api/vault/files/${fileId}`);
}

/**
 * Obter estatísticas do vault
 */
export async function getVaultStats(): Promise<VaultStats> {
  const response = await api.get<VaultStats>("/api/vault/stats");
  return response.data;
}
