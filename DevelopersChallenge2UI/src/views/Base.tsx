import * as React from 'react'
import {
  Container,
  Header,
  Menu,
} from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css'

import DropZone from '../components/Dropzone'
import Transactions from './Transactions'

const logoNibo = require('../static/img/logo-nibo.png')

const style = {
  h3: {
    marginTop: '2em',
    padding: '2em 0em',
  },
  last: {
    marginBottom: '300px',
  },
  topContainer: {
    marginTop: '2em',
  },
}

const Component: React.FunctionComponent = (props) => {
  return (
    <>
      <Container style={style.topContainer}>
        <Menu stackable>
          <Menu.Item>
            <img src={logoNibo} />
          </Menu.Item>
          <Menu.Item>Transações</Menu.Item>
          <Menu.Item>Upload</Menu.Item>
          <Menu.Item>Sobre</Menu.Item>
        </Menu>
      </Container>
      <Container>
        <DropZone />
      </Container>
      <Header as='h3' content='Transações' style={style.h3} textAlign='center' />
      <Container>
        <Transactions />
      </Container>
    </>
  )
}

export default Component
