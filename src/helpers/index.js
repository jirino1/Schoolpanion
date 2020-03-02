export function formatDate(date) {
  const splittedDate = date.split("-");
  splittedDate.map(d => {
    return Number.parseInt(d);
  });
  const formattedDate = new Date(
    Date.UTC(splittedDate[0], splittedDate[1] - 1, splittedDate[2])
  ).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return formattedDate;
}
export function sortByDates(tasks) {
  let sortedTasks = tasks.sort(function(a, b) {
    a = a.date.split("-").join("");
    b = b.date.split("-").join("");
    return a.localeCompare(b);
  });
  return sortedTasks;
}
export function getRemainingDays(date) {
  date = date.split("-");
  let unixtime = parseInt(
    new Date(date[0], date[1] - 1, date[2]).getTime() / 1000
  );
  let currentTime = Date.now() / 1000;
  let timeDifference = {
    time: Math.floor((unixtime - currentTime) / 60 / 60 / 24),
    unit: "d"
  };
  if (timeDifference.time === 0) {
    timeDifference = {
      time: Math.floor((unixtime - currentTime) / 60 / 60),
      unit: "h"
    };
  }
  return timeDifference;
}
