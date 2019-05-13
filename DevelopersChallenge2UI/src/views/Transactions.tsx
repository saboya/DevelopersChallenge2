import * as React from 'react'
import {
  Container,
  Table,
} from 'semantic-ui-react'
import { connect } from 'react-redux';

import { useCurrency } from '../util/useCurrency'
import { StoreState } from '../redux/store'

import './style.css'

const mapStateToProps = (state: StoreState) => ({
  transactions: state.transaction.list,
  transactionsById: state.transaction.byId,
})

interface Props {}

type ConnectedProps = ReturnType<typeof mapStateToProps>

const Component: React.FunctionComponent<Props> = (props: Props & ConnectedProps) => {
  const [currencyFormatter] = useCurrency({ currency: 'BRL' })

  return (
    <Container>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Data</Table.HeaderCell>
            <Table.HeaderCell>Descrição</Table.HeaderCell>
            <Table.HeaderCell>Quantia</Table.HeaderCell>
            <Table.HeaderCell>Tipo</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.transactions.map(id => (
            <Table.Row key={id}>
              <Table.Cell>{props.transactionsById[id].timestamp}</Table.Cell>
              <Table.Cell>{props.transactionsById[id].description}</Table.Cell>
              <Table.Cell>
                <span
                  className={
                    props.transactionsById[id].amount > 0
                      ? 'transaction__Amount__Positive'
                      : 'transaction__Amount__Negative'
                  }
                >
                  {currencyFormatter(props.transactionsById[id].amount)}
                </span>
              </Table.Cell>
              <Table.Cell>{props.transactionsById[id].operationType}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  )
}

export default connect(mapStateToProps)(Component)
