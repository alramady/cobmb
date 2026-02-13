import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronUp, ChevronDown, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  labelAr?: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  getValue?: (row: T) => string | number;
  className?: string;
  headerClassName?: string;
}

interface FilterOption {
  key: string;
  label: string;
  labelAr?: string;
  options: { value: string; label: string; labelAr?: string }[];
}

interface DataTableProps<T> {
  data: T[] | undefined;
  columns: Column<T>[];
  isArabic?: boolean;
  pageSize?: number;
  searchPlaceholder?: string;
  searchPlaceholderAr?: string;
  filters?: FilterOption[];
  emptyIcon?: React.ReactNode;
  emptyText?: string;
  emptyTextAr?: string;
  actions?: (row: T) => React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isArabic = false,
  pageSize = 25,
  searchPlaceholder = "Search...",
  searchPlaceholderAr = "بحث...",
  filters = [],
  emptyIcon,
  emptyText = "No data",
  emptyTextAr = "لا توجد بيانات",
  actions,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Filter data
  const filtered = useMemo(() => {
    if (!data) return [];
    let result = [...data];

    // Apply text search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const val = col.getValue ? col.getValue(row) : row[col.key];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(q);
        })
      );
    }

    // Apply filters
    for (const filter of filters) {
      const fv = filterValues[filter.key];
      if (fv && fv !== "__all__") {
        result = result.filter((row) => String(row[filter.key]) === fv);
      }
    }

    return result;
  }, [data, search, columns, filters, filterValues]);

  // Sort data
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    return [...filtered].sort((a, b) => {
      const aVal = col?.getValue ? col.getValue(a) : a[sortKey];
      const bVal = col?.getValue ? col.getValue(b) : b[sortKey];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = typeof aVal === "number" && typeof bVal === "number"
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir, columns]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startRow = sorted.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endRow = Math.min(safePage * pageSize, sorted.length);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-3">
      {/* Search + Filters bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={isArabic ? searchPlaceholderAr : searchPlaceholder}
            className="pl-9 h-9 text-sm"
          />
        </div>
        {filters.map((f) => (
          <Select
            key={f.key}
            value={filterValues[f.key] || "__all__"}
            onValueChange={(v) => { setFilterValues((prev) => ({ ...prev, [f.key]: v })); setPage(1); }}
          >
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder={isArabic ? f.labelAr : f.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">{isArabic ? "الكل" : "All"}</SelectItem>
              {f.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {isArabic ? (opt.labelAr || opt.label) : opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`text-start p-3 font-medium text-slate-600 select-none ${col.headerClassName || ""} ${col.sortable !== false ? "cursor-pointer hover:text-slate-900" : ""}`}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {isArabic ? (col.labelAr || col.label) : col.label}
                      {col.sortable !== false && sortKey === col.key && (
                        sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </span>
                  </th>
                ))}
                {actions && (
                  <th className="text-end p-3 font-medium text-slate-600">
                    {isArabic ? "إجراءات" : "Actions"}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paged.map((row, i) => (
                <tr key={row.id ?? i} className="border-b last:border-0 hover:bg-slate-50">
                  {columns.map((col) => (
                    <td key={col.key} className={`p-3 ${col.className || ""}`}>
                      {col.render ? col.render(row) : (row[col.key] ?? "—")}
                    </td>
                  ))}
                  {actions && <td className="p-3 text-end space-x-1">{actions(row)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
          {sorted.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              {emptyIcon}
              <p className="mt-3">{isArabic ? emptyTextAr : emptyText}</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {sorted.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <span>
            {isArabic
              ? `عرض ${startRow}-${endRow} من ${sorted.length}`
              : `Showing ${startRow}-${endRow} of ${sorted.length}`}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={safePage <= 1} onClick={() => setPage(1)}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm font-medium">
              {safePage} / {totalPages}
            </span>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={safePage >= totalPages} onClick={() => setPage(totalPages)}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
