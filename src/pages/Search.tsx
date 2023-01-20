import {
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  HomeIcon,
  PresentationChartBarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

import { NavLink, useNavigate } from 'react-router-dom'
import { Data, Doc } from '../@types/search'

import { arrayUnion, doc, updateDoc } from '@firebase/firestore'
import { Tooltip } from '@mui/material'
import { useAtom, useSetAtom } from 'jotai'
import { DateRangePicker } from 'rsuite'
import { currentUser } from '../contexts/AuthContext'
import { db } from '../firebase'
import { Ranges } from '../utils/dates'
import { known as k } from '../utils/removable/text'
import ProfileIcon from './auth/components/ProfileIcon'

type testEx = {
  title: string
  GlossDiv?: any
}

export const Search: React.FC = () => {
  const [withTimestamp, setWithTimestamp] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [known, setKnown] = useState<Doc[]>([])
  const [favorite, setFavorite] = useState<Doc[]>([])
  // const [unknown, setUnknown] = useState<Doc[]>([])
  const [openTimestamp, setOpenTimestamp] = useState<boolean>(false)
  const [userAtom] = useAtom(currentUser)
  const setUserAtom = useSetAtom(currentUser)
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(),
    new Date()
  ])
  const [isUnknown, setIsUnknown] = useState<number>(-1)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [fullText, setFullText] = useState<string | null>(null)
  const [animation, setAnimation] = useState('first')
  const [searchMode, setSearchMode] = useState<boolean>(false)
  const [firstRender, setFirstRender] = useState<boolean>(false)
  const [icons, setIcons] = useState<boolean>(false)

  const navigate = useNavigate()
  // const setUnknownPassages = useSetAtom(unknownPassages)
  // const [unknownPassagesAtom] = useAtom(unknownPassages)
  // const [loading, setLoading] = useState<boolean>(false)
  // const [isDownloadable, setIsDownloadable] = useState<boolean>(false)
  // const [filename, setFilename] = useState<string>('')

  useEffect(() => {
    setTimeout(() => {
      setAnimation('second')
    }, 3000)

    setTimeout(() => {
      setAnimation('first')
    }, 6000)
  }, [])

  const handleUnknown = (index: number, text: string) => {
    isUnknown === index ? setIsUnknown(-1) : setIsUnknown(index)

    setFullText(text)
  }

  const [checked, setChecked] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

  // const openSettings = Boolean(anchorEl)
  // const id = openSettings ? 'simple-popover' : undefined

  const handleSearch = async () => {
    if (withTimestamp) {
      setFirstRender(true)

      if (userAtom) {
        const docRef = doc(db, 'users', userAtom.uid)
        await updateDoc(docRef, {
          searchHistory: arrayUnion(inputValue)
        })
        setUserAtom({
          ...userAtom,
          searchHistory: [...userAtom.searchHistory, inputValue]
        })
      }

      const response: Data = await axios
        .post('/searching', {
          text: inputValue,
          from: dateRange[0].toString(),
          to: dateRange[1].toString()
        })
        .then((res) => res.data)

      console.log(response.docs)

      setKnown([...known, ...response.docs])
    }

    if (!withTimestamp) {
      setFirstRender(true)

      if (userAtom) {
        const docRef = doc(db, 'users', userAtom.uid)
        await updateDoc(docRef, {
          searchHistory: arrayUnion(inputValue)
        })
        setUserAtom({
          ...userAtom,
          searchHistory: [...userAtom.searchHistory, inputValue]
        })
      }

      const response: Data = await axios
        .post('/searching', {
          text: inputValue
        })
        .then((res) => res.data)

      console.log(response.docs)

      setKnown([...known, ...response.docs])
    }
  }

  const handleSearchTest = async () => {
    setFirstRender(true)
    setKnown([...known, k])
  }

  const handleDownloadFavs = async () => {
    const filename = await axios
      .post<{ filename: string }>('/snapshotting', {
        docs: favorite
      })
      .then((res) => res.data.filename)
    window.open(`/downloading/${filename}`)
  }

  const handleRemove = (index: number) => {
    const filterArray = known.filter((_, id: number) => id !== index)

    setKnown(filterArray)
  }

  const handleUpvote = (index: number) => {
    const filterArray = known.filter((_, id: number) => id !== index)

    setKnown(filterArray)
    setFavorite([
      ...favorite,
      {
        ...known[index],
        upvote: 1
      }
    ])
  }

  const handleUpvoteMore = (index: number) => {
    if (favorite[index].upvote! < 10) {
      const filterArray = favorite.map((item: Doc, id: number) => {
        if (id === index) {
          return {
            ...item,
            upvote: item.upvote! + 1
          }
        } else {
          return item
        }
      })
      setFavorite(filterArray)
    } else {
      toast.error('Maximum upvote count reached!')
    }
  }

  const handleDownvote = (index: number) => {
    if (favorite[index].upvote! > 1) {
      const filterArray = favorite.map((item: Doc, id: number) => {
        if (id === index) {
          return {
            ...item,
            upvote: item.upvote! - 1
          }
        } else {
          return item
        }
      })
      setFavorite(filterArray)
    } else {
      const filterArray = favorite.filter((_, id: number) => id !== index)

      setFavorite(filterArray)
      setKnown([...known, favorite[index]])
    }
  }

  const MyPicker = React.forwardRef((props, ref) => {
    return <span className="hidden" {...props}></span>
  })

  return (
    <main className="w-screen h-screen">
      <nav className={`w-full h-[8%] flex justify-evenly items-center `}>
        <div className="flex justify-center items-center w-[10%]">
          <NavLink
            to={'/'}
            className="mr-2 text-primary hover:cursor-pointer hover:text-white w-8 h-8"
          >
            <HomeIcon />
          </NavLink>

          <NavLink
            to={'/ichart'}
            className=" text-primary hover:cursor-pointer hover:text-white w-8 h-8"
          >
            <PresentationChartBarIcon />
          </NavLink>
          {favorite.length > 0 && (
            <Tooltip title="Download favorites" arrow>
              {/* <Link
                href={`/downloading/${handleDownloadFavs()}`}
                target="_blank"
              > */}
              <ArrowDownTrayIcon
                onClick={handleDownloadFavs}
                className={`h-8 w-8 ml-2 text-[#A456F0] hover:cursor-pointer hover:text-white`}
              />
              {/* </Link> */}
            </Tooltip>
          )}

          {/* <Popover
            id={id}
            open={openSettings}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
          >
            <div className="p-2 flex flex-row justify-center items-center">
              <span>Score {checked ? 'on' : 'off'}</span>
              <Switch checked={checked} onChange={handleChange} />
            </div>
          </Popover> */}
        </div>
        <div
          className="w-4/5 h-full border-[#A456F0] border-b flex justify-center "
          onClick={() => setSearchMode(true)}
        >
          {searchMode ? (
            <input
              type="search"
              // onBlur={() => setSearchMode(false)}
              autoFocus={true}
              onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
              onChange={(event) => setInputValue(event.target.value)}
              value={inputValue}
              placeholder={''}
              autoComplete="false"
              className="outline-none border-none text-center w-full h-full bg-[#12071f] text-white text-3xl"
            />
          ) : (
            <div className="text-gray-200 opacity-80 ">
              {animation === 'first' ? (
                <p
                  className={`relative top-1/2 whitespace-nowrap overflow-hidden transform translate-y-[-50%] text-[180%] border-white border-solid border-r-2 my-0 mx-auto w-0 max-w-fit font-dance text-center 
                   first
                `}
                >
                  Let's search
                </p>
              ) : (
                <p
                  className={`relative top-1/2 whitespace-nowrap overflow-hidden transform translate-y-[-50%] text-[180%] border-white border-solid border-r-2 my-0 mx-auto w-0 max-w-fit font-caveat text-center 
                   second
                `}
                >
                  Давайте поищем
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-row justify-center items-center w-[10%]">
          <CheckCircleIcon
            className={`w-8 h-8 mr-2 ${
              withTimestamp ? 'text-white' : 'text-primary'
            } hover:cursor-pointer hover:text-white`}
            onClick={() => setWithTimestamp(!withTimestamp)}
          />
          {withTimestamp && (
            <>
              <CalendarDaysIcon
                className={`w-8 h-8 mr-2 text-primary hover:cursor-pointer hover:text-white`}
                onClick={() => setOpenTimestamp(true)}
              />

              <DateRangePicker
                placeholder="Select Date Range"
                size="md"
                ranges={Ranges}
                style={{
                  width: 100
                }}
                open={openTimestamp}
                placement="auto"
                appearance="subtle"
                id="date-range"
                toggleAs={MyPicker}
                onOk={() => setOpenTimestamp(false)}
                value={dateRange}
                onChange={(value: any) => setDateRange(value)}
              />
            </>
          )}

          <ProfileIcon />
        </div>
      </nav>

      <div
        className="w-full h-[92%] flex flex-row text-white py-5"
        onClick={() => setSearchMode(false)}
      >
        {!firstRender ? (
          <div className="w-full h-full justify-center flex items-center">
            <img src="/wait.svg" height={20} />
          </div>
        ) : (
          <>
            <div className="w-3/4 flex-col flex h-full items-center">
              <div className="w-full tilesWrap overflow-y-auto scrollbar-thin h-full ">
                <>
                  {known.map((item: Doc, index: number) => {
                    return (
                      <>
                        <li
                          className="text-white li-element bg-primary"
                          key={index}
                          onMouseEnter={() => setIcons(true)}
                          onMouseLeave={() => setIcons(false)}
                        >
                          {checked && (
                            <div className="absolute -right-1 -top-3 w-fit h-fit border-purple-600 border-t border-r p-2 rotate-12 skew-x-12">
                              {item.score}
                            </div>
                          )}

                          <h3 className="h3-element">{item.title}</h3>
                          <div
                            className="div-element hover:cursor-pointer"
                            onClick={() => setFullText(item.text)}
                          >
                            {item.text}
                          </div>

                          <div className="!inline-flex !flex-row w-full ">
                            <HandThumbUpIcon
                              className={`w-8 h-8 mr-2 ${
                                !icons ? 'opacity-0' : 'opacity-100'
                              } transition-opacity hover:cursor-pointer hover:text-primary`}
                              onClick={() => handleUpvote(index)}
                            />
                            <HandThumbDownIcon
                              className={`w-8 h-8 ${
                                !icons ? 'opacity-0' : 'opacity-100'
                              } transition-opacity hover:cursor-pointer hover:text-primary `}
                              onClick={() => handleRemove(index)}
                            />
                          </div>
                          {item.timestamp !== undefined && (
                            <span className="!inline-block w-full">
                              {item.timestamp}
                            </span>
                          )}
                        </li>
                      </>
                    )
                  })}
                </>
              </div>
            </div>
            <div className="w-1/4  flex flex-col border-[#A456F0] items-center  border-l overflow-y-auto scrollbar-thin h-full  ">
              <ul className="flex flex-col w-full h-[100%] overflow-y-auto scrollbar-thin">
                {fullText === null ? (
                  favorite.map((item: Doc, index: number) => {
                    return (
                      <div className="flex flex-col">
                        <li
                          key={index}
                          className={
                            'text-white flex flex-row justify-between mr-4'
                          }
                        >
                          <span className="list-element">{item.upvote}</span>
                          <span
                            className={`max-w-[240px] hover:cursor-pointer truncate`}
                            onClick={() => handleUnknown(index, item.text)}
                          >
                            {item.text}
                          </span>

                          <span className="inline-flex ml-2 text-white">
                            <HandThumbUpIcon
                              className={`w-4 h-4 mr-2  hover:cursor-pointer hover:text-primary`}
                              onClick={() => handleUpvoteMore(index)}
                            />
                            <HandThumbDownIcon
                              className={`w-4 h-4 hover:cursor-pointer hover:text-primary `}
                              onClick={() => handleDownvote(index)}
                            />
                          </span>
                        </li>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex flex-col p-3">
                    <span className="mb-2 flex flex-row justify-end">
                      <XMarkIcon
                        className="w-8 h-8 hover:text-primary hover:cursor-pointer"
                        onClick={() => setFullText(null)}
                      />
                    </span>
                    <span className="white-space">{fullText}</span>
                  </div>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
