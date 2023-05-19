import { format, parse } from "date-fns";

export const getFormatDate = (date) => {
  return format(new Date(date), "h:mm:ss a");
};

export const getFormatTime = (time) => {
  return format(
    parse(time.split(":", 2).join(":"), "HH:mm", new Date()),
    "h:mm a"
  );
};

export const getFormatDateAndTime = (date) => {
  return format(new Date(date), "dd/MM/yyyy h:mm:ss a");
};
