export const buildMessagesQuery = (
  startDate: string,
  endDate: string
) => `query historyentriesStatistics {
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
  }`;
