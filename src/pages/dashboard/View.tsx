import {
  ArrowDownTrayIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  HomeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { Link, Tooltip } from '@mui/material'

import { useAtom, useSetAtom } from 'jotai'
import { useState } from 'react'

import axios from 'axios'

import { PlotParams } from 'react-plotly.js'
import { NavLink } from 'react-router-dom'
import { PlotPayload } from '../../@types/view'
import { LazyFigures } from '../../components/LazyFigures'
import ProfileIcon from '../../components/ProfileIcon'
import { file, plots, viewPayload } from '../../contexts/UploadContext'

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
          <div className="w-full h-[95%] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-500 overflow-auto">
            {plotsAtom.map(
              (
                figures: PlotParams | (PlotPayload | PlotParams)[],
                index: number
              ) =>
                index === sliderIndex ? (
                  <div
                    key={index}
                    className="w-full flex flex-col justify-center items-center"
                  >
                    {(Array.isArray(figures)
                      ? (figures as PlotPayload[])
                      : [{ figure: figures }]
                    ).map((item, itemIdx) => (
                      <LazyFigures
                        key={itemIdx}
                        figure={'figure' in item ? item.figure : item}
                        keywords={item.keywords || []}
                        lazyApi={item.lazy_figure_api || []}
                      />
                    ))}
                  </div>
                ) : null
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
          <ProfileIcon />
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
