import * as React from 'react'
import Drawer from '@mui/material/Drawer'

import { ShieldExclamationIcon } from '@heroicons/react/24/outline'

import { useAtom, useSetAtom } from 'jotai'
import { unknownPassages } from '../../contexts/UnknownContext'

type Anchor = 'top' | 'left' | 'bottom' | 'right'

interface Props {
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export default function UnknownDrawer() {
  const [unknownPassagesAtom] = useAtom(unknownPassages)
  const [isUnknown, setIsUnknown] = React.useState<number>(-1)

  const handleUnknown = (index: number) => {
    isUnknown === index ? setIsUnknown(-1) : setIsUnknown(index)
  }

  const [checked, setChecked] = React.useState(false)

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  })

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      setState({ ...state, [anchor]: open })
    }

  const list = (anchor: Anchor) => (
    <div className="w-fit bg-secondary" role="presentation">
      <div className="p-4">
        {unknownPassagesAtom.map((item, index) => (
          <li
            key={index}
            className={'text-white mx-4 hover:cursor-pointer'}
            onClick={() => handleUnknown(index)}
          >
            <span
              className={`max-w-[240px] ${index !== isUnknown && 'truncate'}`}
            >
              {item.text}
            </span>
            {checked && (
              <span className="ml-2 text-[#A456F0]">
                {item.score !== undefined && parseFloat(item.score).toFixed(2)}
              </span>
            )}
          </li>
        ))}
      </div>
    </div>
  )

  return (
    <React.Fragment>
      <ShieldExclamationIcon
        className={`h-8 w-8 hover:cursor-pointer hover:text-white text-primary`}
        onClick={toggleDrawer('right', true)}
      />
      <Drawer
        id="unknown-drawer"
        anchor={'right'}
        open={state['right']}
        onClose={toggleDrawer('right', false)}
      >
        {list('right')}
      </Drawer>
    </React.Fragment>
  )
}
