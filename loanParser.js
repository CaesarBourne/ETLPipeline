function normalize(text) {
  return text
    .replace(/\r/g, "")
    .replace(/\n+/g, "\n")
    .trim();
}

function extractLoan(text) {
  const patterns = [
    /Get\s+(GHS)\s?(\d+(?:\.\d+)?)\s+by\s+(.+)/i,
    /Loan[:\s]*(GHS)\s?(\d+(?:\.\d+)?)\s+by\s+(.+)/i,
    /(GHS)\s?(\d+(?:\.\d+)?)\s+loan\s+from\s+(.+)/i,
  ];

  for (const regex of patterns) {
    const match = text.match(regex);
    if (match) {
      return {
        currency: "GHS",
        loanAmount: Number(match[2]),
        lender: match[3].trim(),
      };
    }
  }

  return {};
}

function extractSetupFee(text) {
  const match = text.match(/Setup\s*fee\s*(GHS)?\s?(\d+(?:\.\d+)?)/i);
  return match ? Number(match[2]) : null;
}

function extractPay(text) {
  const patterns = [
    /Pay\s+(GHS)\s?(\d+(?:\.\d+)?)\s+in\s+(\d+)d/i,
    /Repay\s+(GHS)\s?(\d+(?:\.\d+)?)\s+after\s+(\d+)\s*days?/i,
  ];

  for (const regex of patterns) {
    const match = text.match(regex);
    if (match) {
      return {
        totalPayable: Number(match[2]),
        durationDays: Number(match[3]),
      };
    }
  }

  return {};
}

function extractLateFee(text) {
  const match = text.match(/Late\s*Fee.*?(\d+(?:\.\d+)?)\s*%/i);
  return match ? Number(match[1]) : null;
}

function parseLoanOffer(rawText) {
  const text = normalize(rawText);

  const loan = extractLoan(text);
  const pay = extractPay(text);

  return {
    ...loan,
    setupFee: extractSetupFee(text),
    ...pay,
    lateFeePercent: extractLateFee(text),
  };
}

const text = `
Get GHS50 by Forms Capital 
Setup fee GHS3.25
Pay GHS53.25 in 7d
Late Fee 10%
TC bit.ly/gh-xc
`;

console.log(parseLoanOffer(text));

module.exports = parseLoanOffer;