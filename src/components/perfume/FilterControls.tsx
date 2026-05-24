"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePerfumeStore } from "@/hooks/usePerfumeStore";
import type { Perfume } from "@/data/perfumes";
import type { GenderFilter } from "@/hooks/usePerfumeStore";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, X, Cloud, CloudOff, Loader2 } from "lucide-react";

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
  const syncStatus = usePerfumeStore((s) => s.syncStatus);

  const setSearchQuery = usePerfumeStore((s) => s.setSearchQuery);
  const setGenderFilter = usePerfumeStore((s) => s.setGenderFilter);
  const setMarginPercent = usePerfumeStore((s) => s.setMarginPercent);
  const toggleShowOnlyUnpriced = usePerfumeStore((s) => s.toggleShowOnlyUnpriced);
  const getSuggestions = usePerfumeStore((s) => s.getSuggestions);
  const highlightAndScrollToPerfume = usePerfumeStore((s) => s.highlightAndScrollToPerfume);

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<Perfume[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isSelectingRef = useRef(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (isSelectingRef.current) return; // Don't close if selecting a suggestion
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync external query changes
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleInputChange = useCallback(
    (value: string) => {
      setLocalQuery(value);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setSearchQuery(value);
        if (value.trim().length > 0) {
          const results = getSuggestions(value);
          setSuggestions(results);
          setShowDropdown(results.length > 0);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      }, 150);
    },
    [setSearchQuery, getSuggestions]
  );

  const handleSuggestionClick = useCallback(
    (perfume: Perfume) => {
      isSelectingRef.current = true;
      setLocalQuery("");
      setSearchQuery("");
      setShowDropdown(false);
      setSuggestions([]);

      // Navigate to and highlight the perfume in the table
      highlightAndScrollToPerfume(perfume.id);

      // Reset the selecting flag after a short delay
      setTimeout(() => {
        isSelectingRef.current = false;
      }, 300);
    },
    [setSearchQuery, highlightAndScrollToPerfume]
  );

  const handleClearSearch = useCallback(() => {
    setLocalQuery("");
    setSearchQuery("");
    setShowDropdown(false);
    setSuggestions([]);
  }, [setSearchQuery]);

  const handleInputFocus = useCallback(() => {
    if (localQuery.trim().length > 0 && suggestions.length > 0) {
      setShowDropdown(true);
    }
  }, [localQuery, suggestions]);

  // Sync status indicator
  const SyncIcon = () => {
    switch (syncStatus) {
      case "synced":
        return <Cloud className="w-3.5 h-3.5 text-emerald-400" />;
      case "loading":
        return <Loader2 className="w-3.5 h-3.5 text-[#d4a853] animate-spin" />;
      case "offline":
      case "error":
        return <CloudOff className="w-3.5 h-3.5 text-[#666]" />;
      default:
        return <Cloud className="w-3.5 h-3.5 text-[#666]" />;
    }
  };

  return (
    <div className="bg-[#161616] p-4 md:p-6 rounded-2xl border border-[#2a2a2a] shadow-none mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Search and Gender Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        {/* Search with autocomplete */}
        <div className="relative flex-1" ref={containerRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
          <Input
            placeholder="Buscar perfume por nombre..."
            value={localQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleInputFocus}
            className="pl-10 pr-12 bg-[#1a1a1a] border-[#333] text-white placeholder:text-[#666] focus:ring-[#d4a853] focus:border-[#d4a853]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <SyncIcon />
            {localQuery && (
              <button
                onClick={handleClearSearch}
                className="text-[#666] hover:text-[#d4a853] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete dropdown */}
          {showDropdown && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-[#1e1e1e] border border-[#333] rounded-lg shadow-xl shadow-black/40 max-h-64 overflow-y-auto custom-scrollbar">
              {suggestions.map((perfume) => (
                <button
                  key={perfume.id}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent blur/click-outside from closing dropdown
                    handleSuggestionClick(perfume);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-[#e5e5e5] hover:bg-[#2a2a2a] transition-colors flex items-center justify-between gap-2"
                >
                  <span className="truncate">{perfume.name}</span>
                  <span className="text-[11px] text-[#888] shrink-0">
                    {perfume.volume} · {perfume.gender}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Gender filter pills */}
        <div className="flex gap-1 bg-[#111] p-1 rounded-xl border border-[#222]">
          {genderOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setGenderFilter(opt.value)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                genderFilter === opt.value
                  ? "bg-[#d4a853] text-black shadow-sm"
                  : "text-[#888] hover:text-[#ccc]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Margin Calculator */}
      <div className="flex flex-wrap items-center gap-4 bg-[#1a1a1a] p-4 rounded-xl border border-[#2a2a2a] lg:w-auto">
        <div className="flex items-center gap-2">
          <Label
            htmlFor="margin-input"
            className="text-xs font-bold uppercase tracking-wider text-[#d4a853]"
          >
            Margen Sugerido:
          </Label>
          <div className="relative flex items-center">
            <span className="absolute left-2 text-[#d4a853] font-semibold text-sm">
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
              className="w-16 pl-5 pr-2 py-1 text-sm font-bold text-center text-[#d4a853] bg-[#111] border-[#333] focus:ring-[#d4a853] focus:border-[#d4a853]"
            />
            <span className="ml-1 text-[#d4a853] text-sm font-semibold">%</span>
          </div>
        </div>
        <div className="h-6 w-px bg-[#333] hidden sm:block" />
        <div className="flex items-center gap-2">
          <Switch
            id="unpriced-filter"
            checked={showOnlyUnpriced}
            onCheckedChange={toggleShowOnlyUnpriced}
            className="data-[state=checked]:bg-[#d4a853]"
          />
          <Label
            htmlFor="unpriced-filter"
            className="text-xs font-medium text-[#999] cursor-pointer"
          >
            Ver solo &quot;Sin precio&quot;
          </Label>
        </div>
      </div>
    </div>
  );
}
