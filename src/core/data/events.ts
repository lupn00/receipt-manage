import moment from "moment";
import type { EventInput } from "@fullcalendar/core";

const todayDate = moment().startOf("day");
const YM = todayDate.format("YYYY-MM");
const YESTERDAY = todayDate.clone().subtract(1, "day").format("YYYY-MM-DD");
const TODAY = todayDate.format("YYYY-MM-DD");
const TOMORROW = todayDate.clone().add(1, "day").format("YYYY-MM-DD");

const events: Array<EventInput> = [
];

export default events;

export { todayDate, YM, YESTERDAY, TODAY, TOMORROW };
