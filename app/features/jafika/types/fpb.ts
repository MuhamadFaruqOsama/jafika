export type GameObject = {
  name: string;
  url: string;
};

export type DivisionResult = {
  numberIndex: number;
  before: number;
  after: number;
  finished: boolean;
};

export type DivisionStep = {
  step: number;
  divider: number;
  results: DivisionResult[];
};

export type FactorPower = {
  prime: number;
  exp: number;
};
