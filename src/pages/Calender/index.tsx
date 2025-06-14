import CalenderItem from "../../components/CalenderItem";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import styles from "./styles.module.scss";
import { createContext, useEffect, useState } from "react";
import { getDateInNextMonth } from "../../utils/calender";
import Result from "../../components/Result";
import {
  fetchDailyActivities,
  addDailyActivity,
} from "../../api/dailyActivities";
import { useUser } from "../../context/UserContext";
import { DailyActivity } from "../../types/DatabaseTypes";
import { toJSTISOString } from "../../utils/calender";
import ActivityType from "../../components/ActivityType";
import { ACTIVITY_TYPES } from "../../constants/activityTypes";

export const CellEventContext = createContext<(data: Date) => void>(() => {});

const maxIndex = 11;

const formatDateToYYYYMM = (date: Date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${year}${month}`;
};

const getHeaderTitle = (
  DisplayData: { date: Date }[],
  currentIndex: number
) => {
  const displayDate = DisplayData[currentIndex];
  if (!displayDate) return "";
  return displayDate.date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const Calender = () => {
  const { user } = useUser();
  const [currentDate] = useState(new Date());
  const [currentIndex, setCurrentIndex] = useState(maxIndex);
  const [headerTitle, setHeaderTitle] = useState("");
  const [DisplayData, setDisplayData] = useState<{ data: any; date: Date }[]>(
    []
  );
  const [dailyActivities, setDailyActivities] = useState<{
    [key: string]: DailyActivity[];
  }>();
  const [slectedActivity, setSelectedActivity] = useState<{
    type: string;
    color: string;
  }>(ACTIVITY_TYPES[0] as { type: string; color: string });

  const getDailyActivitiesForMonth = (date: Date) => {
    const YYYYMM = formatDateToYYYYMM(date);
    return dailyActivities?.[YYYYMM] || [];
  };

  const getCalenderItem = (date: Date) => {
    return Array.from({ length: maxIndex + 1 }, (_, i) => {
      const offset = i - maxIndex;
      const targetDate = getDateInNextMonth(date, offset);
      return {
        data: getDailyActivitiesForMonth(targetDate),
        date: targetDate,
      };
    });
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < maxIndex) setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const fetchAndSetDailyActivities = async () => {
    const data = await fetchDailyActivities(user!.id);
    const activities = data.reduce(
      (acc, item) => {
        const YYYYMM = item.date?.split("-").join("").slice(0, -2);
        if (YYYYMM) {
          acc[YYYYMM] = acc[YYYYMM] || [];
          acc[YYYYMM].push(item);
        }
        return acc;
      },
      {} as { [key: string]: DailyActivity[] }
    );

    setDailyActivities(activities);
  };

  const cellOnClick = async (data: Date) => {
    await addDailyActivity({
      userId: user!.id,
      date: toJSTISOString(data),
      activityType: slectedActivity.type,
    });
    await fetchAndSetDailyActivities();
  };

  useEffect(() => {
    fetchAndSetDailyActivities();
  }, []);

  useEffect(() => {
    setDisplayData(getCalenderItem(currentDate));
  }, [dailyActivities]);

  useEffect(() => {
    if (DisplayData.length > 0)
      setHeaderTitle(getHeaderTitle(DisplayData, currentIndex));
  }, [DisplayData, currentIndex]);

  return (
    <>
      <div className={styles.calenderContainer}>
        <div className={styles.result}>
          <Result displayData={DisplayData[currentIndex]} />
        </div>
        <div className={styles.calenderHeader}>
          <button onClick={handlePrev} disabled={currentIndex === 0}>
            <LuChevronLeft />
          </button>
          <div>{headerTitle}</div>
          <button onClick={handleNext} disabled={currentIndex === maxIndex}>
            <LuChevronRight />
          </button>
        </div>
        <div>
          <ActivityType
            slectedActivity={slectedActivity}
            setSelectedActivity={setSelectedActivity}
          />
        </div>
        <div className={styles.calender}>
          <div
            className={styles.sliderContent}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            <CellEventContext value={cellOnClick}>
              {DisplayData.map((item, index) => (
                <div key={index} className={styles.slide}>
                  <CalenderItem data={item} />
                </div>
              ))}
            </CellEventContext>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calender;
