export const convertRatingRangeToString = (range: number): string => {
  if (range === 0) {
    return "<1000"
  } else if (range === 1) {
    return "1000-1500"
  } else if (range === 2) {
    return "1500-2000"
  } else {
    return "2000+"
  }
}

export const roundNumber = (num: number): number => Math.round(num * 100) / 100
export const formatNumber = (num: number): string => new Intl.NumberFormat('en-GB', { maximumSignificantDigits: 3 }).format(num);
export function zip<A,B>(a: Array<A>, b: Array<B>): Array<[A,B]> {
  return a.map((k,i) => [k, b[i]]);
}
export const numOrZero = (num: number | null | undefined) => num ? num : 0;