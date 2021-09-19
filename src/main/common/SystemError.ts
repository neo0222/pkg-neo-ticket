export const SystemError = {
  DYNAMO_ACCESS_FAILED: 'error.dynamo.access.failed',
  OPTIMISTIC_LOCK_FAILED: 'error.optimistic.lock.failed',
  EVENT_BRIDGE_ACCESS_FAILED: 'error.event.bridge.access.failed',
  S3_ACCESS_FAILED: 'error.s3.access.failed',
  COGNITO_ACCESS_FAILED: 'error.cognito.access.failed',
  SSM_ACCESS_FAILED: 'error.ssm.access.failed',
  NOTIFICATION_FROM_ADDRESS_NOT_FOUND: 'error.notification.from.address.not.found',
  POSTAL_CODE_NOT_FOUND: 'error.postal.code.not.found',
  POSTAL_CODE_ACCESS_FAILED: 'error.postal.code.access.failed',
  TRANSIT_TIME_INVOKER_FAILED: 'error.transit.time.invoker.failed',
  UNACCEPTABLE_NULL_PROPERTY_FOUND: 'error.unacceptable.null.property.found',
  REQUEST_TIME_NOT_GIVEN: 'error.request.time.not.given',
  USER_ID_NOT_GIVEN: 'error.user.ids.not.given',
  USER_TYPE_NOT_GIVEN: 'error.user.type.not.given',
  SOURCE_IP_NOT_GIVEN: 'error.source.ip.not.given',
} as const;

export type SystemError = typeof SystemError[keyof typeof SystemError];