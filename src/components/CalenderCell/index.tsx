import styles from "./styles.module.scss";
import { CellEventContext } from "../../pages/Calender";
import { useContext } from "react";
import { DailyActivity } from "../../types/DatabaseTypes";
import { ACTIVITY_TYPES } from "../../constants/activityTypes";

type Props = {
  data: { date: Date; data: DailyActivity[] | [] };
  month: number;
};

const CalenderCell: React.FC<Props> = ({ data, month }) => {
  const cellEvent = useContext(CellEventContext);
  const setClassName = (date: Date, month: number) => {
    const isCurrentMonth = date.getMonth() === month;
    return isCurrentMonth ? "active" : "inactive";
  };

  const getStyle = (activityType: string) => {
    const type = ACTIVITY_TYPES.find(
      (activity) => activity.type === activityType
    );

    return {
      background: type ? type.color : "#00e62a", // デフォルト色を設定
      opacity: 0.2,
    };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    const todayStr = [
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    ].join("-");
    const dateStr = [date.getFullYear(), date.getMonth(), date.getDate()].join(
      "-"
    );

    console.log("Today:", todayStr, dateStr);

    return todayStr === dateStr;
  };

  isToday(data.date);

  return (
    <>
      <div
        className={`${styles.calenderCell} ${styles[setClassName(data.date, month)]}`}
        onClick={() => cellEvent(data.date)}
      >
        <span className={styles.date}>
          <span className={isToday(data.date) ? styles.isToday : ""}>
            {data.date.getDate()}
          </span>
        </span>
        {data.data.map((d) => (
          <span
            className={styles.stacked}
            key={d.id}
            style={getStyle(d.activity_type!)} // 関数を呼び出して戻り値を渡す
          ></span>
        ))}
      </div>
    </>
  );
};

export default CalenderCell;
