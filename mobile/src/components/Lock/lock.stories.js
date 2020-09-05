import React from 'react';
import styled from 'styled-components/native';
import {storiesOf} from '@storybook/react-native';

import Lock from '.';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: #1e1e32;
`;

storiesOf('Lock', module)
  .addDecorator((getStory) => <Container>{getStory()}</Container>)
  .add('Unlocked', () => <Lock name={'House'} status={'unlocked'} />)
  .add('Locked', () => <Lock name={'House'} status={'locked'} />);
