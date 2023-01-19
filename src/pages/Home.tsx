import {
  MagnifyingGlassIcon,
  PresentationChartBarIcon,
  RocketLaunchIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { PlotParams } from 'react-plotly.js'
import { UploadPayload, ViewPayload } from '../@types/view'
import IloadDialog from '../components/IloadDialog'
import UploadDialog from '../components/UploadDialog'
import { useSetAtom, useAtom } from 'jotai'
import { file, lazyPlots, plots, viewPayload } from '../contexts/UploadContext'
import { NavLink, useNavigate } from 'react-router-dom'

export const Home: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const setViewPayload = useSetAtom(viewPayload)

  const setPlots = useSetAtom(plots)
  const setFile = useSetAtom(file)
  const setLazyPlots = useSetAtom(lazyPlots);

  const [plotsAtom] = useAtom(plots)
  const [popup, setPopup] = useState(false)

  const navigate = useNavigate()

  const handleUpload = async (file: File) => {
    const data = new FormData()
    data.append('file', file)

    setLoading(true)
    setOpen(false)

    setLazyPlots({});

    const response: UploadPayload = await axios({
      method: 'post',
      url: '/uploading',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: data
    }).then((res) => res.data)

    const { is_suffix_ok, filename, is_file_corrupted } = response

    if (!is_suffix_ok) {
      toast.error('File is corrupted. Please, upload a new one.')
      setLoading(false)
    }

    if (is_file_corrupted) {
      toast.error('Incorrect file format, please upload available one.')
      setLoading(false)
    }

    if (is_suffix_ok && !is_file_corrupted) {
      toast.success('Request has been processed, please, specify details')
      setPopup(true)
      setFile(filename)
    }
  }

  const getPlot = async (endpoint: string) => {
    return axios.post(endpoint, {}).then((res) => res.data)
  }

  const handleViewing = async () => {
    const response: ViewPayload[] = await axios({
      method: 'get',
      url: '/viewing',
      headers: { 'Content-Type': 'application/json' }
    }).then((res) => res.data)

    setViewPayload(response)

    getPlot(`/${response[0].figure}`).then((value: PlotParams) => {
      setPlots([value])
      setLoading(false)

      navigate('/isearch')
    })
  }

  return (
    <section className="w-full h-full flex justify-center items-center">
      <UploadDialog open={open} setOpen={setOpen} handleUpload={handleUpload} />
      <IloadDialog
        open={popup}
        setOpen={setPopup}
        handleViewing={handleViewing}
      />
      <div className="flex flex-col items-center justify-center">
        <RocketLaunchIcon
          className={`text-primary hover:cursor-pointer hover:text-white sm:w-[150px] sm:h-[150px] w-[90px] h-[90px] ${
            loading ? 'animate-rocket-blink' : 'text-primary'
          }`}
          onClick={() => setOpen(true)}
        />
      </div>
      {plotsAtom.length > 0 && (
        <>
          <div className="absolute w-4 h-full right-5  mr-5 justify-center items-center flex">
            <div className="h-1/3 w-full   flex flex-col items-center justify-evenly">
              <NavLink
                to={'/iprofile'}
                className=" text-primary hover:cursor-pointer hover:text-white h-8 w-8"
              >
                <UserCircleIcon />
              </NavLink>
            </div>
          </div>
          <div className="absolute w-4 h-full left-5  ml-5 justify-center items-center flex">
            <div className="h-1/3 w-full   flex flex-col items-center justify-evenly">
              <NavLink
                to={'/isearch'}
                className=" text-primary hover:cursor-pointer hover:text-white h-8 w-8"
              >
                <MagnifyingGlassIcon />
              </NavLink>

              <NavLink
                to={'/ichart'}
                className=" text-primary hover:cursor-pointer hover:text-white h-8 w-8"
              >
                <PresentationChartBarIcon />
              </NavLink>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
