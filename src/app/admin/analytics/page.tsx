"use client";

import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { analyticsAPI } from "@/lib/api";
import { PageRow, StatRow } from "@/types";

// رنگ‌های نمودار دایره‌ای (به ترتیب اولویت استفاده می‌شوند)
const PIE_COLORS = [
  "#534AB7",
  "#0F6E56",
  "#993C1D",
  "#993556",
  "#185FA5",
  "#3B6D11",
  "#854F0B",
  "#A32D2D",
  "#444441",
  "#26215C",
];

function formatNumber(n: number): string {
  return new Intl.NumberFormat("fa-IR").format(Math.round(n));
}

function formatDateLabel(dateStr: string): string {
  // ورودی نمونه از یاندکس: "2026-06-14"
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fa-IR", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState("7");
  const [stats, setStats] = useState<StatRow[]>([]);
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPages, setLoadingPages] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lineCanvasRef = useRef<HTMLCanvasElement>(null);
  const pieCanvasRef = useRef<HTMLCanvasElement>(null);
  const lineChartRef = useRef<Chart | null>(null);
  const pieChartRef = useRef<Chart | null>(null);

  // دریافت داده‌ها هر بار که بازه زمانی تغییر می‌کند
  useEffect(() => {
    let cancelled = false;
    setError(null);

    async function loadStats() {
      setLoadingStats(true);
      try {
        const res = await analyticsAPI.getStats(period);
        // بسته به ساختار wrapper شما، داده ممکن است در res.data یا خود res باشد
        const json = res?.data ?? res;
        if (!cancelled) setStats(json?.data || []);
      } catch (err) {
        if (!cancelled) setError("خطا در دریافت آمار بازدید");
      } finally {
        if (!cancelled) setLoadingStats(false);
      }
    }

    async function loadPages() {
      setLoadingPages(true);
      try {
        const res = await analyticsAPI.getPages(period);
        const json = res?.data ?? res;
        if (!cancelled) setPages(json?.data || []);
      } catch (err) {
        if (!cancelled) setError("خطا در دریافت آمار صفحات");
      } finally {
        if (!cancelled) setLoadingPages(false);
      }
    }

    loadStats();
    loadPages();

    return () => {
      cancelled = true;
    };
  }, [period]);

  // رسم/آپدیت نمودار خطی
  useEffect(() => {
    if (!lineCanvasRef.current || loadingStats) return;

    if (lineChartRef.current) {
      lineChartRef.current.destroy();
    }

    lineChartRef.current = new Chart(lineCanvasRef.current, {
      type: "line",
      data: {
        labels: stats.map((r) => formatDateLabel(r.date)),
        datasets: [
          {
            label: "بازدید",
            data: stats.map((r) => r.visits),
            borderColor: "#534AB7",
            backgroundColor: "rgba(83,74,183,0.08)",
            fill: true,
            tension: 0.35,
            pointRadius: 3,
            pointBackgroundColor: "#534AB7",
            borderWidth: 2,
          },
          {
            label: "صفحات بازدید شده",
            data: stats.map((r) => r.pageviews),
            borderColor: "#0F6E56",
            backgroundColor: "rgba(15,110,86,0.06)",
            fill: false,
            tension: 0.35,
            pointRadius: 3,
            pointBackgroundColor: "#0F6E56",
            borderWidth: 2,
            borderDash: [4, 3],
          },
          {
            label: "کاربران",
            data: stats.map((r) => r.users),
            borderColor: "#993C1D",
            backgroundColor: "rgba(153,60,29,0.06)",
            fill: false,
            tension: 0.35,
            pointRadius: 3,
            pointBackgroundColor: "#993C1D",
            borderWidth: 2,
            borderDash: [2, 2],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            rtl: true,
            titleAlign: "right",
            bodyAlign: "right",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: (v) => formatNumber(Number(v)) },
            grid: { color: "rgba(120,120,120,0.1)" },
          },
          x: { grid: { display: false } },
        },
      },
    });

    return () => {
      lineChartRef.current?.destroy();
    };
  }, [stats, loadingStats]);

  // رسم/آپدیت نمودار دایره‌ای
  useEffect(() => {
    if (!pieCanvasRef.current || loadingPages) return;

    if (pieChartRef.current) {
      pieChartRef.current.destroy();
    }

    const topPages = pages.slice(0, 8);

    pieChartRef.current = new Chart(pieCanvasRef.current, {
      type: "doughnut",
      data: {
        labels: topPages.map((p) => p.page),
        datasets: [
          {
            data: topPages.map((p) => p.pageviews),
            backgroundColor: PIE_COLORS,
            borderWidth: 2,
            borderColor: "#ffffff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            rtl: true,
            callbacks: {
              label: (ctx) => {
                const total = topPages.reduce((s, p) => s + p.pageviews, 0);
                const pct =
                  total > 0
                    ? ((Number(ctx.raw) / total) * 100).toFixed(1)
                    : "0";
                return `${formatNumber(Number(ctx.raw))} بازدید (${pct}٪)`;
              },
            },
          },
        },
      },
    });

    return () => {
      pieChartRef.current?.destroy();
    };
  }, [pages, loadingPages]);

  const totals = {
    visits: stats.reduce((s, r) => s + r.visits, 0),
    pageviews: stats.reduce((s, r) => s + r.pageviews, 0),
    users: stats.reduce((s, r) => s + r.users, 0),
  };

  const topPages = pages.slice(0, 8);
  const pagesTotal = topPages.reduce((s, p) => s + p.pageviews, 0);

  const periodLabels: any = {
    "7": "۷ روز",
    "30": "۳۰ روز",
    "90": "۹۰ روز",
  };

  return (
    <div dir="rtl" style={{ fontFamily: "inherit" }}>
      {error && (
        <div
          style={{
            background: "#FCEBEB",
            color: "#791F1F",
            padding: "0.75rem 1rem",
            borderRadius: 8,
            fontSize: 13,
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {/* کارت‌های خلاصه */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
          marginBottom: "1.5rem",
        }}
      >
        <SummaryCard
          label="بازدید"
          value={totals.visits}
          loading={loadingStats}
        />
        <SummaryCard
          label="صفحات بازدید شده"
          value={totals.pageviews}
          loading={loadingStats}
        />
        <SummaryCard
          label="کاربران"
          value={totals.users}
          loading={loadingStats}
        />
      </div>

      {/* نمودار خطی */}
      <div
        style={{
          background: "#ffffff",
          border: "0.5px solid rgba(0,0,0,0.12)",
          borderRadius: 12,
          padding: "1.25rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            روند بازدید سایت
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            {["7", "30", "90"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  fontSize: 12,
                  padding: "4px 12px",
                  borderRadius: 8,
                  border: "0.5px solid rgba(0,0,0,0.15)",
                  background: period === p ? "#534AB7" : "transparent",
                  color: period === p ? "#fff" : "inherit",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {periodLabels[p]}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 12,
            fontSize: 12,
            color: "#666",
          }}
        >
          <Legend color="#534AB7" label="بازدید" />
          <Legend color="#0F6E56" label="صفحات بازدید شده" />
          <Legend color="#993C1D" label="کاربران" />
        </div>

        <div style={{ position: "relative", width: "100%", height: 260 }}>
          {loadingStats ? (
            <ChartSkeleton />
          ) : stats.length === 0 ? (
            <EmptyState text="داده‌ای برای این بازه یافت نشد" />
          ) : (
            <canvas
              ref={lineCanvasRef}
              role="img"
              aria-label="نمودار خطی روند بازدید، صفحات بازدید شده و کاربران"
            />
          )}
        </div>
      </div>

      {/* نمودار دایره‌ای */}
      <div
        style={{
          background: "#ffffff",
          border: "0.5px solid rgba(0,0,0,0.12)",
          borderRadius: 12,
          padding: "1.25rem",
        }}
      >
        <p style={{ fontSize: 14, fontWeight: 500, margin: "0 0 1rem" }}>
          پربازدیدترین صفحات
        </p>

        {!loadingPages && topPages.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 12,
              fontSize: 12,
              color: "#666",
            }}
          >
            {topPages.map((p, i) => {
              const pct =
                pagesTotal > 0
                  ? ((p.pageviews / pagesTotal) * 100).toFixed(0)
                  : "0";
              return (
                <Legend
                  key={p.page}
                  color={PIE_COLORS[i % PIE_COLORS.length]}
                  label={`${p.page} ${pct}٪`}
                />
              );
            })}
          </div>
        )}

        <div style={{ position: "relative", width: "100%", height: 260 }}>
          {loadingPages ? (
            <ChartSkeleton />
          ) : topPages.length === 0 ? (
            <EmptyState text="داده‌ای برای این بازه یافت نشد" />
          ) : (
            <canvas
              ref={pieCanvasRef}
              role="img"
              aria-label="نمودار دایره‌ای پربازدیدترین صفحات سایت"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  loading,
}: {
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <div
      style={{
        background: "#f4f3f0",
        borderRadius: 8,
        padding: "1rem",
      }}
    >
      <p style={{ fontSize: 13, color: "#666", margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 500, margin: 0 }}>
        {loading ? "—" : formatNumber(value)}
      </p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 2,
          background: color,
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}

function ChartSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "#999",
        fontSize: 13,
      }}
    >
      در حال بارگذاری...
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "#999",
        fontSize: 13,
      }}
    >
      {text}
    </div>
  );
}
