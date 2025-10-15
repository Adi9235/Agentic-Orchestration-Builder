import { format, formatDistanceToNow } from "date-fns";

export const formatDateTime = (date: string | Date) => {
  try {
    return format(new Date(date), "PPpp");
  } catch {
    return "-";
  }
};

export const timeAgo = (date: string | Date) => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return "";
  }
};

export const truncate = (text: string, max = 60) =>
  text.length > max ? `${text.slice(0, max)}...` : text;
