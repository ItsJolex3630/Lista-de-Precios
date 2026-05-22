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
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      valueColor: "text-slate-900",
    },
    {
      label: "Cotizados (Con Precio)",
      value: metrics.priced,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    {
      label: "Sin Cotizar (Sin Precio)",
      value: metrics.unpriced,
      icon: AlertTriangle,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      valueColor: "text-rose-500",
    },
    {
      label: "Costo Promedio (Mayor)",
      value: `$${metrics.avgCost.toFixed(2)}`,
      icon: DollarSign,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      valueColor: "text-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6">
      {cards.map((card) => (
        <Card key={card.label} className="border-slate-200 shadow-sm">
          <CardContent className="p-4 md:p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {card.label}
              </p>
              <h3 className={`text-2xl font-bold mt-1 ${card.valueColor}`}>
                {card.value}
              </h3>
            </div>
            <div className={`p-3 rounded-lg ${card.iconBg} ${card.iconColor}`}>
              <card.icon className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
