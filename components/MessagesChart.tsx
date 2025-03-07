'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { ParsedStatsData } from '@/app/dashboard';
import { translateMessagesTypes } from '@/app/utils/translateMessagesTypes';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card';

const chartConfig = {
  sent: {
    label: 'Envoyés',
    color: '#2563eb',
  },
  answered: {
    label: 'Répondus',
    color: '#60a5fa',
  },
} satisfies ChartConfig;

interface Props {
  stats: ParsedStatsData;
}

export function MessagesChart({ stats }: Props) {
  const chartData = Object.entries(stats).map(([type, data]) => ({
    type: translateMessagesTypes(
      type as 'linkedinMessage' | 'linkedinInmail' | 'email'
    ),
    sent: data.totalMessagesNumber,
    answered: data.repliedMessagesNumber,
  }));

  return (
    <Card className="min-h-[200px] max-w-4xl lg:max-w-full lg:w-full">
      <CardHeader>
        <CardTitle>Messages envoyés - Réponses obtenues</CardTitle>
        <CardDescription>Sur la période sélectionnée</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="min-h-[200px]"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="type"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="sent"
              fill="var(--color-sent)"
              radius={4}
            />
            <Bar
              dataKey="answered"
              fill="var(--color-answered)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
