import { Box } from '@chakra-ui/react';
import { useMemo } from 'react';

import { DataProps } from '../../Header/types';

import { Level1List } from './Level1List';
import mask from './mask';

export const PcMenu = ({ data }: { data: DataProps }) => {
  const masker = useMemo(() => mask(), []);

  return (
    <>
      <Box
        height={'100%'}
        display={{ base: 'none', lg: 'flex' }}
        alignItems={'center'}
        onMouseEnter={() => {
          masker.create();
          masker.show();
        }}
        onMouseLeave={() => {
          masker.hide();
        }}
      >
        {data.map((level1, level1Index) => {
          return (
            <Level1List
              data={{
                level1,
                level1Index,
              }}
              key={`${level1.key}-${level1Index}-level1-item`}
            />
          );
        })}
      </Box>
    </>
  );
};
