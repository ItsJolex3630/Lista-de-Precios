"use client";

import { useEffect, useState } from "react";
import { usePerfumeStore } from "@/hooks/usePerfumeStore";
import { MetricCards } from "./MetricCards";
import { FilterControls } from "./FilterControls";
import { PerfumeTable } from "./PerfumeTable";
import { AddPerfumeForm } from "./AddPerfumeForm";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, CloudOff, Cloud, Loader2 } from "lucide-react";
import { exportToExcel } from "@/lib/excel-export";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function PerfumeDashboard() {
  const resetData = usePerfumeStore((s) => s.resetData);
  const perfumes = usePerfumeStore((s) => s.perfumes);
  const marginPercent = usePerfumeStore((s) => s.marginPercent);
  const getSuggestedPrice = usePerfumeStore((s) => s.getSuggestedPrice);
  const loadFromServer = usePerfumeStore((s) => s.loadFromServer);
  const syncStatus = usePerfumeStore((s) => s.syncStatus);

  // Load data from server on mount
  useEffect(() => {
    loadFromServer();

    // Set up periodic sync every 30 seconds
    const interval = setInterval(() => {
      loadFromServer();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadFromServer]);

  const getMetrics = usePerfumeStore((s) => s.getMetrics);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToExcel({
        perfumes,
        marginPercent,
        getSuggestedPrice,
        getMetrics,
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Sync status display
  const SyncBadge = () => {
    if (syncStatus === "synced") {
      return (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
          <Cloud className="w-3 h-3" />
          <span>Sincronizado</span>
        </div>
      );
    }
    if (syncStatus === "loading") {
      return (
        <div className="flex items-center gap-1.5 text-xs text-[#d4a853] bg-[#d4a853]/10 px-2.5 py-1 rounded-full">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Sincronizando...</span>
        </div>
      );
    }
    if (syncStatus === "offline") {
      return (
        <div className="flex items-center gap-1.5 text-xs text-[#888] bg-[#888]/10 px-2.5 py-1 rounded-full" title="Datos guardados localmente. Configura Vercel Postgres para sincronizar entre dispositivos.">
          <CloudOff className="w-3 h-3" />
          <span>Solo local</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-[#2a2a2a] mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Panel de Control de Perfumes
            <SyncBadge />
          </h1>
          <p className="mt-1 text-sm text-[#888]">
            Gestiona precios mayoristas, calcula margenes sugeridos y exporta
            directamente a Excel.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-gradient-to-r from-[#d4a853] to-[#b8860b] text-black font-bold shadow-none hover:from-[#c9972e] hover:to-[#a67808] disabled:opacity-70"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isExporting ? "Exportando..." : "Exportar a Excel"}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="border-[#333] text-[#999] hover:text-white hover:border-[#555] bg-transparent"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restaurar Lista Original
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1e1e1e] border-[#333] text-white">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  Restaurar lista original
                </AlertDialogTitle>
                <AlertDialogDescription className="text-[#999]">
                  Deseas restaurar la lista a su estado original? Perderas
                  cualquier cambio que hayas realizado.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-[#1a1a1a] border-[#333] text-[#ccc] hover:bg-[#252525] hover:text-white">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={resetData}
                  className="bg-[#d4a853] text-black font-bold hover:bg-[#c9972e]"
                >
                  Restaurar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Metric Cards */}
      <MetricCards />

      {/* Filter Controls */}
      <FilterControls />

      {/* Main Table */}
      <PerfumeTable />

      {/* Add Perfume Form */}
      <AddPerfumeForm />
    </div>
  );
}
