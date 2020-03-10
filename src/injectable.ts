/**
 * 解释
 * 1. design:type 类属性的类型
 * 2. design:paramtypes 类属性方法的参数类型
 * 3. design:returntype 类属性方法的返回类型
 */

import "reflect-metadata";

export const classPool: Array<Function> = [];

/**
 * @param _constructor 依赖类
 * 将需要注入的依赖类先收集起来，即注入依赖
 */
export function injectable(_constructor: Function) {
  // 通过反射机制，获取参数类型列表
  let paramsTypes: Array<Function> = Reflect.getMetadata(
    "design:paramtypes",
    _constructor
  );
  if (classPool.indexOf(_constructor) !== -1) {
    return;
  } else if (paramsTypes?.length) {
    paramsTypes.forEach((v, i) => {
      if (v === _constructor) {
        // 该类不能依赖自身
        throw new Error("不可以依赖自身");
      } else if (classPool.indexOf(v) === -1) {
        // 该依赖类没有注册，不能初始化
        throw new Error(`依赖${i}[${v.name}]不可被注入`);
      }
    });
  }
  classPool.push(_constructor);
}

/**
 * @param _constructor 创建的依赖类
 */
export function init<T>(_constructor: { new (...args: Array<any>): T }): T {
  let paramsTypes: Array<Function> = Reflect.getMetadata(
    "design:paramtypes",
    _constructor
  );
  const params = (paramsTypes||[]).map((v, i) => {
    if (classPool.indexOf(v) === -1) {
      throw new Error(`依赖${i}[${v.name}]不可被注入`);
    } else if (v.length) {
      // 构造函数存在参数
      return init(v as  any);
    } else {
      return new (v as any)();
    }
  });
  return new _constructor(params);
}
