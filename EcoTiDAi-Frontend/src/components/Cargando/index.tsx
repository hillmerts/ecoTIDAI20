import classnames from 'classnames';
import React, { FC } from 'react';
import { Container, Image, Spinner } from 'react-bootstrap';
import styles from './styles.module.scss';

interface LoadingProps {
  full?: boolean;
  showLogo?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  spinnerColor?: string;
}

const Loading: FC<LoadingProps> = ({
  className,
  full = false,
  showLogo,
  size = 'md',
  spinnerColor,
}) => {
  return (
    <Container
      aria-label="loading-spinner"
      className={classnames(
        styles.container,
        className,
        full && styles.full,
        size === 'sm' && styles.small
      )}
    >
      <Spinner
        data-testid="loading-spinner"
        animation="border"
        style={{ color: spinnerColor }}
      />
    </Container>
  );
};

export default Loading;