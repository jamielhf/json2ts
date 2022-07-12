# @jamielhf/jsontots

![NPM version](https://img.shields.io/npm/v/@jamielhf/jsontots)
![NPM download](https://img.shields.io/npm/dt/@jamielhf/jsontots)

一个 `json` 字符串转 `ts` 的工具，支持注释的转换

## 安装

```
npm install @jamielhf/jsontots --save
// or
yarn add @jamielhf/jsontots
```

## 怎么使用

```ts
import jsontots from "@jamielhf/jsontots";

const json = `{
  button: {
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
const ts = json2ts(json);

// ts
export namespace namespace {
  export interface Props {
    name: string;
    type: string;
    default: string;
    description: string;
    required: boolean;
  }
  export interface Button {
    description: string;
    props: Props[];
  }
  export interface RootObject {
    Button: Button;
  }
}
```

### options

#### namespace

`string` 自定义 namespace

```ts
const ts = json2ts(json, {
  namespace: "test",
});
```

## 其他

工具 https://astexplorer.net/
