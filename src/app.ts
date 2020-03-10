import "reflect-metadata";
import { injectable, init, classPool } from "./injectable";

@injectable
class B {
  key: string = "B class";
}

@injectable
class A {
  constructor(public b: B) {
    this.b = b;
  }
}

const a = init(A);