import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import axios, { AxiosResponse } from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

type Response = {
  is_text_column_ok: boolean
  is_date_column_ok: boolean
}

interface Props {
  open: boolean
  setOpen: (value: boolean) => void
  handleViewing: any
}

export default function IloadDialog({ open, setOpen, handleViewing }: Props) {
  const [textValue, setTextValue] = useState('text')
  const [dateValue, setDateValue] = useState('datetime')
  const [emailValue, setEmailValue] = useState<string>('')
  const [checkedResults, setCheckedResults] = useState(false)
  const [checkedSubscription, setCheckedSubscription] = useState(false)
  const navigate = useNavigate()

  const handleIloading = async () => {
    const response: AxiosResponse<Response> = await axios.post('/iloading', {
      email: emailValue === '' ? null : emailValue,
      text: textValue === '' ? 'text' : textValue,
      datetime: dateValue === '' ? 'datetime' : dateValue
    })

    if (response.data.is_date_column_ok && response.data.is_text_column_ok) {
      handleClose()
      toast.success('Roger that, indexing in progress...')
      // setProcessing(true)
      handleViewing()
    }

    if (!response.data.is_date_column_ok && response.data.is_text_column_ok) {
      handleClose()
      toast.success(
        'Roger that, datetime column is no specified using default ordering'
      )
      // setProcessing(true)
      handleViewing()
    }

    if (!response.data.is_text_column_ok) {
      toast.error('Sorry, but the textual column name does not match')
      handleClose()
      // setLoading(false)
      navigate('/searching')
    }
  }

  const handleChangeResults = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedResults(event.target.checked)

    if (!checkedSubscription) {
      setCheckedSubscription(event.target.checked)
    }
  }

  const handleChangeSubscription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCheckedSubscription(event.target.checked)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Please, specify column names in your file to proceed'}
        </DialogTitle>
        <DialogContent sx={{ paddingBottom: 0 }}>
          <div className="flex flex-row items-center mb-1">
            <span className="text-xl">Text column name: </span>{' '}
            <input
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              className="ml-3 text-base pl-2 text-field"
              autoFocus={true}
            />
          </div>

          <div className="flex flex-row items-center">
            <span className="text-xl">Date column name: </span>{' '}
            <input
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="ml-3 text-base pl-2 text-field"
            />
          </div>
          <div className="mt-6 text-sm">
            <div className="flex flex-row items-center">
              <input
                type="checkbox"
                checked={checkedResults}
                onChange={handleChangeResults}
                className="text-gray-400 rounded-full mr-2 hover:cursor-pointer hover:text-gray-500"
              />
              <label>Send processing results via email</label>
            </div>

            {checkedResults && (
              <div className="flex flex-row items-center">
                <span className="text-xl">Type in your email: </span>{' '}
                <input
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  className="ml-3 text-base pl-2 text-field"
                />
              </div>
            )}

            <div className="flex flex-row items-center">
              <input
                checked={checkedSubscription}
                type="checkbox"
                onChange={handleChangeSubscription}
                className="text-gray-400 rounded-full mr-2 hover:cursor-pointer hover:text-gray-500"
              />
              <label>Subscribe to receive notifications</label>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleIloading}>Proceed</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
