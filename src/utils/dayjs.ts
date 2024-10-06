import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/ru";
import WeekDay from "dayjs/plugin/weekday";
import LocaleData from "dayjs/plugin/localeData";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

const dayjsExtend = dayjs;

dayjs.extend(WeekDay);
dayjs.extend(LocaleData);
dayjs.extend(LocalizedFormat);
dayjs.extend(relativeTime);

export { dayjsExtend };
