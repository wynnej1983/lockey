import React, {useState, useEffect} from 'react';
import {TouchableHighlight} from 'react-native';
import styled from 'styled-components/native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

import {lockStateMachine} from '../../utils';
import {LOCK_TIMEOUT} from '../../config';
import LockedIcon from '../../../assets/icons/locked.png';
import UnlockedIcon from '../../../assets/icons/unlocked.png';

const Container = styled.View`
  width: 187px;
  height: 187px;
  border-radius: ${187 / 2}px;
  background: ${(props) =>
    /^(unlocked|locking)$/.test(props.status) ? '#183b4a' : '#00aea9'};
  justify-content: center;
  align-items: center;
`;

const Name = styled.Text`
  font-family: Montserrat-Medium;
  font-weight: 600;
  font-size: 21px;
  text-align: center;
  color: #ffffff;
`;

const Status = styled.Text`
  font-size: 15px;
  text-align: center;
  color: #ffffff;
  opacity: 0.8;
  text-transform: capitalize;
`;

const Icon = styled.Image`
  width: 34px;
  height: 34px;
  margin-bottom: 10px;
`;

const Lock = ({id: lockId, name, onPress, onChangeStatus, ...props}) => {
  const [status, setStatus] = useState(props.status);
  useEffect(() => {
    setStatus(props.status);
  }, [props.status]);

  const onLockPressIn = async () => {
    if (status === 'offline') {
      return;
    }
    const transitionStatus = lockStateMachine(status).next();
    setStatus(transitionStatus);
    const nextStatus = lockStateMachine(transitionStatus).next();
    onChangeStatus(lockId, name, nextStatus);
  };
  const onLockPressOut = () => {
    if (/^locking|unlocking$/.test(status)) {
      setStatus(lockStateMachine(status).prev());
    }
  };

  return (
    <AnimatedCircularProgress
      size={214}
      width={4}
      backgroundWidth={2}
      rotation={0}
      fill={/^(unlocked|locked|offline)$/.test(status) ? 0 : 100}
      lineCap={'round'}
      backgroundColor={'#474757'}
      tintColor={'#00AEA9'}
      duration={/^(unlocked|locked|offline)$/.test(status) ? 0 : LOCK_TIMEOUT}>
      {() => (
        <TouchableHighlight
          activeOpacity={0.9}
          underlayColor={'none'}
          onPress={onPress}
          onLongPress={onLockPressIn}
          onPressOut={onLockPressOut}>
          <Container status={status}>
            <Icon
              source={
                /^(unlocked|locking)$/.test(status) ? UnlockedIcon : LockedIcon
              }
              resizeMode={'contain'}
            />
            <Name>{name}</Name>
            <Status>{status}</Status>
          </Container>
        </TouchableHighlight>
      )}
    </AnimatedCircularProgress>
  );
};

export default Lock;
