export const calculate = (formula: string, vars: Record<string, number>) => {
  const fn = new Function(...Object.keys(vars), `return ${formula}`);
  return fn(...Object.values(vars));
};
