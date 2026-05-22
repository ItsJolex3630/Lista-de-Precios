"use client";

import { usePerfumeStore } from "@/hooks/usePerfumeStore";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import type { GenderFilter } from "@/hooks/usePerfumeStore";

const genderOptions: { label: string; value: GenderFilter }[] = [
  { label: "Todos", value: "TODOS" },
  { label: "Dama", value: "DAMA" },
  { label: "Caballero", value: "CABALLERO" },
  { label: "Unisex", value: "UNISEX" },
];

export function FilterControls() {
  const searchQuery = usePerfumeStore((s) => s.searchQuery);
  const genderFilter = usePerfumeStore((s) => s.genderFilter);
  const marginPercent = usePerfumeStore((s) => s.marginPercent);
  const showOnlyUnpriced = usePerfumeStore((s) => s.showOnlyUnpriced);

  const setSearchQuery = usePerfumeStore((s) => s.setSearchQuery);
  const setGenderFilter = usePerfumeStore((s) => s.setGenderFilter);
  const setMarginPercent = usePerfumeStore((s) => s.setMarginPercent);
  const toggleShowOnlyUnpriced = usePerfumeStore((s) => s.toggleShowOnlyUnpriced);

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Search and Gender Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar perfume por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-50 border-slate-200 focus:ring-amber-500 focus:border-amber-500 focus:bg-white"
          />
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {genderOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setGenderFilter(opt.value)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                genderFilter === opt.value
                  ? "bg-white text-slate-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Margin Calculator */}
      <div className="flex flex-wrap items-center gap-4 bg-amber-50/50 p-4 rounded-xl border border-amber-100 lg:w-auto">
        <div className="flex items-center gap-2">
          <Label
            htmlFor="margin-input"
            className="text-xs font-bold uppercase tracking-wider text-amber-800"
          >
            Margen Sugerido:
          </Label>
          <div className="relative flex items-center">
            <span className="absolute left-2 text-amber-700 font-semibold text-sm">
              +
            </span>
            <Input
              id="margin-input"
              type="number"
              value={marginPercent}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 0) setMarginPercent(val);
              }}
              min={0}
              max={500}
              className="w-16 pl-5 pr-2 py-1 text-sm font-bold text-center text-amber-900 bg-white border-amber-200 focus:ring-amber-500"
            />
            <span className="ml-1 text-amber-800 text-sm font-semibold">%</span>
          </div>
        </div>
        <div className="h-6 w-px bg-amber-200 hidden sm:block" />
        <div className="flex items-center gap-2">
          <Switch
            id="unpriced-filter"
            checked={showOnlyUnpriced}
            onCheckedChange={toggleShowOnlyUnpriced}
          />
          <Label
            htmlFor="unpriced-filter"
            className="text-xs font-medium text-slate-600 cursor-pointer"
          >
            Ver solo &quot;Sin precio&quot;
          </Label>
        </div>
      </div>
    </div>
  );
}
