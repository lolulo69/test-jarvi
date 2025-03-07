'use client';

import { DatePickerWithRange } from '@/components/DatePickerWithRange';
import { MessagesChart } from '@/components/MessagesChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { subDays } from 'date-fns';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { nhost } from './lib/nhost-client';
import { buildMessagesQuery } from './utils/buildMessagesQuery';
import { translateMessagesTypes } from './utils/translateMessagesTypes';

interface StatsTypeData {
  totalMessagesNumber: number;
  repliedMessagesNumber: number;
  repliedMessagesPercentage: number;
  progression: number;
}

export interface ParsedStatsData {
  linkedinMessage: StatsTypeData;
  linkedinInmail: StatsTypeData;
  email: StatsTypeData;
}

export default function Home() {
  // State to hold stats and error messages
  const [stats, setStats] = useState<ParsedStatsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // State to hold the date range
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  useEffect(() => {
    // Helper function to calculate a percentage, returns 0 if total is 0.
    const calculatePercentage = (replied: number, total: number): number =>
      total > 0 ? parseFloat(((replied / total) * 100).toFixed(2)) : 0;

    // Helper function to calculate progression between current and prior percentage.
    const calculateProgression = (
      currentReplied: number,
      currentTotal: number,
      priorReplied: number,
      priorTotal: number
    ): number => {
      const currentPercentage = calculatePercentage(
        currentReplied,
        currentTotal
      );
      const priorPercentage = calculatePercentage(priorReplied, priorTotal);
      return parseFloat((currentPercentage - priorPercentage).toFixed(2));
    };

    const fetchStats = async () => {
      try {
        // Sign in only once on mount
        await nhost.auth.signIn({
          email: 'quentin@jarvi.tech',
          password: 'mYAW9QVdMKZenfbA',
        });

        const daysInterval = dayjs(date?.to).diff(dayjs(date?.from), 'days');

        // Execute the GraphQL query
        const statsResponse = await nhost.graphql.request(
          buildMessagesQuery(
            dayjs(date?.from ?? new Date()).toISOString(),
            dayjs(date?.to ?? new Date()).toISOString()
          )
        );
        const priorPeriodStatsResponse = await nhost.graphql.request(
          buildMessagesQuery(
            dayjs(date?.from ?? new Date())
              .subtract(daysInterval, 'days')
              .toISOString(),
            dayjs(date?.to ?? new Date())
              .subtract(daysInterval, 'days')
              .toISOString()
          )
        );
        const priorPeriodStats = priorPeriodStatsResponse.data;
        const stats = statsResponse.data;
        const parsedStats: ParsedStatsData = {
          linkedinMessage: {
            totalMessagesNumber: stats.linkedin_message_total.aggregate.count,
            repliedMessagesNumber:
              stats.linkedin_message_replied.aggregate.count,
            repliedMessagesPercentage: calculatePercentage(
              stats.linkedin_message_replied.aggregate.count,
              stats.linkedin_message_total.aggregate.count
            ),
            progression: calculateProgression(
              stats.linkedin_message_replied.aggregate.count,
              stats.linkedin_message_total.aggregate.count,
              priorPeriodStats.linkedin_message_replied.aggregate.count,
              priorPeriodStats.linkedin_message_total.aggregate.count
            ),
          },
          linkedinInmail: {
            totalMessagesNumber: stats.linkedin_inmail_total.aggregate.count,
            repliedMessagesNumber:
              stats.linkedin_inmail_replied.aggregate.count,
            repliedMessagesPercentage: calculatePercentage(
              stats.linkedin_inmail_replied.aggregate.count,
              stats.linkedin_inmail_total.aggregate.count
            ),
            progression: calculateProgression(
              stats.linkedin_inmail_replied.aggregate.count,
              stats.linkedin_inmail_total.aggregate.count,
              priorPeriodStats.linkedin_inmail_replied.aggregate.count,
              priorPeriodStats.linkedin_inmail_total.aggregate.count
            ),
          },
          email: {
            totalMessagesNumber: stats.email_total.aggregate.count,
            repliedMessagesNumber: stats.email_replied.aggregate.count,
            repliedMessagesPercentage: calculatePercentage(
              stats.email_replied.aggregate.count,
              stats.email_total.aggregate.count
            ),
            progression: calculateProgression(
              stats.email_replied.aggregate.count,
              stats.email_total.aggregate.count,
              priorPeriodStats.email_replied.aggregate.count,
              priorPeriodStats.email_total.aggregate.count
            ),
          },
        };
        setStats(parsedStats);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Error fetching stats:', err);
        setError('An error occurred while fetching stats.');
      }
    };

    fetchStats();
  }, [date]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl pt-10">
      <div className="flex flex-col lg:flex-row justify-between items-end w-full gap-6 lg:gap-2 mb-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl lg:text-6xl">Statistiques</h1>
          <h3 className="text-xl lg:text-2xl">
            Quel moyen de contact obtient le plus de réponses ?
          </h3>
        </div>
        <DatePickerWithRange
          date={date}
          setDate={setDate}
        />
      </div>
      <div className="flex flex-col-reverse lg:flex-row items-stretch gap-6 mb-6">
        <div className="flex justify-center w-full lg:w-2/3">
          <MessagesChart stats={stats} />
        </div>

        <div className="flex flex-col justify-between w-full lg:w-1/3 items-center gap-2">
          {Object.entries(stats).map(([key, value]) => (
            <Card
              key={key}
              className="w-full"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {translateMessagesTypes(
                    key as 'email' | 'linkedinMessage' | 'linkedinInmail'
                  )}
                </CardTitle>
                {key.startsWith('linkedin') ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 56 14"
                    id="linkedin-logo-blue-xxsmall"
                    data-supported-dps="56x14"
                    width="56"
                    height="14"
                  >
                    <g>
                      <path
                        d="M22.1 8.2l3.09 3.8h-2.44L20 8.51V12h-2V2h2v5.88L22.54 5h2.55zm-8-3.4A2.7 2.7 0 0011.89 6V5H10v7h2V8.73a1.73 1.73 0 011.54-1.92h.12C14.82 6.8 15 7.94 15 8.73V12h2V8.29c0-2.2-.73-3.49-2.86-3.49zM32 8.66a3.23 3.23 0 010 .44h-5.25v.07a1.79 1.79 0 001.83 1.43 2.51 2.51 0 001.84-.69l1.33 1a4.3 4.3 0 01-3.25 1.29 3.49 3.49 0 01-3.7-3.26 4 4 0 010-.49 3.58 3.58 0 013.5-3.65h.26C30.44 4.8 32 6.13 32 8.66zm-1.86-.86a1.45 1.45 0 00-1.51-1.4h-.08a1.63 1.63 0 00-1.8 1.4zM2 2H0v10h6v-2H2zm36 0h2v10h-1.89v-.7a2.45 2.45 0 01-2 .9 3.41 3.41 0 01-3.32-3.5 1.41 1.41 0 010-.2 3.35 3.35 0 013-3.68h.3a2.61 2.61 0 011.9.7zm.15 6.5a1.64 1.64 0 00-1.4-1.84h-.22A1.76 1.76 0 0034.9 8.5a1.76 1.76 0 001.63 1.85 1.62 1.62 0 001.63-1.63.81.81 0 00-.01-.22zM8 1.8A1.27 1.27 0 006.75 3a1.25 1.25 0 002.5 0A1.27 1.27 0 008 1.8zM7 12h2V5H7zM56 1v12a1 1 0 01-1 1H43a1 1 0 01-1-1V1a1 1 0 011-1h12a1 1 0 011 1zM46 5h-2v7h2zm.25-2A1.25 1.25 0 1045 4.25 1.25 1.25 0 0046.25 3zM54 8.29c0-2.2-.73-3.49-2.86-3.49A2.71 2.71 0 0048.89 6V5H47v7h2V8.73a1.73 1.73 0 011.54-1.92h.12C51.82 6.8 52 7.94 52 8.73V12h2z"
                        fill="#0a66c2"
                      />
                    </g>
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 30 20"
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="20"
                  >
                    <g transform="translate(0, -5) scale(0.02929)">
                      <path
                        d="M938.666667 170.666667h-853.333334C37.546667 170.666667 0 208.213333 0 256v512C0 815.786667 37.546667 853.333333 85.333333 853.333333h853.333334c47.786667 0 85.333333-37.546667 85.333333-85.333333v-512C1024 208.213333 986.453333 170.666667 938.666667 170.666667zM368.64 542.72l-238.933333 204.8c-3.413333 3.413333-6.826667 3.413333-10.24 3.413333-3.413333 0-10.24-3.413333-13.653334-6.826666-6.826667-6.826667-6.826667-17.066667 3.413334-23.893334l238.933333-204.8c6.826667-6.826667 17.066667-6.826667 23.893333 3.413334 6.826667 6.826667 3.413333 17.066667-3.413333 23.893333z m133.12 3.413333c-23.893333 0-51.2-6.826667-68.266667-20.48L109.226667 303.786667c-6.826667-3.413333-10.24-17.066667-3.413334-23.893334 3.413333-6.826667 13.653333-10.24 23.893334-3.413333l324.266666 221.866667c27.306667 20.48 71.68 20.48 98.986667 0l341.333333-221.866667c6.826667-6.826667 17.066667-3.413333 23.893334 3.413333s3.413333 17.066667-3.413334 23.893334l-341.333333 221.866666c-20.48 13.653333-44.373333 20.48-71.68 20.48z m416.426667 197.973334c-3.413333 3.413333-6.826667 6.826667-13.653334 6.826666-3.413333 0-6.826667 0-10.24-3.413333l-238.933333-204.8c-6.826667-6.826667-6.826667-17.066667-3.413333-23.893333s17.066667-6.826667 23.893333-3.413334l238.933333 204.8c6.826667 6.826667 10.24 17.066667 3.413334 23.893334z"
                        fill="#000000"
                      />
                    </g>
                  </svg>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {value.repliedMessagesPercentage.toFixed(2)}%{' '}
                  <span className="text-xl"> de réponses</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {`${
                    Math.sign(value.progression) === 1 ? '+' : '-'
                  } ${Math.abs(
                    value.progression
                  )}% par rapport à la période précédente`}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
