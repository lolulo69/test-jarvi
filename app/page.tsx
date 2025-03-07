'use client';

import React, { useState, useEffect } from 'react';
import { nhost } from './lib/nhost-client';

// Define interfaces for the aggregate data
interface Aggregate {
  count: number;
}

interface HistoryEntriesAggregate {
  aggregate: Aggregate;
}

interface StatsData {
  linkedin_message_total: HistoryEntriesAggregate;
  linkedin_message_replied: HistoryEntriesAggregate;
  linkedin_inmail_total: HistoryEntriesAggregate;
  linkedin_inmail_replied: HistoryEntriesAggregate;
  email_total: HistoryEntriesAggregate;
  email_replied: HistoryEntriesAggregate;
}

export default function Home() {
  // Define your dynamic date values
  const startDate = '2024-01-01T00:00:00Z';
  const endDate = '2024-01-31T23:59:59Z';

  // State to hold stats and error messages
  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Sign in only once on mount
        await nhost.auth.signIn({
          email: 'quentin@jarvi.tech',
          password: 'mYAW9QVdMKZenfbA',
        });
        console.log('Signed in', nhost.auth.getUser());

        // Execute the GraphQL query
        const response = await nhost.graphql.request(
          `query historyentriesStatistics {
            linkedin_message_total: historyentries_aggregate(
              where: {
                createdAt: { _gte: "${startDate}", _lte: "${endDate}" },
                type: { _eq: "LINKEDIN_MESSAGE_SENT" }
              }
            ) {
              aggregate {
                count
              }
            }
            linkedin_message_replied: historyentries_aggregate(
              where: {
                createdAt: { _gte: "${startDate}", _lte: "${endDate}" },
                type: { _eq: "LINKEDIN_MESSAGE_SENT" },
                triggerHasBeenRepliedTo: { _eq: true }
              }
            ) {
              aggregate {
                count
              }
            }
            linkedin_inmail_total: historyentries_aggregate(
              where: {
                createdAt: { _gte: "${startDate}", _lte: "${endDate}" },
                type: { _eq: "LINKEDIN_INMAIL_SENT" }
              }
            ) {
              aggregate {
                count
              }
            }
            linkedin_inmail_replied: historyentries_aggregate(
              where: {
                createdAt: { _gte: "${startDate}", _lte: "${endDate}" },
                type: { _eq: "LINKEDIN_INMAIL_SENT" },
                triggerHasBeenRepliedTo: { _eq: true }
              }
            ) {
              aggregate {
                count
              }
            }
            email_total: historyentries_aggregate(
              where: {
                createdAt: { _gte: "${startDate}", _lte: "${endDate}" },
                type: { _eq: "EMAIL_SENT" }
              }
            ) {
              aggregate {
                count
              }
            }
            email_replied: historyentries_aggregate(
              where: {
                createdAt: { _gte: "${startDate}", _lte: "${endDate}" },
                type: { _eq: "EMAIL_SENT" },
                triggerHasBeenRepliedTo: { _eq: true }
              }
            ) {
              aggregate {
                count
              }
            }
          }`
        );
        setStats(response.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Error fetching stats:', err);
        setError('An error occurred while fetching stats.');
      }
    };

    fetchStats();
  }, [startDate, endDate]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Stats</h1>
      <p>
        LinkedIn messages sent: {stats.linkedin_message_total.aggregate.count}
      </p>
      <p>
        LinkedIn messages replied:{' '}
        {stats.linkedin_message_replied.aggregate.count}
      </p>
      <p>
        LinkedIn inmails sent: {stats.linkedin_inmail_total.aggregate.count}
      </p>
      <p>
        LinkedIn inmails replied:{' '}
        {stats.linkedin_inmail_replied.aggregate.count}
      </p>
      <p>Emails sent: {stats.email_total.aggregate.count}</p>
      <p>Emails replied: {stats.email_replied.aggregate.count}</p>
    </div>
  );
}
