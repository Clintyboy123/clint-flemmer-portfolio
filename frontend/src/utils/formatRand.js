// R 2 500: a no-break space after the R, a narrow no-break space between thousands (as the original price list).
export default function formatRand(amount) {
  return 'R ' + Math.round(amount).toLocaleString('en-US').replace(/,/g, ' ');
}
