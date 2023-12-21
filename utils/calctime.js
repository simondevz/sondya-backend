export const RoundUpTime = (time1 = 0) => {
  let months = 0;
  let weeks = 0;
  let days = 0;
  let hours = 0;

  for (let time = time1; time >= 0; ) {
    if (time >= 720) {
      time = time - 720;
      months++;
    } else if (time >= 168) {
      time = time - 168;
      weeks++;
    } else if (time >= 24) {
      time = time - 24;
      days++;
    } else {
      time = time - 1;
      hours++;
    }
  }

  if (months > 0) {
    if (weeks > 0) {
      if (days > 0) {
        if (hours > 0) {
          return `${months} months, ${weeks + 1} weeks`; ////, ${days + 1} days `; ${hours} hours`;
        }
        return `${months} months, ${weeks + 1} weeks`; //// ${days} days`;
      }
      return `${months} months, ${weeks} weeks`;
    }
    if (days > 0) {
      if (hours > 0) {
        return `${months} months`; ////, ${days + 1} days`; ////${hours} hours`;
      }
      return `${months} months`; ////, ${days} days`;
    }
    if (hours > 0) {
      return `${months} months,`; //// ${hours} hours`;
    }
    return `${months} months`;
  } else if (weeks > 0) {
    if (days > 0) {
      if (hours > 0) {
        return `${weeks} weeks, ${days + 1} days,`; /////${hours} hours`;
      }
      return `${weeks} weeks, ${days} days`;
    }
    if (hours > 0) {
      return `${weeks} weeks`; ////, ${hours} hours`;
    }
    return `${weeks} weeks`;
  } else if (days > 0) {
    if (hours > 0) {
      return `${days + 1} days`; ////, ${hours} hours`;
    }
    return `${days} days`;
  } else if (hours > 0) {
    return `${1} day`; ////, ${hours} hours`;
  }

  return 0;
};

export const EstimatedDeliveryDate = (time1 = 0, AddedDays) => {
  // Get the current date
  const now = new Date();

  // Add hours to the current time in milliseconds
  const dateTime1 = new Date(now.getTime() + time1 * 60 * 60 * 1000);

  // Add 5 days to the dateTime1
  const dateTime2 = new Date(
    dateTime1.getTime() + AddedDays * 24 * 60 * 60 * 1000
  );

  const formattedDateTime1 = formatDate(dateTime1);
  const formattedDateTime2 = formatDate(dateTime2);

  const formattedDate = `${formattedDateTime1} to ${formattedDateTime2}`;

  return formattedDate;
};

const formatDate = (dateTime) => {
  const dateObject = new Date(dateTime);

  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = dateObject.toLocaleDateString("en-US", options);

  return formattedDate;
};
