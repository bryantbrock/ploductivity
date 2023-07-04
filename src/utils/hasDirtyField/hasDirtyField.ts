export const hasDirtyField = (obj: any): boolean => {
  const checkObj = (o: any): boolean => {
    if (o === null || typeof o !== "object") {
      return o === true;
    }

    for (const key in o) {
      if (o.hasOwnProperty(key)) {
        if (typeof o[key] === "object") {
          if (checkObj(o[key])) {
            return true;
          }
        } else if (o[key] === true) {
          return true;
        }
      }
    }
    return false;
  };

  return checkObj(obj);
};
