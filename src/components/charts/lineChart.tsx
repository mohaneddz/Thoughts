'use client';

import { useId, useState } from 'react';

export interface ChartSeries {
  id: string;
  label: string;
  color: string;
  values: Array<number | null>;
}

const width = 640;
const height = 220;
const padding = { top: 16, right: 16, bottom: 28, left: 32 };

/**
 * Small dependency-free line chart. Every series shares one x axis (`labels`);
 * a null value leaves a gap instead of drawing a line through missing data.
 */
export function LineChart({
  labels,
  series,
  yMin,
  yMax,
  yTicks = 5,
  formatValue = (value) => `${value}`,
}: {
  labels: string[];
  series: ChartSeries[];
  yMin: number;
  yMax: number;
  yTicks?: number;
  formatValue?: (value: number) => string;
}) {
  const clipId = useId();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const step = labels.length > 1 ? plotWidth / (labels.length - 1) : 0;

  const x = (index: number) => padding.left + (labels.length > 1 ? index * step : plotWidth / 2);
  const y = (value: number) => padding.top + plotHeight - ((value - yMin) / Math.max(yMax - yMin, 1)) * plotHeight;

  const paths = series.map((line) => {
    let d = '';
    let penDown = false;
    line.values.forEach((value, index) => {
      if (value == null) {
        penDown = false;
        return;
      }
      d += `${penDown ? 'L' : 'M'}${x(index).toFixed(1)},${y(value).toFixed(1)} `;
      penDown = true;
    });
    return { ...line, d };
  });

  const ticks = Array.from({ length: yTicks }, (_, index) => yMin + ((yMax - yMin) / (yTicks - 1)) * index);
  const labelEvery = Math.max(1, Math.ceil(labels.length / 7));

  return (
    <div className='space-y-3'>
      <div className='flex flex-wrap gap-3'>
        {series.map((line) => (
          <span key={line.id} className='inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)]'>
            <span className='h-2 w-2 rounded-full' style={{ backgroundColor: line.color }} />
            {line.label}
          </span>
        ))}
      </div>

      <div className='relative' dir='ltr'>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className='h-auto w-full touch-none select-none'
          role='img'
          aria-label={`Chart of ${series.map((line) => line.label).join(', ')} over ${labels.length} entries`}
          onPointerLeave={() => setHoverIndex(null)}
          onPointerMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            const svgX = ((event.clientX - bounds.left) / bounds.width) * width;
            const index = step ? Math.round((svgX - padding.left) / step) : 0;
            setHoverIndex(Math.min(Math.max(index, 0), labels.length - 1));
          }}
        >
          <defs>
            <clipPath id={clipId}>
              <rect x={padding.left} y={padding.top - 4} width={plotWidth} height={plotHeight + 8} />
            </clipPath>
          </defs>

          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={padding.left} x2={width - padding.right} y1={y(tick)} y2={y(tick)} stroke='var(--color-border)' strokeDasharray='3 5' />
              <text x={padding.left - 8} y={y(tick) + 4} textAnchor='end' fontSize='11' fill='var(--color-muted)'>
                {formatValue(Math.round(tick))}
              </text>
            </g>
          ))}

          {labels.map((label, index) =>
            index % labelEvery === 0 || index === labels.length - 1 ? (
              <text key={`${label}-${index}`} x={x(index)} y={height - 8} textAnchor='middle' fontSize='11' fill='var(--color-muted)'>
                {label}
              </text>
            ) : null,
          )}

          <g clipPath={`url(#${clipId})`}>
            {paths.map((line) => (
              <path key={line.id} d={line.d} fill='none' stroke={line.color} strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />
            ))}
          </g>

          {series.map((line) =>
            line.values.map((value, index) =>
              value == null ? null : (
                <circle
                  key={`${line.id}-${index}`}
                  cx={x(index)}
                  cy={y(value)}
                  r={hoverIndex === index ? 5 : labels.length > 20 ? 0 : 3}
                  fill='var(--color-surface)'
                  stroke={line.color}
                  strokeWidth='2'
                />
              ),
            ),
          )}

          {hoverIndex != null ? (
            <line x1={x(hoverIndex)} x2={x(hoverIndex)} y1={padding.top} y2={padding.top + plotHeight} stroke='var(--color-muted)' strokeOpacity='0.35' />
          ) : null}
        </svg>

        {hoverIndex != null ? (
          <div
            className='pointer-events-none absolute top-2 z-10 min-w-32 -translate-x-1/2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs shadow-[var(--shadow-card)]'
            style={{ left: `${Math.min(Math.max((x(hoverIndex) / width) * 100, 12), 88)}%` }}
          >
            <p className='font-semibold text-[var(--color-text-strong)]'>{labels[hoverIndex]}</p>
            {series.map((line) => (
              <p key={line.id} className='flex justify-between gap-3 text-[var(--color-muted)]'>
                <span>{line.label}</span>
                <span className='tabular-nums text-[var(--color-text)]'>{line.values[hoverIndex] == null ? '—' : formatValue(line.values[hoverIndex]!)}</span>
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
