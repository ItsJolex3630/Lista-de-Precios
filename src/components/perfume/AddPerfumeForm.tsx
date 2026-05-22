"use client";

import { useState } from "react";
import { usePerfumeStore } from "@/hooks/usePerfumeStore";
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
import type { GenderFilter } from "@/data/perfumes";

export function AddPerfumeForm() {
  const addPerfume = usePerfumeStore((s) => s.addPerfume);
  const [name, setName] = useState("");
  const [volume, setVolume] = useState("");
  const [gender, setGender] = useState<GenderFilter>("DAMA");
  const [wholesale, setWholesale] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    addPerfume({
      name: name.toUpperCase(),
      volume: volume || "100ML",
      gender,
      wholesale: wholesale.trim() === "" ? null : parseFloat(wholesale),
    });
    setName("");
    setVolume("");
    setWholesale("");
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-base font-bold text-slate-950 mb-4 flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-amber-600" />
        Agregar nuevo perfume a la lista
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
            Nombre
          </Label>
          <Input
            placeholder="Ej. ASAD GOLD ELIXIR"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-slate-50 border-slate-200 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
            Volumen
          </Label>
          <Input
            placeholder="Ej. 100ML"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="bg-slate-50 border-slate-200 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
            Genero
          </Label>
          <Select value={gender} onValueChange={(v) => setGender(v as GenderFilter)}>
            <SelectTrigger className="bg-slate-50 border-slate-200 focus:ring-amber-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAMA">DAMA</SelectItem>
              <SelectItem value="CABALLERO">CABALLERO</SelectItem>
              <SelectItem value="UNISEX">UNISEX</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
            Precio Mayor ($)
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Ej. 35 o dejar vacio"
              value={wholesale}
              onChange={(e) => setWholesale(e.target.value)}
              className="bg-slate-50 border-slate-200 focus:ring-amber-500 focus:border-amber-500"
            />
            <Button
              onClick={handleSubmit}
              className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm whitespace-nowrap"
            >
              Agregar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
