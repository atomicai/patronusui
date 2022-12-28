import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import {
  CogIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  QuestionMarkCircleIcon,
  Bars2Icon,
  MagnifyingGlassIcon,
  PresentationChartBarIcon,
  UserCircleIcon,
  HomeIcon
} from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'

const upperConfig = [
  {
    text: 'Home',
    icon: <HomeIcon width={20} height={20} className="mr-2 text-primary" />,
    path: '/'
  },
  {
    text: 'Search',
    icon: (
      <MagnifyingGlassIcon
        width={20}
        height={20}
        color="red"
        className="mr-2 "
      />
    ),
    path: '/isearch'
  },
  {
    text: 'Charts',
    icon: (
      <PresentationChartBarIcon
        width={20}
        height={20}
        className="mr-2"
        color="green"
      />
    ),
    path: '/ichart'
  }
]

const downConfig = [
  {
    text: 'Profile',
    icon: (
      <UserCircleIcon width={20} height={20} className="mr-2" color="brown" />
    ),
    path: '/profile'
  },
  {
    text: 'Settings',
    icon: <CogIcon width={20} height={20} className="mr-2" color="gray" />,
    path: '/profile'
  }
]

type Anchor = 'top' | 'left' | 'bottom' | 'right'

interface Props {
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export default function CustomDrawer() {
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
    <div
      className="w-fit"
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className="p-4">
        {upperConfig.map((item, index) => (
          <NavLink
            to={item.path}
            className="mb-5 text-lg font-bold flex justify-start items-center hover:cursor-pointer"
            key={index}
          >
            {item.icon}
            {item.text}
          </NavLink>
        ))}
      </div>
      <Divider />
      <div className="p-4">
        {downConfig.map((item, index) => (
          <NavLink
            key={index}
            className="mb-5 text-lg font-bold flex justify-start items-center hover:cursor-pointer"
            to={item.path}
          >
            {item.icon}
            {item.text}
          </NavLink>
        ))}
      </div>
    </div>
  )

  return (
    <div>
      <React.Fragment>
        <Bars2Icon
          className={`h-8 w-8 hover:cursor-pointer hover:text-white text-primary`}
          onClick={toggleDrawer('right', true)}
        />
        <Drawer
          anchor={'right'}
          open={state['right']}
          onClose={toggleDrawer('right', false)}
        >
          {list('right')}
        </Drawer>
      </React.Fragment>
    </div>
  )
}
