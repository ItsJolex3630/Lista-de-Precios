"use client";

import { useState } from "react";
import { usePerfumeStore } from "@/hooks/usePerfumeStore";
import type { GenderFilter } from "@/hooks/usePerfumeStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

export function AddPerfumeForm() {
  const addPerfume = usePerfumeStore((s) => s.addPerfume);
  const [name, setName] = useState("");
  const [volume, setVolume] = useState("");
  const [gender, setGender] = useState<GenderFilter>("DAMA");
  const [wholesale, setWholesale] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setIsAdding(true);
    try {
      addPerfume({
        name: name.toUpperCase(),
        volume: volume || "100ML",
        gender,
        wholesale: wholesale.trim() === "" ? null : parseFloat(wholesale),
      });
      setName("");
      setVolume("");
      setWholesale("");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-[#161616] p-4 md:p-6 rounded-2xl border border-[#2a2a2a] shadow-none">
      <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-[#d4a853]" />
        Agregar nuevo perfume a la lista
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label className="block text-xs font-bold text-[#888] uppercase tracking-wide mb-1">
            Nombre
          </Label>
          <Input
            placeholder="Ej. ASAD GOLD ELIXIR"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-[#555] focus:ring-[#d4a853] focus:border-[#d4a853]"
          />
        </div>
        <div>
          <Label className="block text-xs font-bold text-[#888] uppercase tracking-wide mb-1">
            Volumen
          </Label>
          <Input
            placeholder="Ej. 100ML"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-[#555] focus:ring-[#d4a853] focus:border-[#d4a853]"
          />
        </div>
        <div>
          <Label className="block text-xs font-bold text-[#888] uppercase tracking-wide mb-1">
            Genero
          </Label>
          <Select value={gender} onValueChange={(v) => setGender(v as GenderFilter)}>
            <SelectTrigger className="bg-[#1a1a1a] border-[#333] text-white focus:ring-[#d4a853]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1e1e1e] border-[#333]">
              <SelectItem value="DAMA" className="text-[#f472b6] focus:bg-[#2a2a2a]">DAMA</SelectItem>
              <SelectItem value="CABALLERO" className="text-[#60a5fa] focus:bg-[#2a2a2a]">CABALLERO</SelectItem>
              <SelectItem value="UNISEX" className="text-[#c084fc] focus:bg-[#2a2a2a]">UNISEX</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block text-xs font-bold text-[#888] uppercase tracking-wide mb-1">
            Precio Mayor ($)
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Ej. 35 o dejar vacio"
              value={wholesale}
              onChange={(e) => setWholesale(e.target.value)}
              className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-[#555] focus:ring-[#d4a853] focus:border-[#d4a853]"
            />
            <Button
              onClick={handleSubmit}
              disabled={isAdding || !name.trim()}
              className="bg-gradient-to-r from-[#d4a853] to-[#b8860b] text-black font-bold shadow-none hover:from-[#c9972e] hover:to-[#a67808] whitespace-nowrap disabled:opacity-50"
            >
              {isAdding ? "..." : "Agregar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
