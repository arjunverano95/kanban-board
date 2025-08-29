import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const calculateTicketAge = (createdAt: Date): string => {
  return dayjs(createdAt).fromNow();
};

export const formatDate = (date: Date): string => {
  return dayjs(date).format('MMM D, YYYY');
};

export const formatDateTime = (date: Date): string => {
  return dayjs(date).format('MMM D, YYYY h:mm A');
};
