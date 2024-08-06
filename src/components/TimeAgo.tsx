export function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000); // Years
  if (interval >= 1) {
    return interval + "y";
  }

  interval = Math.floor(seconds / 2592000); // Months
  if (interval > 1) {
    return interval + "m";
  }

  interval = Math.floor(seconds / 604800); // Weeks
  if (interval > 1) {
    return interval + "w";
  }

  interval = Math.floor(seconds / 86400); // Days
  if (interval > 1) {
    return interval + "d";
  }

  interval = Math.floor(seconds / 3600); // Hours
  if (interval > 1) {
    return interval + "h";
  }

  interval = Math.floor(seconds / 60); // Minutes
  if (interval > 1) {
    return interval + "m";
  }

  return Math.floor(seconds) + "s";
}
