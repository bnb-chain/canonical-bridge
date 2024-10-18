import { Box, BoxProps } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

// TODO: Could make these props but for now let's stay consistent until we have more use cases.
const SPEED = 100;
const DELAY_START = 400;
const DELAY_END = 1000;

type Props = Omit<BoxProps, 'children'> & {
  values: string[];
  loop?: boolean;
};

export const Typewriter = ({ values, loop, ...otherProps }: Props) => {
  const [currentValue, setCurrentValue] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentArrayIndex, setCurrentArrayIndex] = useState(0);

  useEffect(() => {
    if (currentArrayIndex === values.length) {
      setCurrentArrayIndex(0);
      setCurrentIndex(0);
      return;
    }

    if (currentIndex === values[currentArrayIndex].length * 2) {
      setCurrentArrayIndex((prevArrayIndex) => prevArrayIndex + 1);
      setCurrentIndex(0);
      return;
    }

    if (currentIndex < values[currentArrayIndex].length) {
      const timeout = setTimeout(
        () => {
          setCurrentValue((prevValue) => prevValue + values[currentArrayIndex][currentIndex]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        },
        // Pause at the start of every word.
        currentIndex === 0 ? DELAY_START : SPEED,
      );

      return () => clearTimeout(timeout);
    }
    // values.length > 1 ||
    if (
      (loop && currentIndex >= values[currentArrayIndex].length) ||
      (!loop && currentArrayIndex < values.length - 1)
    ) {
      const timeout = setTimeout(
        () => {
          setCurrentValue((prevValue) => prevValue.slice(0, prevValue.length - 1));
          setCurrentIndex((prevIndex) => prevIndex + 1);
        },
        // Pause at the end of every word.
        currentIndex === values[currentArrayIndex].length ? DELAY_END : SPEED,
      );

      return () => clearTimeout(timeout);
    }
  }, [currentArrayIndex, currentIndex, loop, values]);

  return <Box {...otherProps}>{currentValue}</Box>;
};
