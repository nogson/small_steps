import React from "react";
import sytles from "./styles.module.scss";

const ACTIVITY_TYPES = [
  { type: "health", color: "#00e62a" },
  { type: "study", color: "#00c7e6" },
  { type: "other", color: "#e69d00" },
];

type ActivityType = {
  type: string;
  color: string;
};

type ActivityTypeProps = {
  slectedActivity: ActivityType;
  setSelectedActivity: (activity: ActivityType) => void;
};

const ActivityType: React.FC<ActivityTypeProps> = ({
  slectedActivity,
  setSelectedActivity,
}) => {
  const handleActivityChange = (activity: ActivityType) => {
    setSelectedActivity(activity);
  };

  return (
    <>
      <ul className={sytles.activityType}>
        {ACTIVITY_TYPES.map((activity) => (
          <li
            key={activity.type}
            className={`${
              slectedActivity.type === activity.type ? sytles.active : ""
            }`}
            onClick={() => handleActivityChange(activity)}
          >
            <span
              style={{
                backgroundColor: activity.color,
              }}
            ></span>
            {activity.type}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ActivityType;
