/**
 * Página de Knowledge Graph
 * Visualização interativa do grafo de entidades
 */

import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import MainLayout from "@/components/Layout/MainLayout";
import { getGraphData, GraphData } from "@/services/graph";
import toast from "react-hot-toast";

export default function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const loadGraph = async () => {
      try {
        const data = await getGraphData();
        setGraphData(data);
      } catch (err) {
        toast.error("Erro ao carregar Knowledge Graph");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadGraph();
  }, []);

  // Renderizar grafo simples em canvas
  useEffect(() => {
    if (!canvasRef.current || !graphData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Limpar canvas
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 3;

    // Desenhar links
    ctx.strokeStyle = "#2a2a2a";
    ctx.lineWidth = 1;

    graphData.links.forEach((link) => {
      const sourceNode = graphData.nodes.find((n) => n.id === link.source);
      const targetNode = graphData.nodes.find((n) => n.id === link.target);

      if (!sourceNode || !targetNode) return;

      const sourceIndex = graphData.nodes.indexOf(sourceNode);
      const targetIndex = graphData.nodes.indexOf(targetNode);

      const sourceAngle = (sourceIndex / graphData.nodes.length) * Math.PI * 2;
      const targetAngle = (targetIndex / graphData.nodes.length) * Math.PI * 2;

      const x1 = centerX + Math.cos(sourceAngle) * radius;
      const y1 = centerY + Math.sin(sourceAngle) * radius;
      const x2 = centerX + Math.cos(targetAngle) * radius;
      const y2 = centerY + Math.sin(targetAngle) * radius;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });

    // Desenhar nós
    graphData.nodes.forEach((node, index) => {
      const angle = (index / graphData.nodes.length) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Cor por tipo
      const colorMap: Record<string, string> = {
        PERSON: "#00d9ff",
        PROJECT: "#00aa88",
        CONCEPT: "#aa00ff",
        HABIT: "#ffaa00",
        NOTE: "#ff00ff",
        ENTITY: "#00d9ff",
      };

      const color = colorMap[node.type] || "#00d9ff";

      // Desenhar círculo
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Desenhar label
      ctx.fillStyle = "#e8e8e8";
      ctx.font = "12px Inter";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label.substring(0, 10), x, y + 20);
    });
  }, [graphData]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando Knowledge Graph...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-foreground">Knowledge Graph</h1>
          <Card className="p-12 border border-border bg-card text-center">
            <p className="text-muted-foreground mb-4">
              Nenhuma entidade para visualizar. Crie notas e entidades para começar.
            </p>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Knowledge Graph</h1>
          <p className="text-muted-foreground">
            {graphData.nodes.length} entidades, {graphData.links.length} conexões
          </p>
        </div>

        {/* Canvas */}
        <Card className="p-4 border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Visualização interativa do seu Knowledge Graph
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.min(zoom + 0.2, 3))}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(1)}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full border border-border rounded-lg bg-background"
            style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
          />
        </Card>

        {/* Legend */}
        <Card className="p-4 border border-border bg-card">
          <h3 className="text-sm font-bold text-foreground mb-3">Legenda</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500" />
              <span className="text-xs text-muted-foreground">Pessoa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Projeto</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-xs text-muted-foreground">Conceito</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs text-muted-foreground">Hábito</span>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
