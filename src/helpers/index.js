import styled from "styled-components";
import React from "react";

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
export function sortByCompleted(tasks) {
  let sortedTasks = tasks.sort(function(a, b) {
    a = a.completed;
    b = b.completed;
    return a === b ? 0 : a ? 1 : -1;
  });
  return sortedTasks;
}
export function sortById(tasks) {
  let sortedTasks = tasks.sort(function(a, b) {
    a = a.id;
    b = b.id;
    return a - b;
  });
  return sortedTasks;
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
      time:
        Math.floor((unixtime - currentTime) / 60 / 60) +
        8 /*8 Uhr als "durchschnittliche Uhrzeit" */,
      unit: "h"
    };
  }
  return timeDifference;
}
export const HoverSegment = styled.div`
  color: #000;
  :hover {
    cursor: pointer;
    box-shadow: 0 2px 4px 0 rgba(34, 36, 38, 0.12),
      0 2px 10px 0 rgba(34, 36, 38, 0.15);
  }
`;
//Arrays generieren, welche zweidimensionale Arrays mit 'false' füllen
export function generateFalseArray(length, width) {
  let a = [];
  if (width !== 1) {
    for (let i = 0; i < length; i++) {
      a.push([]);
      for (let j = 0; j < width; j++) {
        a[i].push(false);
      }
    }
  } else {
    for (let i = 0; i < length; i++) {
      a.push(false);
    }
  }
  return a;
}
export function noSubjects() {
  return (
    <>
      (⊙＿⊙')
      <br />
      Scheint so, als hätten sie in ihrem Stundenplan noch keine Fächer... Fügen
      sie diese hinzu!
    </>
  );
}
