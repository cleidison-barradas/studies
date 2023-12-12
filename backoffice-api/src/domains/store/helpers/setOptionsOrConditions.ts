import moment from 'moment'

interface StoreMock {
  storeName: string,
  createdAt: Date
}

const setOptionsOrConditions = (stores: StoreMock[], startDate: Date, endDate: Date): StoreMock[] => {
  return stores.filter((store) => moment(store.createdAt).isBetween(moment(startDate).startOf('D'), moment(endDate).endOf('D')))
}

export default setOptionsOrConditions
