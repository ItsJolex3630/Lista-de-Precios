"use client";

import { usePerfumeStore } from "@/hooks/usePerfumeStore";
import type { Perfume, GenderFilter } from "@/data/perfumes";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";

function getGenderColor(gender: string) {
  switch (gender) {
    case "DAMA":
      return "text-pink-600";
    case "CABALLERO":
      return "text-sky-600";
    default:
      return "text-purple-600";
  }
}

export function PerfumeTable() {
  const getFilteredPerfumes = usePerfumeStore((s) => s.getFilteredPerfumes);
  const getSuggestedPrice = usePerfumeStore((s) => s.getSuggestedPrice);
  const marginPercent = usePerfumeStore((s) => s.marginPercent);
  const currentPage = usePerfumeStore((s) => s.currentPage);
  const rowsPerPage = usePerfumeStore((s) => s.rowsPerPage);
  const setCurrentPage = usePerfumeStore((s) => s.setCurrentPage);
  const setRowsPerPage = usePerfumeStore((s) => s.setRowsPerPage);
  const updatePerfume = usePerfumeStore((s) => s.updatePerfume);
  const deletePerfume = usePerfumeStore((s) => s.deletePerfume);

  const filtered = getFilteredPerfumes();
  const totalItems = filtered.length;
  const limit = rowsPerPage === "all" ? totalItems : rowsPerPage;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const safePage = Math.min(currentPage, totalPages);

  const startIdx = (safePage - 1) * limit;
  const endIdx =
    rowsPerPage === "all" ? totalItems : Math.min(startIdx + limit, totalItems);
  const pageItems = filtered.slice(startIdx, endIdx);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="py-3.5 px-4 text-center w-16">N.</th>
              <th className="py-3.5 px-4 min-w-[200px]">Nombre del Perfume</th>
              <th className="py-3.5 px-4 w-28">Volumen</th>
              <th className="py-3.5 px-4 w-32">Genero</th>
              <th className="py-3.5 px-4 w-40 text-right">Precio Mayor ($)</th>
              <th className="py-3.5 px-4 w-44 text-right bg-amber-50/50 text-amber-900">
                Sugerido (+{marginPercent}%)
              </th>
              <th className="py-3.5 px-4 w-16 text-center">Accion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-slate-400 font-medium"
                >
                  No se encontraron perfumes con los filtros actuales.
                </td>
              </tr>
            ) : (
              pageItems.map((perfume) => (
                <PerfumeRow
                  key={perfume.id}
                  perfume={perfume}
                  suggestedPrice={getSuggestedPrice(perfume.wholesale)}
                  onUpdate={updatePerfume}
                  onDelete={deletePerfume}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-4 border-t border-slate-100 bg-slate-50/50 gap-3">
        <div className="text-xs text-slate-500">
          Mostrando{" "}
          <span className="font-semibold text-slate-800">
            {totalItems === 0 ? 0 : startIdx + 1}
          </span>{" "}
          -{" "}
          <span className="font-semibold text-slate-800">{endIdx}</span> de{" "}
          <span className="font-semibold text-slate-800">{totalItems}</span>{" "}
          perfumes
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span>Filas por pagina:</span>
            <Select
              value={String(rowsPerPage)}
              onValueChange={(val) =>
                setRowsPerPage(val === "all" ? "all" : parseInt(val))
              }
            >
              <SelectTrigger className="w-[72px] h-8 text-xs bg-white border-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="all">Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage(safePage - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={safePage >= totalPages || rowsPerPage === "all"}
              onClick={() => setCurrentPage(safePage + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PerfumeRow({
  perfume,
  suggestedPrice,
  onUpdate,
  onDelete,
}: {
  perfume: Perfume;
  suggestedPrice: number | null;
  onUpdate: (id: number, field: keyof Perfume, value: string | number | null) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <tr className="hover:bg-slate-50/70 transition-colors group">
      <td className="py-3 px-4 text-center text-slate-400 font-semibold">
        {perfume.id}
      </td>
      <td className="py-3 px-4">
        <Input
          value={perfume.name}
          onChange={(e) => onUpdate(perfume.id, "name", e.target.value)}
          className="border-0 bg-transparent hover:bg-slate-50 focus:bg-white h-8 text-sm font-medium px-1.5 shadow-none focus-visible:ring-2 focus-visible:ring-amber-500"
        />
      </td>
      <td className="py-3 px-4">
        <Input
          value={perfume.volume}
          onChange={(e) => onUpdate(perfume.id, "volume", e.target.value)}
          className="border-0 bg-transparent hover:bg-slate-50 focus:bg-white h-8 w-20 text-sm px-1.5 shadow-none focus-visible:ring-2 focus-visible:ring-amber-500"
        />
      </td>
      <td className="py-3 px-4">
        <Select
          value={perfume.gender}
          onValueChange={(val) =>
            onUpdate(perfume.id, "gender", val as GenderFilter)
          }
        >
          <SelectTrigger
            className={`border-0 bg-transparent hover:bg-slate-50 h-8 text-xs font-bold shadow-none focus-visible:ring-2 focus-visible:ring-amber-500 w-[130px] ${getGenderColor(perfume.gender)}`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DAMA">DAMA</SelectItem>
            <SelectItem value="CABALLERO">CABALLERO</SelectItem>
            <SelectItem value="UNISEX">UNISEX</SelectItem>
          </SelectContent>
        </Select>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end">
          <span className="text-slate-400 text-xs mr-1">$</span>
          <Input
            type="number"
            step="any"
            placeholder="Sin precio"
            value={perfume.wholesale ?? ""}
            onChange={(e) => {
              const val = e.target.value.trim();
              onUpdate(
                perfume.id,
                "wholesale",
                val === "" ? null : parseFloat(val)
              );
            }}
            className={`border-0 bg-transparent hover:bg-slate-50 focus:bg-white h-8 w-24 text-right text-sm font-bold px-1.5 shadow-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
              perfume.wholesale === null
                ? "text-slate-400 font-normal italic placeholder:text-slate-300"
                : "text-slate-900"
            }`}
          />
        </div>
      </td>
      <td className="py-3 px-4 text-right bg-amber-50/30 text-amber-950 font-bold text-sm select-none">
        {suggestedPrice !== null ? `$${suggestedPrice}` : "-"}
      </td>
      <td className="py-3 px-4 text-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
          onClick={() => onDelete(perfume.id)}
          title="Eliminar Perfume"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
}
