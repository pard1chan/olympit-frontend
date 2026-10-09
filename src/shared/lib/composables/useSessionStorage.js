export function useSessionStorage() {
  const getItem = (key) => sessionStorage.getItem(key)


  return {
    getItem
  }
}