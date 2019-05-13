import * as React from 'react'
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Container } from 'semantic-ui-react'

import { TransactionActions } from '../redux/actions';

import DropZone from '../components/Dropzone'

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  uploadRequest: TransactionActions.uploadRequest
}, dispatch)

interface Props {}

type ConnectedProps = ReturnType<typeof mapDispatchToProps>

const Component: React.FunctionComponent<Props> = (props: Props & ConnectedProps) => {
  const [files, setFiles] = React.useState<File[]>([])
  const onFilesAccepted = React.useCallback((selectedFiles: File[]) => {
    setFiles(prevFiles => prevFiles.concat(selectedFiles))
  }, [])

  const onClearFilesClick = React.useCallback(() => {
    setFiles([])
  }, [])

  const onSendFilesClick = React.useCallback(() => {
    if (files.length > 0) {
      props.uploadRequest(files)
    }
  }, [files])

  return (
    <Container>
      <DropZone
        accept='.ofx'
        onFilesAccepted={onFilesAccepted}
        files={files}
        onClearFilesClick={onClearFilesClick}
        onSendFilesClick={onSendFilesClick}
      />
    </Container>
  )
}

export default connect(null, mapDispatchToProps)(Component)
