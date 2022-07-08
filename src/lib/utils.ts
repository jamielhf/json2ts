import * as t from '@babel/types';

/**
 * 转换类型
 * @param type
 * @returns
 */
export function baseTypeToTs(type): t.TSType {
  let tsType;
  switch (type) {
    case 'StringLiteral':
      tsType = t.tsStringKeyword();
      break;
    case 'NullLiteral':
      tsType = t.tsNullKeyword();
      break;
    case 'BooleanLiteral':
      tsType = t.tsBooleanKeyword();
      break;
    case 'NumericLiteral':
      tsType = t.tsNumberKeyword();
      break;
    default:
      tsType = t.tsStringKeyword();
      break;
  }
  return tsType;
}

/**
 * 首字母大写
 * @param s
 * @returns
 */
export function toUpperCase(s: string) {
  return s.replace(/([a-z])/, (p1) => p1.toUpperCase());
}
