import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { Button, List, Ref } from 'semantic-ui-react'

import FileIcon from '../Icons/File'
import UploadIcon from '../Icons/Upload'

require('./style.css')

interface Props {
  accept?: string,
  className?: React.HTMLAttributes<any>['className'],
  files: File[],
  onFilesAccepted?: (acceptedFiles: File[]) => void,
  onFilesRejected?: (rejectedFiles: File[]) => void,
  onClearFilesClick?: () => void,
  onSendFilesClick?: () => void,
}

const Component: React.FunctionComponent<Props> = (props) => {
  const clearButtonRef = React.useRef<HTMLButtonElement>()
  const onDrop = React.useCallback((acceptedFiles: File[], rejectedFiles: File[]) => {
    if (props.onFilesAccepted && acceptedFiles.length > 0) {
      props.onFilesAccepted(acceptedFiles)
    }

    if (props.onFilesRejected && rejectedFiles.length > 0) {
      props.onFilesRejected(rejectedFiles)
    }
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: props.accept,
    onDrop,
  })

  React.useLayoutEffect(() => {
    const mouseover: (e: MouseEvent) => void = (e) => e.stopPropagation()

    if (clearButtonRef.current !== null) {
      window.addEventListener('mouseover', mouseover)
    }

    return () => {
      window.removeEventListener('mouseover', mouseover)
    }
  }, [clearButtonRef.current])

  return (
    <div>
      <div className='dropzone__Container'>
        <div className={`dropzone__uploadBox ${props.className}`} {...getRootProps()}>
          <input {...getInputProps()} />
          <UploadIcon height={100} width={100} />
          {
            isDragActive ?
              <p>Drop the files here ...</p> :
              <p>Arraste ou clique aqui para selecionar o arquivos a serem processados</p>
          }
        </div>
        <div className='dropzone__Controls'>
          <Button.Group>
            <Ref innerRef={clearButtonRef}>
              <Button onClick={props.onClearFilesClick} disabled={props.files.length === 0}>Limpar</Button>
            </Ref>
            <Button.Or />
            <Button positive onClick={props.onSendFilesClick} disabled={props.files.length === 0}>Enviar</Button>
          </Button.Group>
        </div>
        <List className='dropzone__selectedFilesList' horizontal>
          {props.files.map((file, i) => (
            <List.Item className='dropzone__selectedFilesListItem' key={i}>
              <List.Content>
                <FileIcon width={48} height={48} />
                <List.Header>{file.name}</List.Header>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </div>
    </div>
  )
}

export default Component
