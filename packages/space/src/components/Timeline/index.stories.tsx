import { Flex } from '@chakra-ui/react';
import { Meta } from '@storybook/react';

import { theme } from '../../modules/theme';
import { Typography } from '../Typography';

import { Timeline, TimelineConnector, TimelineContent, TimelineItem, TimelineMarker } from '.';

export default {
  title: 'Components/Molecules/Timeline',
  component: Timeline,
} as Meta;

export const Horizontal = () => {
  return (
    <Timeline orientation="horizontal" size="fill">
      <TimelineItem>
        <TimelineMarker />
        <TimelineConnector />
      </TimelineItem>
      <TimelineItem>
        <TimelineMarker />
        <TimelineConnector />
      </TimelineItem>
      <TimelineItem>
        <TimelineMarker />
      </TimelineItem>
    </Timeline>
  );
};

export const Vertical = () => {
  return (
    <Timeline orientation="vertical" size="fill" h="calc(100vh - 16px * 2)">
      <TimelineItem>
        <TimelineMarker />
        <TimelineConnector />
      </TimelineItem>
      <TimelineItem>
        <TimelineMarker />
        <TimelineConnector />
      </TimelineItem>
      <TimelineItem>
        <TimelineMarker />
      </TimelineItem>
    </Timeline>
  );
};

const DATA = [
  {
    title: 'Item 1',
    height: '100px',
  },
  {
    title: 'Item 2',
    height: '50px',
  },
  {
    title: 'Item 3',
    height: '75px',
  },
  {
    title: 'Item 4',
    height: '100px',
  },
  {
    title: 'Item 5',
  },
];

export const Alternating = () => {
  return (
    <Timeline orientation="vertical">
      {DATA.map((it, index) => {
        return (
          <Flex
            key={index}
            alignItems="start"
            flexDirection={index % 2 === 0 ? 'row' : 'row-reverse'}
          >
            <TimelineContent></TimelineContent>
            <TimelineItem mx={theme.sizes['5']}>
              <TimelineMarker />
              {!!it.height && <TimelineConnector size={it.height} />}
            </TimelineItem>
            <TimelineContent justifyContent={index % 2 === 0 ? 'start' : 'end'}>
              <Typography variant="body" size="md">
                {it.title}
              </Typography>
            </TimelineContent>
          </Flex>
        );
      })}
    </Timeline>
  );
};
