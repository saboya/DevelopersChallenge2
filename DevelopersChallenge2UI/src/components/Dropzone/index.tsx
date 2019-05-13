import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { List } from 'semantic-ui-react'

import FileIcon from '../Icons/File'
import UploadIcon from '../Icons/Upload'

require('./style.css')

interface Props {
  className?: React.HTMLAttributes<any>['className'],
  onFilesAccepted?: (acceptedFiles: File[]) => void,
  onFilesRejected?: (rejectedFiles: File[]) => void,
  onFilesAdded?: (files: File[]) => void,
}

const Component: React.FunctionComponent<Props> = (props) => {
  const [files, setFiles] = React.useState<File[]>([])

  const onDrop = React.useCallback((acceptedFiles: File[], rejectedFiles: File[]) => {
    if (props.onFilesAccepted && acceptedFiles.length > 0) {
      props.onFilesAccepted(acceptedFiles)
    }

    if (props.onFilesRejected && rejectedFiles.length > 0) {
      props.onFilesRejected(rejectedFiles)
    }

    setFiles(prevFiles => prevFiles.concat(acceptedFiles))
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: '.ofx',
    onDrop,
  })

  React.useEffect(() => props.onFilesAdded && props.onFilesAdded(files), [files])

  return (
    <div>
      <div className={`uploadBox ${props.className}`} {...getRootProps()}>
        <input {...getInputProps()} />
        <UploadIcon height={100} width={100} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Arraste ou clique aqui para selecionar o arquivos a serem processados</p>
        }
      </div>
      <List className='selectedFilesList' horizontal>
        {files.map((file, i) => (
          <List.Item className='selectedFilesListItem' key={i}>
            <List.Content>
              <FileIcon width={48} height={48} />
              <List.Header>{file.name}</List.Header>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </div>
  )
}

export default Component
