const committeeLimits = {
  PTA: 150,
  QAA: 100,
  LAC: 100,
  CF: 100,
  RHC: 100,
};

function distributeAmount(amount) {
  const result = {};
  const committees = Object.keys(committeeLimits);
  let remaining = amount;
  let count = committees.length;

  committees.forEach((n) => (result[n] = 0));

  let guard = 0; // safety stop

  while (remaining > 0 && count > 0) {
    const share = remaining / count;

    committees.forEach((name) => {
      if (remaining <= 0) return;
      const limit = committeeLimits[name];
      const available = limit - result[name];
      if (available <= 0) return;

      const give = Math.min(share, available);
      result[name] += give;
      remaining -= give;
    });

    remaining = Number(remaining.toFixed(2)); // avoid infinite decimals
    count = committees.filter((n) => result[n] < committeeLimits[n]).length;

    guard++;
    if (guard > 1000) break; // hard stop to prevent infinite loop
  }

  return result;
}

export default distributeAmount;
