import * as _Icon from '@bnb-chain/icons';
import { Flex, Text } from '@chakra-ui/react';

import { theme } from '../../modules/theme';

const Icon = _Icon;

/* eslint-disable import/no-anonymous-default-export */
export default {
  title: 'Components/Atoms/Icon',
  component: Icon,
};

const Group = ({ icons }: { icons: string[] }) => {
  return (
    <Flex flexWrap="wrap">
      {icons.map((it) => {
        const Svg = Icon[it as keyof typeof Icon];
        return (
          <div key={it}>
            <Svg m={theme.sizes['6']} fontSize={theme.fontSizes['8']} />
            <Flex>
              <Text
                as="div"
                fontSize="0.5rem"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                w="0"
                flexGrow={1}
                textAlign="center"
              >
                {it.replace('Icon', '')}
              </Text>
            </Flex>
          </div>
        );
      })}
    </Flex>
  );
};

export const Default = () => {
  return (
    <Flex flexDirection="column">
      <Group icons={Object.keys(Icon)} />
    </Flex>
  );
};
