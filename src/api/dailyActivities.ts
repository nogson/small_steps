import { supabase } from "./supabaseClient";

type DailyActivity = {
  userId: string;
  date: string;
  activityType: string;
};
// type DailyActivityResponse = DailyActivity[];
// type DailyActivityError = {
//   message: string;
//   code: string;
//   details: string;
// };
// type DailyActivityResult = {
//   data: DailyActivityResponse | null;
//   error: DailyActivityError | null;
// };

export const fetchDailyActivities = async (userId: string) => {
  // const startDate = new Date(
  //   date.getFullYear(),
  //   date.getMonth(),
  //   1
  // ).toISOString();
  // const endDate = new Date(
  //   date.getFullYear(),
  //   date.getMonth() + 1,
  //   1
  // ).toISOString();

  const { data, error } = await supabase
    .from("daily_activities")
    .select("*")
    .eq("user_id", userId)
    // .gte("date", startDate) // 開始日以上
    // .lt("date", endDate) // 終了日未満
    .order("date", { ascending: true });
  if (error) {
    console.error("Error fetching daily activities:", error);
    throw error;
  }

  return data;
};

export const addDailyActivity = async ({
  userId,
  date,
  activityType,
}: DailyActivity) => {
  const { data, error } = await supabase.from("daily_activities").insert([
    {
      user_id: userId,
      date: date,
      activity_type: activityType,
    },
  ]);

  if (error) {
    console.error("Error adding daily activity:", error);
    throw error;
  }

  return data;
};
