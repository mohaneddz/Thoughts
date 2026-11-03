'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChipGroup } from '@/components/tools/chipGroup';
import { SaveToThoughtsButton } from '@/components/tools/saveToThoughtsButton';
import { emotionFamilies } from '@/data/reflectionTools';

const size = 360;
const center = size / 2;
const innerRadius = 52;
const middleRadius = 108;
const outerRadius = 172;

function polar(radius: number, degrees: number): [number, number] {
  const radians = ((degrees - 90) * Math.PI) / 180;
  // Rounded so server and client produce identical path strings during hydration.
  const round = (value: number) => Math.round(value * 100) / 100;
  return [round(center + radius * Math.cos(radians)), round(center + radius * Math.sin(radians))];
}

function ringSegment(r0: number, r1: number, startDeg: number, endDeg: number) {
  const large = endDeg - startDeg > 180 ? 1 : 0;
  const [x0, y0] = polar(r1, startDeg);
  const [x1, y1] = polar(r1, endDeg);
  const [x2, y2] = polar(r0, endDeg);
  const [x3, y3] = polar(r0, startDeg);
  return `M${x0},${y0} A${r1},${r1} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 ${large} 0 ${x3},${y3} Z`;
}

/** Rotates a label to run along its radius and flips it on the left half so it never reads upside down. */
function radialLabelTransform(radius: number, angle: number) {
  const [x, y] = polar(radius, angle);
  const flip = angle > 180;
  return `translate(${x},${y}) rotate(${Math.round(angle - 90 + (flip ? 180 : 0))})`;
}

const intensityWords = ['', 'faint', 'faint', 'mild', 'mild', 'moderate', 'moderate', 'strong', 'strong', 'intense', 'overwhelming'];

export function EmotionWheelTool() {
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [feeling, setFeeling] = useState<string | null>(null);
  const [nuances, setNuances] = useState<string[]>([]);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');

  const family = emotionFamilies.find((item) => item.id === familyId);
  const feelingEntry = family?.feelings.find((item) => item.label === feeling);
  const familySpan = 360 / emotionFamilies.length;

  const pickFeeling = (nextFamilyId: string, nextFeeling: string) => {
    setFamilyId(nextFamilyId);
    setFeeling(nextFeeling);
    setNuances([]);
  };

  const reset = () => {
    setFamilyId(null);
    setFeeling(null);
    setNuances([]);
    setIntensity(5);
    setNote('');
  };

  const named = nuances.length ? nuances.join(', ') : feeling ?? family?.label ?? '';
  const path = [family?.label, nuances.length ? feeling : null].filter(Boolean).join(' → ');
  const summary = [
    `Feeling: ${named}${path ? ` (${path})` : ''}`,
    `Intensity: ${intensity}/10 — ${intensityWords[intensity]}`,
    note.trim() ? `Note: ${note.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div className='grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'>
      <Card className='flex flex-col items-center gap-3 p-4'>
        <p className='self-start text-sm text-[var(--color-muted)]'>Start in the middle with the broad family, then pick the closest feeling on the outer ring.</p>
        <svg viewBox={`0 0 ${size} ${size}`} className='w-full max-w-[26rem]' role='group' aria-label='Emotion wheel'>
          {emotionFamilies.map((item, familyIndex) => {
            const start = familyIndex * familySpan;
            const end = start + familySpan;
            const active = item.id === familyId;
            const dimmed = familyId !== null && !active;
            const feelingSpan = familySpan / item.feelings.length;

            return (
              <g key={item.id} opacity={dimmed ? 0.4 : 1} className='transition-opacity'>
                <path
                  d={ringSegment(innerRadius, middleRadius, start, end)}
                  fill={item.color}
                  stroke='var(--color-surface)'
                  strokeWidth={2}
                  className='cursor-pointer'
                  role='button'
                  tabIndex={0}
                  aria-label={item.label}
                  aria-pressed={active}
                  onClick={() => {
                    setFamilyId(item.id);
                    setFeeling(null);
                    setNuances([]);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setFamilyId(item.id);
                      setFeeling(null);
                    }
                  }}
                />
                <text transform={radialLabelTransform((innerRadius + middleRadius) / 2, start + familySpan / 2)} textAnchor='middle' dominantBaseline='middle' fontSize='13' fontWeight='600' fill='#fff' pointerEvents='none'>
                  {item.label}
                </text>

                {item.feelings.map((entry, feelingIndex) => {
                  const fStart = start + feelingIndex * feelingSpan;
                  const fEnd = fStart + feelingSpan;
                  const selected = active && entry.label === feeling;
                  return (
                    <g key={entry.label}>
                      <path
                        d={ringSegment(middleRadius + 3, selected ? outerRadius + 6 : outerRadius, fStart, fEnd)}
                        fill={item.color}
                        fillOpacity={selected ? 0.95 : 0.55}
                        stroke='var(--color-surface)'
                        strokeWidth={2}
                        className='cursor-pointer transition-all'
                        role='button'
                        tabIndex={0}
                        aria-label={`${entry.label} (${item.label})`}
                        aria-pressed={selected}
                        onClick={() => pickFeeling(item.id, entry.label)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            pickFeeling(item.id, entry.label);
                          }
                        }}
                      />
                      <text transform={radialLabelTransform((middleRadius + outerRadius) / 2 + 2, fStart + feelingSpan / 2)} textAnchor='middle' dominantBaseline='middle' fontSize='10.5' fill='var(--color-text-strong)' pointerEvents='none'>
                        {entry.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
          <circle cx={center} cy={center} r={innerRadius - 4} fill='var(--color-surface)' />
          <text x={center} y={center} textAnchor='middle' dominantBaseline='middle' fontSize='12' fill='var(--color-muted)'>
            {feeling ?? family?.label ?? 'Pick one'}
          </text>
        </svg>
      </Card>

      <Card className='space-y-5 p-5'>
        {!family ? (
          <div className='space-y-2'>
            <h2 className='font-heading text-3xl text-[var(--color-text-strong)]'>What is here right now?</h2>
            <p className='text-sm text-[var(--color-muted)]'>
              Naming a feeling precisely tends to take some of its edge off. There is no wrong answer, and you can pick a different one any time.
            </p>
          </div>
        ) : (
          <>
            <div className='space-y-1'>
              <p className='text-xs font-semibold uppercase tracking-[0.16em]' style={{ color: family.color }}>{family.label}</p>
              <h2 className='font-heading text-3xl text-[var(--color-text-strong)]'>{feeling ?? 'Which feeling is closest?'}</h2>
            </div>

            {!feeling ? (
              <ChipGroup label='Feelings' multiple={false} options={family.feelings.map((item) => item.label)} selected={[]} onToggle={(option) => pickFeeling(family.id, option)} />
            ) : null}

            {feelingEntry ? (
              <div className='space-y-2'>
                <p className='text-sm font-semibold text-[var(--color-text)]'>Can you get more specific?</p>
                <ChipGroup
                  label='Nuances'
                  options={feelingEntry.nuances}
                  selected={nuances}
                  onToggle={(option) => setNuances((prev) => (prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]))}
                />
              </div>
            ) : null}

            {feeling ? (
              <>
                <div className='space-y-2'>
                  <label htmlFor='emotion-intensity' className='text-sm font-semibold text-[var(--color-text)]'>
                    How strong is it? <span className='font-normal text-[var(--color-muted)]'>{intensity}/10 · {intensityWords[intensity]}</span>
                  </label>
                  <input id='emotion-intensity' type='range' min={1} max={10} value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} className='w-full accent-[var(--color-primary)]' />
                </div>
                <div className='space-y-2'>
                  <label htmlFor='emotion-note' className='text-sm font-semibold text-[var(--color-text)]'>Anything you want to remember about it?</label>
                  <textarea
                    id='emotion-note'
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder='Optional'
                    className='min-h-24 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm outline-none focus:border-[var(--color-primary)]'
                  />
                </div>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                  <SaveToThoughtsButton toolId='emotion-wheel' title={`Feeling ${named.toLowerCase()}`} content={summary} tags={['emotion wheel', family.label.toLowerCase()]} />
                  <Button variant='ghost' onClick={reset}>
                    <RotateCcw size={14} />
                    Start over
                  </Button>
                </div>
              </>
            ) : null}
          </>
        )}
      </Card>
    </div>
  );
}
