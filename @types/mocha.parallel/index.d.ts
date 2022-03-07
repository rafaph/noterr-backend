declare module "mocha.parallel" {
  import SuiteFunction = Mocha.SuiteFunction;
  export default parallel;

  interface ParallelFunction extends SuiteFunction {
    disable(): void;
    enable(): void;
    limit(n: number): void;
  }

  let parallel: ParallelFunction;
}
