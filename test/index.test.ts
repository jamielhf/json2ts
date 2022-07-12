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

// 多个同名对象嵌套，加上父级的name
const moreObject = `{
  data: {
    status: 200,
    data:{
      name:1,
      data:{
        name:'123'
      }
    }
  }
}`;
describe("moreObject json", () => {
  let res = `"export namespace namespace {
  export interface DataDataData {
    name: string;
  }
  export interface DataData {
    name: number;
    data: DataDataData;
  }
  export interface Data {
    status: number;
    data: DataData;
  }
  export interface RootObject {
    data: Data;
  }
}"`;
  it("expect", () => {
    expect(jsonToTs(moreObject)).toMatchInlineSnapshot(res);
  });
});

// 多数组深套
const moreArray = `{
  data: [
    [
    [ {data:'1111'}]
    ]
  ]
}`;
// console.log(jsonToTs(moreArray));
describe("moreArray json", () => {
  let res = `"export namespace namespace {
  export interface Data {
    data: string;
  }
  export interface RootObject {
    data: Data[][][];
  }
}"`;
  it("expect", () => {
    expect(jsonToTs(moreArray)).toMatchInlineSnapshot(res);
  });
});

const json = `{
  Button: {
    description: "按钮组件",
    props: [
      {
        name: "htmlType",
        type: '"button" | "submit" | "reset"',
        default: "",
        description: "Button 类型",
        required: false,
      },
    ],
  },
}`;
console.log(jsonToTs(json));
