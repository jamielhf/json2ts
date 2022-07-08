import { expect, it, test, describe } from "vitest";
import jsonToTs from "../src/index";
const data = `{}`;

describe("empty json", () => {
  it("expect", () => {
    expect(jsonToTs(data)).toMatchInlineSnapshot(
      `"export namespace namespace {\n  export interface RootObject {}\n}"`
    );
  });
});

const inputArray = `{
  arr: [
    {
      a: 'name', // 测试
      b: 'age'
    },
    {
      a: 'name',
    }
  ]
}`;

describe("array json", () => {
  let res = `"export namespace namespace {
  export interface Arr {
    /**  测试 */
    a: string;
    b?: string;
  }
  export interface RootObject {
    arr: Arr[];
  }
}"`;
  it("expect", () => {
    expect(jsonToTs(inputArray)).toMatchInlineSnapshot(res);
  });
});

const inputObject = `{
  object: {
    a:111,
    b:'test'
  }
}`;

describe("object json", () => {
  let res = `"export namespace namespace {
  export interface Object {
    a: number;
    b: string;
  }
  export interface RootObject {
    object: Object;
  }
}"`;
  it("expect", () => {
    expect(jsonToTs(inputObject)).toMatchInlineSnapshot(res);
  });
});

const empty = `{
  name: '1', 
  arr: []
}`;

describe("empty json", () => {
  let res = `"export namespace namespace {
  export interface RootObject {
    name: string;
    arr: unknown[];
  }
}"`;
  it("expect", () => {
    expect(jsonToTs(empty)).toMatchInlineSnapshot(res);
  });
});

const moreArray = `{
  arr: [['test']]
}`;
console.log(jsonToTs(moreArray));
describe("moreArray json", () => {
  let res = `"export namespace namespace {
  export interface RootObject {
    name: string;
    arr: unknown[];
  }
}"`;
  it("expect", () => {
    expect(jsonToTs(moreArray)).toMatchInlineSnapshot(res);
  });
});
