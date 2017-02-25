module.exports.fixed = n => Number(n).toFixed(2);

module.exports.compare = (a,b) => {
  if (a < b) {
    return 1;
  } else if (a > b) {
    return -1;
  }

  return 0;
};
