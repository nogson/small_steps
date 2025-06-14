import styles from "./styles.module.scss";
import { getDatesInMonth } from "../../utils/calender.ts";
import CalenderCell from "../CalenderCell";
import { useEffect, useState } from "react";
import { DailyActivity } from "../../types/DatabaseTypes";
import { toJSTISOString } from "../../utils/calender";

type Props = {
  data: { data: any; date: Date };
};

const CalenderItem: React.FC<Props> = ({ data }) => {
  const [dataForDate, setDataForDate] = useState<
    { date: Date; data: DailyActivity[] }[]
  >([]);

  const getDataForDate = (dates: Date[]) => {
    return dates.map((date) => {
      const key = toJSTISOString(date).split("T")[0];
      const dataForKey = data.data.filter((d: DailyActivity) => d.date === key);
      return {
        date: date,
        data: dataForKey,
      };
    });
  };

  useEffect(() => {
    const year = Number(data.date.getFullYear());
    const month = Number(data.date.getMonth());
    const dates = getDatesInMonth(year, month);
    setDataForDate(getDataForDate(dates));
  }, [data]);

  return (
    <>
      <div className={styles.calender}>
        <div className="calenderBody">
          <ul className="week">
            <li>Sun</li>
            <li>Mon</li>
            <li>Tue</li>
            <li>Wed</li>
            <li>Thu</li>
            <li>Fri</li>
            <li>Sat</li>
          </ul>
          <div className="days">
            {dataForDate.map((d) => (
              <CalenderCell
                key={d.date.toISOString()}
                month={Number(data.date.getMonth())}
                data={d}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CalenderItem;
