export const MatineeOrSoiree = {
  MATINEE: '1',
  SOIREE: '2',
} as const;

export type MatineeOrSoiree = typeof MatineeOrSoiree[keyof typeof MatineeOrSoiree];