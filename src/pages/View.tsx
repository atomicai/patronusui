import {
  ArrowDownTrayIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import { Link, Tooltip } from '@mui/material'

import { useState } from 'react'
import { useSetAtom, useAtom } from 'jotai'

import axios from 'axios'

import Plot, { PlotParams } from 'react-plotly.js'
import { file, plots, viewPayload } from '../contexts/UploadContext'
import { NavLink } from 'react-router-dom'
import { PlotPayload } from '../@types/view';
import { Keywords } from '../components/Keywords';

export const View = () => {
  const setPlots = useSetAtom(plots)
  const [fileAtom] = useAtom(file)
  const [plotsAtom] = useAtom(plots)
  const [viewPayloadAtom] = useAtom(viewPayload)
  const [sliderIndex, setSliderIndex] = useState<number>(0)
  const [indexCounter, setIndexCounter] = useState<number[]>([])

  const getPlot = async (endpoint: string) => {
    return axios.post(endpoint, {}).then((res) => res.data)
  }

  const handleRightArrow = (sliderIndex: number) => {
    const index: number = sliderIndex + 1

    if (!indexCounter.includes(index)) {
      getPlot(`/${viewPayloadAtom[index].figure}`).then((value: PlotParams) => {
        setPlots([...plotsAtom, value])

        setIndexCounter([...indexCounter, index])
        setSliderIndex((prevIndex) => prevIndex + 1)
      })
    }

    if (indexCounter.includes(index)) {
      setSliderIndex((prevIndex) => prevIndex + 1)
    }
  }

  const handleLeftArrow = () => {
    setSliderIndex((prevIndex) => prevIndex - 1)
  }

  return (
    <div className="w-full h-full flex justify-end items-center py-4">
      <nav className="h-1/3 w-[4%]  border-[#A456F0] border-r flex flex-col items-center justify-evenly">
        <NavLink
          to={'/'}
          className=" text-primary hover:cursor-pointer hover:text-white h-8 w-8"
        >
          <HomeIcon />
        </NavLink>

        <NavLink
          to={'/isearch'}
          className=" text-primary hover:cursor-pointer hover:text-white h-8 w-8"
        >
          <MagnifyingGlassIcon />
        </NavLink>
      </nav>
      <section className="h-full w-[92%]">
        <>
          <div className="w-full h-[95%] overflow-auto">
            {plotsAtom.map((figures: PlotParams | (PlotPayload | PlotParams)[], index: number) =>
              (index === sliderIndex)
                ? (
                  <div key={index} className="w-full flex flex-col justify-center items-center">
                    {
                      (Array.isArray(figures) ? figures : [{ figure: figures }]).map((item, itemIdx) => {
                        const figure = ('figure' in item) ? item.figure : item;
                        return (
                          <div key={itemIdx} className="py-4 w-full flex flex-col justify-center items-center">
                            <Plot
                              data={figure.data}
                              layout={figure.layout}
                            />
                            {('keywords' in item) && item.keywords?.length && (
                              <div className="pt-2 pb-4 w-full flex justify-center items-center gap-4">
                                <Keywords keywords={item.keywords} />
                              </div>
                            )}
                          </div>
                        );
                      })
                    }
                  </div>
                )
                : null
            )}
          </div>
          <div className="w-full h-[5%] pt-2 inline-flex justify-center">
            <ChevronDoubleLeftIcon
              color={sliderIndex !== 0 ? 'white' : 'gray'}
              height={20}
              width={20}
              className={`mr-2  ${
                sliderIndex !== 0 && 'hover:scale-125 hover:cursor-pointer'
              }`}
              onClick={() => sliderIndex !== 0 && handleLeftArrow()}
            />
            <ChevronDoubleRightIcon
              color={
                viewPayloadAtom.length - 1 !== sliderIndex ? 'white' : 'gray'
              }
              height={20}
              width={20}
              className={` ${
                viewPayloadAtom.length - 1 !== sliderIndex &&
                'hover:scale-125 hover:cursor-pointer'
              }`}
              onClick={() =>
                viewPayloadAtom.length - 1 !== sliderIndex &&
                handleRightArrow(sliderIndex)
              }
            />
          </div>
        </>
      </section>
      <nav className="h-1/3 w-[4%]  border-[#A456F0] border-l flex flex-col items-center justify-evenly">
        <NavLink
          to={'/iprofile'}
          className=" text-primary hover:cursor-pointer hover:text-white h-8 w-8"
        >
          <UserCircleIcon />
        </NavLink>

        <Tooltip title="Download file" arrow>
          <Link href={`/downloading/${fileAtom}`} target="_blank">
            <ArrowDownTrayIcon
              className={`h-8 w-8 text-[#A456F0] hover:cursor-pointer hover:text-white`}
            />
          </Link>
        </Tooltip>
      </nav>
    </div>
  )
}
