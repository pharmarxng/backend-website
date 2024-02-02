import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

// Extend dayjs with utc and timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (dateString: string, format?: string) => {
  const dateFormat = format ? format : 'DD/MM/YYYY HH:mm';
  const formattedDate = dayjs(dateString)
    .utc() // Convert to UTC time
    .tz('Africa/Lagos') // Set the timezone to WAT (West Africa Time)
    .format(dateFormat);

  return formattedDate;
};
