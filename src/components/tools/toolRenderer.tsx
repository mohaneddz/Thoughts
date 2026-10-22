'use client';

import { DecisionHelperTool } from '@/components/tools/decisionHelperTool';
import { EmotionWheelTool } from '@/components/tools/emotionWheelTool';
import { EnergyDrainFinderTool } from '@/components/tools/energyDrainFinderTool';
import { PromptSequenceTool } from '@/components/tools/promptSequenceTool';
import { ValuesSorterTool } from '@/components/tools/valuesSorterTool';
import { promptSequences, type ReflectionTool } from '@/data/reflectionTools';

const bespokeTools: Record<string, () => React.JSX.Element> = {
  'emotion-wheel': EmotionWheelTool,
  'values-sorter': ValuesSorterTool,
  'decision-helper': DecisionHelperTool,
  'energy-drain-finder': EnergyDrainFinderTool,
};

export function ToolRenderer({ tool }: { tool: ReflectionTool }) {
  const Bespoke = bespokeTools[tool.id];
  if (Bespoke) return <Bespoke />;

  const sequence = promptSequences.find((item) => item.toolId === tool.id);
  return sequence ? <PromptSequenceTool sequence={sequence} toolTitle={tool.title} /> : null;
}
