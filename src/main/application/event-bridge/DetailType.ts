export const DetailType = {
  ScheduledEvent: 'Scheduled Event', // スケジューリングされたルールはAWSのデフォルトイベントバスからinvokeされ、detail-typeは固定値
  AssignCrawling: 'AssignCrawling',
} as const;

export type DetailType = typeof DetailType[keyof typeof DetailType];