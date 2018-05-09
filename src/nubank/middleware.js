import createNuBank from 'nubank'

const NuBank = createNuBank()

export async function setLoginToken(token) {
  return NuBank.setLoginToken(token)
}

export async function requestNewToken(login, password) {
  const token = await NuBank.getLoginToken({ login, password })

  if (token.error) {
    throw Error(token.error)
  }

  return token
}

export async function getBillByMonth(filter) {
  const bill = await NuBank.getBillByMonth(filter)

  return bill
}
