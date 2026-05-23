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
      return "text-[#f472b6]";
    case "CABALLERO":
      return "text-[#60a5fa]";
    default:
      return "text-[#c084fc]";
  }
}

export function PerfumeTable() {
  const getFilteredPerfumes = usePerfumeStore((s) => s.getFilteredPerfumes);
  const getSuggestedPrice = usePerfumeStore((s) => s.getSuggestedPrice);
  const marginPercent = usePerfumeStore((s) => s.marginPercent);
  const currentPage = usePerfumeStore((s) => s.currentPage);
  const rowsPerPage = usePerfumeStore((s) => s.rowsPerPage);
  const highlightedPerfumeId = usePerfumeStore((s) => s.highlightedPerfumeId);
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
    <div className="bg-[#161616] rounded-2xl border border-[#2a2a2a] shadow-none overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#222] text-left text-sm">
          <thead className="bg-[#111] text-xs font-bold uppercase tracking-wider text-[#999]">
            <tr>
              <th className="py-3.5 px-4 text-center w-16">N.</th>
              <th className="py-3.5 px-4 min-w-[200px]">Nombre del Perfume</th>
              <th className="py-3.5 px-4 w-28">Volumen</th>
              <th className="py-3.5 px-4 w-32">Genero</th>
              <th className="py-3.5 px-4 w-40 text-right">Precio Mayor ($)</th>
              <th className="py-3.5 px-4 w-44 text-right bg-[#1a1600]/40 text-[#d4a853]">
                Sugerido (+{marginPercent}%)
              </th>
              <th className="py-3.5 px-4 w-16 text-center">Accion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-[#666] font-medium"
                >
                  No se encontraron perfumes con los filtros actuales.
                </td>
              </tr>
            ) : (
              pageItems.map((perfume, index) => (
                <PerfumeRow
                  key={perfume.id}
                  perfume={perfume}
                  rowIndex={index}
                  suggestedPrice={getSuggestedPrice(perfume.wholesale)}
                  isHighlighted={highlightedPerfumeId === perfume.id}
                  onUpdate={updatePerfume}
                  onDelete={deletePerfume}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-4 border-t border-[#222] bg-[#111] gap-3">
        <div className="text-xs text-[#888]">
          Mostrando{" "}
          <span className="font-semibold text-[#ccc]">
            {totalItems === 0 ? 0 : startIdx + 1}
          </span>{" "}
          -{" "}
          <span className="font-semibold text-[#ccc]">{endIdx}</span> de{" "}
          <span className="font-semibold text-[#ccc]">{totalItems}</span>{" "}
          perfumes
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-[#999]">
            <span>Filas por pagina:</span>
            <Select
              value={String(rowsPerPage)}
              onValueChange={(val) =>
                setRowsPerPage(val === "all" ? "all" : parseInt(val))
              }
            >
              <SelectTrigger className="w-[72px] h-8 text-xs bg-[#1a1a1a] border-[#333] text-[#ccc]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1e1e1e] border-[#333]">
                <SelectItem value="25" className="text-[#ccc] focus:bg-[#2a2a2a] focus:text-white">25</SelectItem>
                <SelectItem value="50" className="text-[#ccc] focus:bg-[#2a2a2a] focus:text-white">50</SelectItem>
                <SelectItem value="100" className="text-[#ccc] focus:bg-[#2a2a2a] focus:text-white">100</SelectItem>
                <SelectItem value="all" className="text-[#ccc] focus:bg-[#2a2a2a] focus:text-white">Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-[#1a1a1a] border-[#333] text-[#999] hover:text-[#d4a853] hover:border-[#d4a853]"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage(safePage - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-[#1a1a1a] border-[#333] text-[#999] hover:text-[#d4a853] hover:border-[#d4a853]"
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
  rowIndex,
  suggestedPrice,
  isHighlighted,
  onUpdate,
  onDelete,
}: {
  perfume: Perfume;
  rowIndex: number;
  suggestedPrice: number | null;
  isHighlighted: boolean;
  onUpdate: (id: number, field: keyof Perfume, value: string | number | null) => void;
  onDelete: (id: number) => void;
}) {
  const rowBg = rowIndex % 2 === 0 ? "bg-[#0f0f0f]" : "bg-[#131313]";

  return (
    <tr
      id={`perfume-row-${perfume.id}`}
      className={`${rowBg} hover:bg-[#1a1a1a] transition-colors group ${
        isHighlighted
          ? "ring-2 ring-[#d4a853] ring-inset bg-[#1a1600]/40 !important"
          : ""
      }`}
    >
      <td className="py-3 px-4 text-center text-[#666] font-semibold">
        {perfume.id}
      </td>
      <td className="py-3 px-4">
        <Input
          value={perfume.name}
          onChange={(e) => onUpdate(perfume.id, "name", e.target.value)}
          className="border-0 bg-transparent hover:bg-[#1a1a1a] focus:bg-[#1a1a1a] h-8 text-sm font-medium px-1.5 text-[#e5e5e5] shadow-none focus-visible:ring-2 focus-visible:ring-[#d4a853]"
        />
      </td>
      <td className="py-3 px-4">
        <Input
          value={perfume.volume}
          onChange={(e) => onUpdate(perfume.id, "volume", e.target.value)}
          className="border-0 bg-transparent hover:bg-[#1a1a1a] focus:bg-[#1a1a1a] h-8 w-20 text-sm px-1.5 text-[#e5e5e5] shadow-none focus-visible:ring-2 focus-visible:ring-[#d4a853]"
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
            className={`border-0 bg-transparent hover:bg-[#1a1a1a] h-8 text-xs font-bold shadow-none focus-visible:ring-2 focus-visible:ring-[#d4a853] w-[130px] ${getGenderColor(perfume.gender)}`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1e1e1e] border-[#333]">
            <SelectItem value="DAMA" className="text-[#f472b6] focus:bg-[#2a2a2a]">DAMA</SelectItem>
            <SelectItem value="CABALLERO" className="text-[#60a5fa] focus:bg-[#2a2a2a]">CABALLERO</SelectItem>
            <SelectItem value="UNISEX" className="text-[#c084fc] focus:bg-[#2a2a2a]">UNISEX</SelectItem>
          </SelectContent>
        </Select>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end">
          <span className="text-[#666] text-xs mr-1">$</span>
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
            className={`border-0 bg-transparent hover:bg-[#1a1a1a] focus:bg-[#1a1a1a] h-8 w-24 text-right text-sm font-bold px-1.5 shadow-none focus-visible:ring-2 focus-visible:ring-[#d4a853] ${
              perfume.wholesale === null
                ? "text-[#666] font-normal italic placeholder:text-[#444]"
                : "text-[#e5e5e5]"
            }`}
          />
        </div>
      </td>
      <td className="py-3 px-4 text-right bg-[#1a1600]/30 text-[#d4a853] font-bold text-sm select-none">
        {suggestedPrice !== null ? `$${suggestedPrice}` : "-"}
      </td>
      <td className="py-3 px-4 text-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#666] hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
          onClick={() => onDelete(perfume.id)}
          title="Eliminar Perfume"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </td>
    </tr>
  );
}
