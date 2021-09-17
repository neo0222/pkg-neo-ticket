export const BusinessError = {
  INVALID_DATE_FORMAT: 'error.invalid.date.format',
  INVALID_FLOOR: 'error.invald.floor',
  INVALID_ROW: 'error.invald.row',
  INVALID_COLUMN: 'error.invald.column',
} as const;

export type BusinessError = typeof BusinessError[keyof typeof BusinessError];