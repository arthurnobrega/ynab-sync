import nubankToken from './data/nubankToken.json'
import nubankBill from './data/nubankBill.json'

export default function createNuBank() {
  return {
    setLoginToken: token => token,
    getLoginToken: () => nubankToken,
    getBillByMonth: () => nubankBill,
  }
}
