/**
 * 移除对象中 undefined 或 null 值的属性
 * @param obj
 */
export function omitUndefinedAndNull(obj: any) {
  if (typeof obj === 'object' && obj !== null) {
    const newObj: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (value === undefined || value === null) {
        continue;
      }
      newObj[key] = value;
    }
    return newObj;
  }

  return obj;
}
