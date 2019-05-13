import * as React from 'react'
import {
  Container,
  Table,
} from 'semantic-ui-react'
import { connect } from 'react-redux';

import { StoreState } from '../redux/store'

const mapStateToProps = (state: StoreState) => ({
  transactions: state.transaction.list,
  transactionsById: state.transaction.byId,
})

interface Props {}

type ConnectedProps = ReturnType<typeof mapStateToProps>

const Component: React.FunctionComponent<Props> = (props: Props & ConnectedProps) => {
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
              <Table.Cell>Data</Table.Cell>
              <Table.Cell>{props.transactionsById[id].description}</Table.Cell>
              <Table.Cell>{props.transactionsById[id].amount}</Table.Cell>
              <Table.Cell>Tipo</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  )
}

export default connect(mapStateToProps)(Component)
