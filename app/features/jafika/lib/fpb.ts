import type { FactorPower } from "@/app/features/jafika/types/fpb";

export function isPrime(number: number): boolean {
  if (number <= 1) return false;
  if (number === 2) return true;
  if (number % 2 === 0) return false;

  for (let i = 3; i <= Math.sqrt(number); i += 2) {
    if (number % i === 0) return false;
  }

  return true;
}

export function getFactorPowers(factors: number[]): FactorPower[] {
  const frequency = new Map<number, number>();

  factors.forEach((factor) => {
    frequency.set(factor, (frequency.get(factor) ?? 0) + 1);
  });

  return Array.from(frequency.entries()).map(([prime, exp]) => ({ prime, exp }));
}

export function computeFPBFromFactors(factorsPerNumber: number[][]): {
  product: number;
  faktorList: FactorPower[];
} {
  if (factorsPerNumber.length === 0) {
    return { product: 1, faktorList: [] };
  }

  const frequencyMaps = factorsPerNumber.map((factors) => {
    const map = new Map<number, number>();
    factors.forEach((factor) => {
      map.set(factor, (map.get(factor) ?? 0) + 1);
    });
    return map;
  });

  const firstMap = frequencyMaps[0];
  let product = 1;
  const faktorList: FactorPower[] = [];

  firstMap.forEach((_, prime) => {
    const minExp = Math.min(
      ...frequencyMaps.map((freqMap) => freqMap.get(prime) ?? 0),
    );

    if (minExp > 0) {
      faktorList.push({ prime, exp: minExp });
      product *= prime ** minExp;
    }
  });

  return { product, faktorList };
}

export function computeKPKFromFactors(factorsPerNumber: number[][]): {
  product: number;
  faktorList: FactorPower[];
} {
  if (factorsPerNumber.length === 0) {
    return { product: 1, faktorList: [] };
  }

  const maxExponentByPrime = new Map<number, number>();

  factorsPerNumber.forEach((factors) => {
    const frequency = new Map<number, number>();
    factors.forEach((factor) => {
      frequency.set(factor, (frequency.get(factor) ?? 0) + 1);
    });

    frequency.forEach((exp, prime) => {
      const currentMax = maxExponentByPrime.get(prime) ?? 0;
      if (exp > currentMax) {
        maxExponentByPrime.set(prime, exp);
      }
    });
  });

  const faktorList: FactorPower[] = [];
  let product = 1;

  maxExponentByPrime.forEach((exp, prime) => {
    faktorList.push({ prime, exp });
    product *= prime ** exp;
  });

  return { product, faktorList };
}
