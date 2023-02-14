import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios, { AxiosResponse } from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { ColumnCandidates } from '../@types/view';

type Response = {
  is_text_column_ok: boolean
  is_date_column_ok: boolean
}

interface Props {
  open: boolean
  setOpen: (value: boolean) => void
  handleViewing: any
  columnCandidates: ColumnCandidates;
}

const labelStyle = { display: 'inline-block', width: '10em', marginRight: '0.5em' };
const autocompleteStyle = { width: '15em' };
const takeFirst = (values: string[] | undefined, defaultValue: string) => values?.length ? values[0] : defaultValue;

export default function IloadDialog({ open, setOpen, handleViewing, columnCandidates }: Props) {
  const [textValue, setTextValue] = useState(takeFirst(columnCandidates.text, 'text'));
  const [dateValue, setDateValue] = useState(takeFirst(columnCandidates.datetime, 'datetime'));
  const [emailValue, setEmailValue] = useState<string>('')
  const [checkedResults, setCheckedResults] = useState(false)
  const [checkedSubscription, setCheckedSubscription] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setTextValue(takeFirst(columnCandidates.text, 'text'));
    setDateValue(takeFirst(columnCandidates.datetime, 'datetime'));
  }, [columnCandidates]);

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
            <span className="text-xl" style={labelStyle}>Text column name: </span>
            <Autocomplete
              freeSolo
              value={textValue}
              onInputChange={(e, v) => setTextValue(v || '')}
              options={columnCandidates.text || []}
              renderInput={(params) => <TextField {...params} />}
              size="small"
              sx={autocompleteStyle}
            />
          </div>

          <div className="flex flex-row items-center">
            <span className="text-xl" style={labelStyle}>Date column name: </span>{' '}
            <Autocomplete
              freeSolo
              value={dateValue}
              onInputChange={(e, v) => setDateValue(v || '')}
              options={columnCandidates.datetime || []}
              renderInput={(params) => <TextField {...params} />}
              size="small"
              sx={autocompleteStyle}
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
