export default interface Transaction {
  id: string
  timestamp: string
  description: string
  amount: number
  operationType: 'DEBIT' | 'CREDIT'
  bankId: string
  acctId: string
  currency: string
}
