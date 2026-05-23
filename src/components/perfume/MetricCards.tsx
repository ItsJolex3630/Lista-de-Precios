"use client";

import { usePerfumeStore } from "@/hooks/usePerfumeStore";
import { Card, CardContent } from "@/components/ui/card";
import { FlaskConical, CheckCircle2, AlertTriangle, DollarSign } from "lucide-react";

export function MetricCards() {
  const getMetrics = usePerfumeStore((s) => s.getMetrics);
  const metrics = getMetrics();

  const cards = [
    {
      label: "Total Perfumes",
      value: metrics.total,
      icon: FlaskConical,
      iconBg: "bg-[#d4a853]/10",
      iconColor: "text-[#d4a853]",
      valueColor: "text-white",
    },
    {
      label: "Cotizados (Con Precio)",
      value: metrics.priced,
      icon: CheckCircle2,
      iconBg: "bg-[#d4a853]/10",
      iconColor: "text-[#d4a853]",
      valueColor: "text-[#d4a853]",
    },
    {
      label: "Sin Cotizar (Sin Precio)",
      value: metrics.unpriced,
      icon: AlertTriangle,
      iconBg: "bg-[#ef4444]/10",
      iconColor: "text-[#ef4444]",
      valueColor: "text-[#ef4444]",
    },
    {
      label: "Costo Promedio (Mayor)",
      value: `$${metrics.avgCost.toFixed(2)}`,
      icon: DollarSign,
      iconBg: "bg-[#d4a853]/10",
      iconColor: "text-[#d4a853]",
      valueColor: "text-[#d4a853]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6">
      {cards.map((card) => (
        <Card
          key={card.label}
          className="bg-[#161616] border border-[#2a2a2a] shadow-none hover:border-[#3a3a3a] transition-colors"
        >
          <CardContent className="p-4 md:p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#888]">
                {card.label}
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${card.valueColor}`}>
                {card.value}
              </h3>
            </div>
            <div className={`p-3 rounded-lg ${card.iconBg}`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
