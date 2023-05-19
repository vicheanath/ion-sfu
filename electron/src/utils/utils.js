export const formatMoney = (num) => {
  if (num === null || num === undefined) return "0.00";
  var p = parseFloat(num).toFixed(2).split(".");
  return (
    p[0]
      .split("")
      .reverse()
      .reduce((acc, num, i, orig) => {
        return num + (num != "-" && i && !(i % 3) ? "," : "") + acc;
      }, "") +
    "." +
    p[1]
  );
};

export const Currency = [
  {
    name: "US - Dollar",
    code: "USD",
    symbol: "$",
  },
  {
    name: "Cambodia - Riel",
    code: "KHR",
    symbol: "៛",
  },
];

export const Transaction = [
  {
    type: "DEPOSIT",
  },
  {
    type: "WITHDRAW",
  },
  {
    type: "PROMOTION",
  },
];

export const groupBy = (array, key) => {
  // Return the end result
  return array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
  }, {}); // empty object is the initial value for result object
};

export const safeAmount = (amount) => {
  // convert ammount to K, M, B
  if (amount >= 1000000000) {
    return amount / 1000000000 + "B";
  }
  if (amount >= 1000000) {
    return amount / 1000000 + "M";
  }
  if (amount >= 1000) {
    return amount / 1000 + "K";
  }
  return amount;
};

export const color = [
  "teal",
  "orange",
  "yellow",
  "green",
  "red",
  "blue",
  "cyan",
  "purple",
  "pink",
];
export const numPad = [
  1, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000,
];
export const color2 = color.concat(color);

export const checkPermission = (p) => {
  if (JSON.parse(localStorage.getItem("userdata"))) {
    const { permissions } = JSON.parse(localStorage.getItem("userdata"));
    return permissions?.includes(p);
  }
};
