// получае данные с localStorage
export function getItems() {
    let arr = localStorage.getItem('likes')
    return JSON.parse(arr)
  }
  // обновляем данные в localStorage
  export const setItem = (value) => localStorage.setItem('likes', value)