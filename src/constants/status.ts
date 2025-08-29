export const COLUMN_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const;

export type ColumnStatus = (typeof COLUMN_STATUS)[keyof typeof COLUMN_STATUS];

export const COLUMN_CONFIG = [
  {
    id: COLUMN_STATUS.TODO,
    name: 'To Do',
    color: 'bg-blue-100 border-blue-300',
    textColor: 'text-blue-800',
  },
  {
    id: COLUMN_STATUS.IN_PROGRESS,
    name: 'In Progress',
    color: 'bg-yellow-100 border-yellow-300',
    textColor: 'text-yellow-800',
  },
  {
    id: COLUMN_STATUS.DONE,
    name: 'Done',
    color: 'bg-green-100 border-green-300',
    textColor: 'text-green-800',
  },
] as const;
