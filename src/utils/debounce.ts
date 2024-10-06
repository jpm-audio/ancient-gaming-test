export default function debounce(func: (...args: []) => void, wait: number) {
  let timeout: number | undefined;
  return (...args: []) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      func(...args);
    }, wait);
  };
}
