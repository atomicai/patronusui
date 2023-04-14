import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { ColumnCandidates } from '../@types/view';

interface SuccessLoadingResponse {
  success: string;
}
interface ErrorLoadingResponse {
  error: string;
}
type LoadingResponse = SuccessLoadingResponse | ErrorLoadingResponse;

interface Props {
  open: boolean
  setOpen: (value: boolean) => void
  handleViewing: any
  columnCandidates: ColumnCandidates;
}

const labelStyle = { display: 'inline-block', width: '10em', marginRight: '0.5em' };
const autocompleteStyle = { width: '15em' };

const maxNumberOfClusters = 15;
const defaultNumberOfClusters = 5;
const numberOfClustersOptions = Array.from(new Array(maxNumberOfClusters)).map((_, idx) => (idx + 1).toString());

export default function IloadDialog({ open, setOpen, handleViewing, columnCandidates }: Props) {
  const [textValue, setTextValue] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [numValue, setNumValue] = useState(numberOfClustersOptions[defaultNumberOfClusters - 1]);
  const [emailValue, setEmailValue] = useState<string>('')
  const [checkedResults, setCheckedResults] = useState(false)
  const [checkedSubscription, setCheckedSubscription] = useState(false)

  useEffect(() => {
    setTextValue('');
    setDateValue('');
  }, [columnCandidates]);

  const handleIloading = async () => {
    try {
      const response = await axios.post<LoadingResponse>('/iloading', {
        email: emailValue === '' ? null : emailValue,
        text: textValue,
        datetime: dateValue,
        num_clusters: numValue,
      }).then(({ data }) => data);
      const errorMessage = (response as ErrorLoadingResponse).error;
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      toast.success((response as SuccessLoadingResponse).success || 'Roger that, indexing in progress...');
      handleClose();
      handleViewing();
    } catch (e) {
      toast.error((e as Error).message);
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

          <div className="flex flex-row items-center">
            <span className="text-xl" style={labelStyle}>Number of clusters: </span>{' '}
            <Autocomplete
              value={numValue}
              onInputChange={(e, v) => setNumValue(v || numberOfClustersOptions[defaultNumberOfClusters - 1])}
              options={numberOfClustersOptions}
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
