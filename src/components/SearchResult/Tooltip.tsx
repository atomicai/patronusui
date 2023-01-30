import { FC } from 'react';
import MuiTooltip, { TooltipProps as MuiTooltipProps } from '@mui/material/Tooltip';
import styles from './Tooltip.module.css';

type TooltipProps = Pick<MuiTooltipProps, 'title' | 'children'>;

export const Tooltip: FC<TooltipProps> = ({ title, children }) => (
  <MuiTooltip title={title} arrow classes={{ arrow: styles.arrow, tooltip: styles.tooltip }}>
    {children}
  </MuiTooltip>
);
