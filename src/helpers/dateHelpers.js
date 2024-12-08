export const formatTime = (isoDate) => {
  // Convert ISO string to a Date object
  const date = new Date(isoDate);

  // Extract hours and minutes in UTC
  const hours = date.getUTCHours(); // Use getHours() for local time
  const minutes = date.getUTCMinutes(); // Use getMinutes() for local time

  // Format time as hh:mm
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

export const convertToIsoString = (timeString) => {
  if (!timeString) {
    console.warn("convertToIsoString received a null or undefined value.");
    return ""; // Return an empty string or handle as appropriate
  }

  console.log("convertToIsoString", timeString.split(":"));
  const now = new Date();
  const [hours, minutes] = timeString.split(":");
  now.setHours(hours, minutes, 0, 0);

  const jakartaOffset = 7 * 60;
  const localDate = new Date(now.getTime() + jakartaOffset * 60000);
  return localDate.toISOString();
};
