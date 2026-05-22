"use client";

import { usePerfumeStore } from "@/hooks/usePerfumeStore";
import { MetricCards } from "./MetricCards";
import { FilterControls } from "./FilterControls";
import { PerfumeTable } from "./PerfumeTable";
import { AddPerfumeForm } from "./AddPerfumeForm";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw } from "lucide-react";
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

  const exportToCSV = () => {
    const BOM = "\uFEFF";
    let csvContent = BOM;
    csvContent += `N\u00ba,Nombre del Perfume,Volumen,Genero,Precio Mayor ($),Precio Sugerido (+${marginPercent}%)\r\n`;

    perfumes.forEach((p) => {
      const wholesaleText = p.wholesale === null ? "Sin precio" : p.wholesale;
      const suggested = getSuggestedPrice(p.wholesale);
      const suggestedText = suggested === null ? "-" : suggested;
      const escapedName = p.name.includes(",") ? `"${p.name}"` : p.name;
      csvContent += `${p.id},${escapedName},${p.volume},${p.gender},${wholesaleText},${suggestedText}\r\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Inventario_Perfumes_Margen_${marginPercent}pct.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
            Panel de Control de Perfumes
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gestiona precios mayoristas, calcula margenes sugeridos y exporta
            directamente a Excel.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Button
            onClick={exportToCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar a Excel (CSV)
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="shadow-sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Restaurar Lista Original
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Restaurar lista original</AlertDialogTitle>
                <AlertDialogDescription>
                  Deseas restaurar la lista a su estado original? Perderas
                  cualquier cambio que hayas realizado.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={resetData}>
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
