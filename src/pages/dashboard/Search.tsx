import {
  CalendarDaysIcon,
  CheckCircleIcon,
  HomeIcon,
  PresentationChartBarIcon,
} from '@heroicons/react/24/outline'

import axios from 'axios'
import React, { useEffect, useState } from 'react'

import { Doc, Data } from '../../@types/search'
import { NavLink } from 'react-router-dom'

import { arrayUnion, doc, updateDoc } from '@firebase/firestore'
import { useAtom, useSetAtom } from 'jotai'
import { DateRangePicker } from 'rsuite'
import ProfileIcon from '../../components/ProfileIcon'
import { currentUser } from '../../contexts/AuthContext'
import { db } from '../../firebase'
import { Ranges } from '../../utils/dates'
import { SearchResult } from '../../components/SearchResult';
import { Spinner } from '../../components/Spinner';

export const Search: React.FC = () => {
  const [withTimestamp, setWithTimestamp] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [known, setKnown] = useState<Doc[]>([])
  const [openTimestamp, setOpenTimestamp] = useState<boolean>(false)
  const [userAtom] = useAtom(currentUser)
  const setUserAtom = useSetAtom(currentUser)
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(),
    new Date()
  ])
  const [animation, setAnimation] = useState('first')
  const [searchMode, setSearchMode] = useState<boolean>(false)
  const [firstRender, setFirstRender] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimation('second')
    }, 3000)

    setTimeout(() => {
      setAnimation('first')
    }, 6000)
  }, [])

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

      setIsLoading(true);
      const response: Data = await axios
        .post('/searching', {
          text: inputValue,
          from: dateRange[0].toString(),
          to: dateRange[1].toString()
        })
        .then((res) => res.data)
      setIsLoading(false);

      setKnown([...response.docs])
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

      setIsLoading(true);
      const response: Data = await axios
        .post('/searching', {
          text: inputValue
        })
        .then((res) => res.data)
      setIsLoading(false);

      setKnown([...response.docs])
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
        className="w-full h-[92%] text-white py-5"
        onClick={() => setSearchMode(false)}
      >
        {!firstRender ? (
          <div className="w-full h-full justify-center flex items-center">
            <img src="/wait.svg" height={20} alt="" />
          </div>
        ) : (
          <div className="mx-8 relative">
            {isLoading && <div className="z-10 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"><Spinner /></div>}
            <SearchResult found={known} append />
          </div>
        )}
      </div>
    </main>
  )
}
