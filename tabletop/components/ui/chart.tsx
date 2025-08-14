"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "./utils";

/**
 * ChartConfig shape:
 * key => { label?, icon?, color? } OR theme map for light/dark
 */
export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<"light" | "dark", string> }
  );
};

const THEMES = { light: "", dark: ".dark" } as const;

type ChartContextProps = { config: ChartConfig };
const ChartContext = React.createContext<ChartContextProps | null>(null);
function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) throw new Error("useChart must be used within <ChartContainer />");
  return ctx;
}

/* -------------------------
   ChartContainer + ChartStyle
   ------------------------- */

function ChartContainer({
  id,
  config,
  className,
  children,
  ...divProps
}: {
  id?: string;
  config: ChartConfig;
  children: React.ReactElement; // Recharts ResponsiveContainer expects a single ReactElement (chart)
} & React.HTMLAttributes<HTMLDivElement>) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...divProps}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, c]) => c.theme || c.color);
  if (!colorConfig.length) return null;

  const css = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      return `${prefix} [data-chart=${id}] {\n${colorConfig
        .map(([key, rawConfig]) => {
          const itemConfig = rawConfig as any; // single cast here
          const themeColors = itemConfig.theme as Record<string, string> | undefined;
          const color =
            (themeColors && themeColors[theme]) || itemConfig.color || undefined;

          return color ? `  --color-${key}: ${color};` : null;
        })
        .filter(Boolean)
        .join("\n")}\n}\n`;
    })
    .join("\n");

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
};

/* -------------------------
   Tooltip types & helpers
   ------------------------- */

/** What Recharts payload items commonly contain (we narrow to these fields) */
type TooltipPayloadItem = {
  color?: string;
  dataKey?: string;
  name?: string;
  value?: number | string;
  payload?: Record<string, any>;
  fill?: string;
};

/** Extend Recharts TooltipProps to explicitly include payload/label */
type CustomTooltipProps = Omit<RechartsPrimitive.TooltipProps<number, string>, "content" | "viewBox"> & {
  payload?: TooltipPayloadItem[] | null;
  label?: string | number | null;
};

/* Helper: get config entry from payload */
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) return undefined;

  const asAny = payload as any;
  const payloadPayload =
    "payload" in asAny && typeof asAny.payload === "object" && asAny.payload !== null ? asAny.payload : undefined;

  let configLabelKey = key;

  if (key in asAny && typeof asAny[key] === "string") {
    configLabelKey = asAny[key] as string;
  } else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key] === "string") {
    configLabelKey = payloadPayload[key] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config];
}

/* -------------------------
   Tooltip component
   ------------------------- */

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
  active,
  payload,
  label,
  labelFormatter,
  formatter,
  className,
  hideLabel = false,
  hideIndicator = false,
  indicator = "dot",
  nameKey,
  labelKey,
}: CustomTooltipProps & {
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  nameKey?: string;
  labelKey?: string;
  className?: string;
}) {
  const { config } = useChart();

  // Safe guards
  const items = Array.isArray(payload) ? (payload as TooltipPayloadItem[]) : [];

  if (!active || items.length === 0) return null;

  const tooltipLabel = (() => {
    if (hideLabel || items.length === 0) return null;

    const [first] = items;
    const key = `${labelKey || first?.dataKey || first?.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, first, key);
    const value =
      !labelKey && typeof label === "string" ? config[label as keyof typeof config]?.label ?? label : itemConfig?.label;

    if (labelFormatter) {
      // labelFormatter signature in Recharts is (label, payload) => ReactNode | string
      return <div className="font-medium">{labelFormatter(value as any, payload as any)}</div>;
    }

    if (!value) return null;
    return <div className="font-medium">{value}</div>;
  })();

  const nestLabel = items.length === 1 && indicator !== "dot";

  return (
    <div className={cn("border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl", className)}>
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {items.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = (item.payload && item.payload.fill) || item.fill || item.color;

          return (
            <div
              key={item.dataKey ?? index}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicator === "dot" && "items-center"
              )}
            >
              {formatter && item.value !== undefined && item.name ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (formatter as any)(item.value as any, item.name as any, item as any, index, item.payload as any)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={cn(
                          "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                          { "h-2.5 w-2.5": indicator === "dot", "w-1": indicator === "line", "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed", "my-0.5": nestLabel && indicator === "dashed" }
                        )}
                        style={{ ["--color-bg" as any]: indicatorColor, ["--color-border" as any]: indicatorColor } as React.CSSProperties}
                      />
                    )
                  )}

                  <div className={cn("flex flex-1 justify-between leading-none", nestLabel ? "items-end" : "items-center")}>
                    <div className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">{itemConfig?.label ?? item.name}</span>
                    </div>

                    {item.value !== undefined && (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------
   Legend component
   ------------------------- */

const ChartLegend = RechartsPrimitive.Legend;

type LegendPayloadItem = {
  value?: string | number;
  color?: string;
  dataKey?: string;
};

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: {
  className?: string;
  hideIcon?: boolean;
  payload?: LegendPayloadItem[] | null;
  verticalAlign?: "top" | "bottom" | "middle";
  nameKey?: string;
}) {
  const { config } = useChart();

  const items = Array.isArray(payload) ? (payload as LegendPayloadItem[]) : [];
  if (!items.length) return null;

  return (
    <div className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}>
      {items.map((item, i) => {
        const key = `${nameKey || item.dataKey || "value"}`;
        const itemConfig = config[key as keyof typeof config];
        return (
          <div key={item.value ?? i} className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3">
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div className="h-2 w-2 shrink-0 rounded-[2px]" style={{ backgroundColor: item.color }} />
            )}
            {itemConfig?.label ?? item.value}
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------
   Exports
   ------------------------- */

export {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
};
