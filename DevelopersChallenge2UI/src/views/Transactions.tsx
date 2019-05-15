import * as React from 'react'
import {
  Container,
  Table,
} from 'semantic-ui-react'
import { connect } from 'react-redux';

import { useCurrency } from '../util/useCurrency'
import { StoreState } from '../redux/store'
import Balance from '../redux/types/Balance';

import './style.css'

const mapStateToProps = (state: StoreState) => ({
  balances: state.balance.list,
  balancesById: state.balance.byId,
  transactions: state.transaction.list,
  transactionsById: state.transaction.byId,
})

interface Props {}

type ConnectedProps = ReturnType<typeof mapStateToProps>

const Component: React.FunctionComponent<Props> = (props: Props & ConnectedProps) => {
  const [currencyFormatter] = useCurrency({ currency: 'BRL', format: '%s %v' })

  const formatDate = React.useCallback((unixTimestamp: number) => {
    const date = new Date(unixTimestamp * 1000)

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${day}/${month}/${date.getFullYear()} - ${hours}:${minutes}:${seconds}`
  }, [])

  const latestBalance = React.useMemo<Balance | null>(() => {
    if (props.balances.length > 0) {
      return props.balances.map(id => props.balancesById[id]).sort((a, b) => a.timestamp - b.timestamp)[0]
    }

    return null
  }, [props.balances])

  const tableData = React.useMemo(() => {
    const data = props.transactions.map(id => ({
      id: id,
      date: formatDate(props.transactionsById[id].timestamp),
      description: props.transactionsById[id].description,
      amount: props.transactionsById[id].amount,
      balance: null as number | null,
    }))

    if (latestBalance !== null && data.length > 0) {
      for (let i = data.length - 1; i >= 0; i--) {
        data[i].balance = i === data.length - 1 ? latestBalance.amount : (data[i + 1].balance as number) - data[i + 1].amount
      }
    }

    return data
  }, [latestBalance, props.transactions])

  return (
    <Container>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Data</Table.HeaderCell>
            <Table.HeaderCell>Descrição</Table.HeaderCell>
            <Table.HeaderCell>Quantia</Table.HeaderCell>
            <Table.HeaderCell>Saldo</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tableData.map(data => (
            <Table.Row key={data.id}>
              <Table.Cell>{data.date}</Table.Cell>
              <Table.Cell>{data.description}</Table.Cell>
              <Table.Cell>
                <span
                  className={
                    data.amount > 0
                      ? 'transaction__Amount__Positive'
                      : 'transaction__Amount__Negative'
                  }
                >
                  {currencyFormatter(data.amount)}
                </span>
              </Table.Cell>
              <Table.Cell>
                <span
                  className={
                    data.balance === null ? '' : data.balance > 0
                      ? 'transaction__Amount__Positive'
                      : 'transaction__Amount__Negative'
                  }
                >
                  {data.balance !== null ? currencyFormatter(data.balance) : null}
                </span>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  )
}

export default connect(mapStateToProps)(Component)
