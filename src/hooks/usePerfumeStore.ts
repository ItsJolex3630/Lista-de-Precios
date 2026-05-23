import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Perfume, initialPerfumes } from "@/data/perfumes";

type GenderFilter = "TODOS" | "DAMA" | "CABALLERO" | "UNISEX";

interface PerfumeState {
  perfumes: Perfume[];
  marginPercent: number;
  searchQuery: string;
  genderFilter: GenderFilter;
  showOnlyUnpriced: boolean;
  currentPage: number;
  rowsPerPage: number | "all";
  highlightedPerfumeId: number | null;

  // Actions
  setMarginPercent: (margin: number) => void;
  setSearchQuery: (query: string) => void;
  setGenderFilter: (filter: GenderFilter) => void;
  toggleShowOnlyUnpriced: () => void;
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rows: number | "all") => void;
  setHighlightedPerfumeId: (id: number | null) => void;
  highlightAndScrollToPerfume: (id: number) => void;

  updatePerfume: (id: number, field: keyof Perfume, value: string | number | null) => void;
  addPerfume: (perfume: Omit<Perfume, "id">) => void;
  deletePerfume: (id: number) => void;
  resetData: () => void;

  // Computed
  getFilteredPerfumes: () => Perfume[];
  getSuggestions: (query: string) => Perfume[];
  getMetrics: () => {
    total: number;
    priced: number;
    unpriced: number;
    avgCost: number;
  };
  getSuggestedPrice: (wholesale: number | null) => number | null;
}

export type { GenderFilter };

export const usePerfumeStore = create<PerfumeState>()(
  persist(
    (set, get) => ({
      perfumes: initialPerfumes,
      marginPercent: 35,
      searchQuery: "",
      genderFilter: "TODOS" as GenderFilter,
      showOnlyUnpriced: false,
      currentPage: 1,
      rowsPerPage: 25,
      highlightedPerfumeId: null,

      setMarginPercent: (margin) => set({ marginPercent: margin }),
      setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
      setGenderFilter: (filter) => set({ genderFilter: filter, currentPage: 1 }),
      toggleShowOnlyUnpriced: () =>
        set((state) => ({ showOnlyUnpriced: !state.showOnlyUnpriced, currentPage: 1 })),
      setCurrentPage: (page) => set({ currentPage: page }),
      setRowsPerPage: (rows) => set({ rowsPerPage: rows, currentPage: 1 }),
      setHighlightedPerfumeId: (id) => set({ highlightedPerfumeId: id }),

      highlightAndScrollToPerfume: (id) => {
        set({ highlightedPerfumeId: id });

        // Calculate which page this perfume is on
        const { getFilteredPerfumes, rowsPerPage } = get();
        const filtered = getFilteredPerfumes();
        const perfumeIndex = filtered.findIndex((p) => p.id === id);
        if (perfumeIndex === -1) return;

        const limit = rowsPerPage === "all" ? filtered.length : rowsPerPage;
        const targetPage = Math.floor(perfumeIndex / limit) + 1;
        set({ currentPage: targetPage });

        // Scroll after render
        requestAnimationFrame(() => {
          const row = document.getElementById(`perfume-row-${id}`);
          if (row) {
            row.scrollIntoView({ behavior: "smooth", block: "center" });
            // Remove highlight after 3 seconds
            setTimeout(() => {
              set({ highlightedPerfumeId: null });
            }, 3000);
          }
        });
      },

      updatePerfume: (id, field, value) =>
        set((state) => ({
          perfumes: state.perfumes.map((p) =>
            p.id === id ? { ...p, [field]: value } : p
          ),
        })),

      addPerfume: (perfume) =>
        set((state) => {
          const nextId = state.perfumes.length > 0
            ? Math.max(...state.perfumes.map((p) => p.id)) + 1
            : 1;
          return {
            perfumes: [...state.perfumes, { ...perfume, id: nextId }],
          };
        }),

      deletePerfume: (id) =>
        set((state) => ({
          perfumes: state.perfumes.filter((p) => p.id !== id),
        })),

      resetData: () =>
        set({
          perfumes: initialPerfumes,
          marginPercent: 35,
        }),

      getFilteredPerfumes: () => {
        const { perfumes, genderFilter, searchQuery, showOnlyUnpriced } = get();
        return perfumes.filter((p) => {
          const matchesGender =
            genderFilter === "TODOS" || p.gender === genderFilter;
          const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toString() === searchQuery;
          const matchesUnpriced = !showOnlyUnpriced || p.wholesale === null;
          return matchesGender && matchesSearch && matchesUnpriced;
        });
      },

      getSuggestions: (query) => {
        if (!query.trim()) return [];
        const { perfumes } = get();
        const lower = query.toLowerCase();
        return perfumes
          .filter((p) => p.name.toLowerCase().includes(lower))
          .slice(0, 8);
      },

      getMetrics: () => {
        const { perfumes } = get();
        const total = perfumes.length;
        const priced = perfumes.filter((p) => p.wholesale !== null).length;
        const unpriced = total - priced;
        const sumWholesale = perfumes.reduce(
          (sum, p) => sum + (p.wholesale ?? 0),
          0
        );
        const avgCost = priced > 0 ? sumWholesale / priced : 0;
        return { total, priced, unpriced, avgCost };
      },

      getSuggestedPrice: (wholesale) => {
        const { marginPercent } = get();
        if (wholesale === null || isNaN(wholesale)) return null;
        return Math.round(wholesale * (1 + marginPercent / 100));
      },
    }),
    {
      name: "perfume-inventory-store",
      partialize: (state) => ({
        perfumes: state.perfumes,
        marginPercent: state.marginPercent,
      }),
    }
  )
);
