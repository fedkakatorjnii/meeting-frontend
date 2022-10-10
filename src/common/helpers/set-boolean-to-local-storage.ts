export const setBooleanToLocalStorage = (name: string, value: boolean) => {
  localStorage.setItem(name, `${value}`);
};
