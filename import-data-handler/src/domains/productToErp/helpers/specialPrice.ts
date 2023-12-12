import moment from "moment"

export const specialPrice = (special: number, price: number) => {
    const specials: any[] = []
  
    if (Number(special) > 0 && Number(special) < Number(price)) {
      specials.push({
        price: Number(special),
        date_start: moment().subtract(1, 'day').startOf('day').toDate(),
        date_end: moment().add(29, 'days').endOf('day').toDate()
      })
    }
  
    return specials
  }