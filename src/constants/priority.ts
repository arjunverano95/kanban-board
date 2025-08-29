export enum PRIORITY {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export type Priority = PRIORITY | undefined;

export const PRIORITY_CONFIG = {
  [PRIORITY.LOW]: {
    label: 'Low',
    icon: '🌱',
    color: 'bg-green-100 text-green-800 border-green-200',
    textColor: 'text-green-800',
  },
  [PRIORITY.MEDIUM]: {
    label: 'Medium',
    icon: '⚡',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    textColor: 'text-yellow-800',
  },
  [PRIORITY.HIGH]: {
    label: 'High',
    icon: '🔥',
    color: 'bg-red-100 text-red-800 border-red-200',
    textColor: 'text-red-800',
  },
  NONE: {
    label: 'None',
    icon: '📋',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    textColor: 'text-gray-800',
  },
} as const;

export const getPriorityConfig = (priority?: Priority) => {
  if (!priority) return PRIORITY_CONFIG.NONE;
  return PRIORITY_CONFIG[priority];
};

export const getPriorityIcon = (priority?: Priority) => {
  return getPriorityConfig(priority).icon;
};

export const getPriorityLabel = (priority?: Priority) => {
  return getPriorityConfig(priority).label;
};

export const getPriorityColor = (priority?: Priority) => {
  return getPriorityConfig(priority).color;
};

export const getPriorityTextColor = (priority?: Priority) => {
  return getPriorityConfig(priority).textColor;
};
