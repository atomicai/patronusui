import { FC } from 'react';
import styles from './Spinner.module.css';

interface SpinnerProps {
  className?: string;
}

export const Spinner: FC<SpinnerProps> = ({ className = '' }) => (
  <span className={`${styles.loader} ${className}`} />
);
