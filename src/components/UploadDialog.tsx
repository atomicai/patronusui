import { Button } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import { useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

// const fileTypes = ["CSV", "", "GIF"];

export interface UploadDialogProps {
  open: boolean
  setOpen: (value: boolean) => void
  handleUpload: (file: any) => void
}

export default function UploadDialog({
  open,
  setOpen,
  handleUpload
}: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)

  const handleChange = (file: File) => {
    setFile(file)
  }

  const handleCancel = () => {
    setOpen(false)
    setFile(null)
  }

  return (
    <Dialog open={open}>
      <div className="w-[500px]  p-5">
        <FileUploader
          handleChange={handleChange}
          name="file"
          children={
            <div className="w-full h-[300px] border-[#A456F0] border-dashed border-2 rounded-sm flex flex-col justify-center items-center">
              <ArrowDownTrayIcon className={`h-16 w-16 text-[#A456F0]`} />
              {file ? (
                <span className="mt-4">{file.name}</span>
              ) : (
                <div className="mt-4 ">
                  <span className="text-[#A456F0] hover:text-[#12071f] hover:cursor-pointer">
                    Choose a file{' '}
                  </span>
                  <span></span>
                  or drag it here.
                </div>
              )}
            </div>
          }
        />
        {/* <p>{file ? `File name: ${file.name}` : 'no files uploaded yet'}</p>
        <Button onClick={() => setOpen(false)}>Close</Button> */}
        <div className="w-full h-5 flex justify-center mt-5 ">
          <Button
            onClick={() => handleUpload(file)}
            disabled={file ? false : true}
          >
            Apply
          </Button>
          <Button onClick={() => handleCancel()}>Cancel</Button>
        </div>
      </div>
    </Dialog>
  )
}
