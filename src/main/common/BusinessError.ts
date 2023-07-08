export const BusinessError = {
  INVALID_DATE_FORMAT: 'error.invalid.date.format',
  INVALID_FLOOR: 'error.invald.floor',
  INVALID_ROW: 'error.invald.row',
  INVALID_COLUMN: 'error.invald.column',
  CRAWLER_RESULT_NOT_FOUND: 'error.crawler.result.not.found',
  NO_SUCH_ELEMENT_EXISTS: 'error.no.such.element.exists',
  PERFORMANCE_CODE_NOT_GIVEN: 'error.performance.code.not.given',
  PERFORMANCE_DATE_NOT_GIVEN: 'error.performance.date.not.given',
  MATINEE_OR_SOIREE_NOT_GIVEN: 'error.matinee.or.soiree.not.given',
  REQUIRED_PARAMETER_NOT_GIVEN: 'error.required.parameter.not.given',
  SESSION_NOT_FOUND: 'error.session.not.found',
} as const;

export type BusinessError = typeof BusinessError[keyof typeof BusinessError];