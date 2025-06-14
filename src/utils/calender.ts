export const getDatesInMonth = (year: number, month: number): Date[] => {
  const dates: Date[] = [];
  const firstDay = new Date(year, month, 1); // 月の初日
  const lastDay = new Date(year, month + 1, 0); // 月の最終日
  const firstDayOfWeek = firstDay.getDay(); // 月の初日の曜日
  for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
    dates.push(new Date(day)); // 日付を配列に追加
  }

  dates.unshift(
    ...Array.from({ length: firstDayOfWeek }, (_, i) => {
      const date = new Date(year, month, -(firstDayOfWeek - i - 1));
      return date;
    })
  ); // 月の初日までの空白を追加

  return dates;
};

export const getDateInNextMonth = (date: Date, month: number): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + month);

  return d;
};

  export const toJSTISOString = (date: Date): string => {
    const JST_OFFSET = 9 * 60 * 60 * 1000; // JST is UTC+9
    const jstDate = new Date(date.getTime() + JST_OFFSET);

    const year = jstDate.getFullYear();
    const month = (jstDate.getMonth() + 1).toString().padStart(2, "0");
    const day = jstDate.getDate().toString().padStart(2, "0");
    const hours = jstDate.getHours().toString().padStart(2, "0");
    const minutes = jstDate.getMinutes().toString().padStart(2, "0");
    const seconds = jstDate.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
  };
