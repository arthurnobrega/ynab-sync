import nubankToken from './data/nubankToken.json'
import nubankBill from './data/nubankBill.json'
import nubankChecking from './data/nubankChecking.json'
import nubankBalance from './data/nubankBalance.json'

export default function createNuBank() {
  return {
    setLoginToken: token => token,
    getLoginToken: () => nubankToken,
    getBillByMonth: () => nubankBill,
    getCheckingTransactions: () => nubankChecking,
    getCheckingBalance: () => nubankBalance,
  }
}
