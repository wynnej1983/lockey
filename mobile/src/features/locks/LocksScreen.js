import React, {useState, useEffect, useRef, useMemo} from 'react';
import {ScrollView, StatusBar, Dimensions, Animated} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {createSelector} from 'reselect';
import styled from 'styled-components/native';
import Carousel from 'react-native-snap-carousel';
import Snackbar from 'react-native-snackbar';
import ActionButton from 'react-native-action-button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {debounce} from 'lodash';

import {addFavorite, removeFavorite} from '../favorites/favoritesSlice';
import {fetchLocks, updateLockStatus} from './locksSlice';
import Lock from '../../components/Lock';
import LockedIcon from '../../../assets/icons/locked.png';
import UnlockedIcon from '../../../assets/icons/unlocked.png';

const {width} = Dimensions.get('window');

const AnimatedActionButton = Animated.createAnimatedComponent(ActionButton);

const SafeAreaView = styled.SafeAreaView`
  flex: 1;
  background: #1e1e32;
`;

const Category = styled.Text`
  font-size: 23px;
  line-height: 23px;
  text-align: center;
  color: #ffffff;
  margin-vertical: 10px;
`;

const Info = styled.Text`
  font-size: 15px;
  line-height: 23px;
  text-align: center;
  color: #a2a2aa;
  opacity: 0.8;
  margin-horizontal: 20%;
  margin-vertical: 20px;
`;

const InfoButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  margin-top: 25px;
`;

const InfoButtonText = styled.Text`
  font-size: 15px;
  line-height: 23px;
  text-align: center;
  color: #00aea9;
`;

const LockIcon = styled.Image`
  width: 22px;
  height: 22px;
`;

const LocksScreen = ({
  route: {
    params: {houseId},
  },
}) => {
  const [selectedLock, setSelectedLock] = useState(null);
  const isActionButtonMenuOpenRef = useRef();
  const actionButtonRef = useRef(null);
  const anim = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const {locks} = useSelector((state) => state.locks);
  const selectIsFavorite = useMemo(
    () =>
      createSelector(
        (state) => state.favorites,
        (_, lockId) => lockId,
        (favorites, lockId) =>
          favorites.favorites.some((favorite) => favorite.id === lockId),
      ),
    [selectedLock],
  );
  const isFavorite = useSelector((state) =>
    selectIsFavorite(state, selectedLock?.id),
  );

  useEffect(() => {
    dispatch(fetchLocks(houseId));
  }, []);

  const onChangeLockStatus = async (lockId, lockName, status) => {
    dispatch(updateLockStatus(houseId, lockId, lockName, status));
  };

  const debounceHide = debounce(() => {
    if (!isActionButtonMenuOpenRef.current) {
      actionButtonRef?.current?.reset();
      Animated.spring(anim, {
        toValue: 0,
      }).start();
    }
  }, 5000);

  const onLockSelected = (lock) => {
    setSelectedLock(lock);

    Animated.spring(anim, {
      toValue: 1,
    }).start();

    debounceHide();
  };

  const onActionButtonPress = () => {
    // debounceHide();
  };

  const onAddRemoveFavoritePress = () => {
    debounceHide();
    if (isFavorite) {
      dispatch(removeFavorite(selectedLock));
      Snackbar.show({
        text: `Removed ${selectedLock.name} from favorites`,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#00aea9',
        action: {
          text: 'OK',
          textColor: '#ffffff',
        },
      });
    } else {
      dispatch(addFavorite(selectedLock));
      Snackbar.show({
        text: `Added ${selectedLock.name} to favorites`,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: '#00aea9',
        action: {
          text: 'OK',
          textColor: '#ffffff',
        },
      });
    }
  };

  const renderCarousel = (category) => (
    <Carousel
      data={locks.filter((lock) => lock.category === category)}
      renderItem={({item}) => (
        <Lock
          {...item}
          onChangeStatus={onChangeLockStatus}
          onPress={() => onLockSelected(item)}
        />
      )}
      layout={'stack'}
      layoutCardOffset={100}
      sliderWidth={width || 375}
      itemWidth={210}
    />
  );

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <ScrollView>
          <Info>Stay pressed on the button to unlock or lock the doors</Info>
          <Category>House</Category>
          {renderCarousel('house')}
          <Category>Room</Category>
          {renderCarousel('room')}
          <Info>
            If there's an issue, first check if someone's home by ringing the
            bell. Still locked out?
          </Info>
          <InfoButton onPress={() => console.log('call manager pressed')}>
            <InfoButtonText>Call your community manager</InfoButtonText>
          </InfoButton>
        </ScrollView>
        <AnimatedActionButton
          ref={actionButtonRef}
          onPress={onActionButtonPress}
          buttonColor={'#ffb74d'}
          offsetX={anim.interpolate({
            inputRange: [0, 1],
            outputRange: [-60, 30], // 0 : 150, 0.5 : 75, 1 : 0
          })}>
          <ActionButton.Item
            buttonColor="#1abc9c"
            textContainerStyle={{
              backgroundColor: 'black',
              borderWidth: 0,
              padding: 10,
            }}
            textStyle={{color: '#fff', fontSize: 12}}
            spaceBetween={10}
            title={
              selectedLock?.status === 'locked'
                ? `Unlock ${selectedLock?.name}`
                : `Lock ${selectedLock?.name}`
            }
            onPress={() =>
              onChangeLockStatus(
                selectedLock.id,
                selectedLock.name,
                selectedLock.status === 'locked' ? 'unlocked' : 'locked',
              )
            }>
            <LockIcon
              source={
                /^(unlocked|locking)$/.test(selectedLock?.status)
                  ? LockedIcon
                  : UnlockedIcon
              }
              resizeMode={'contain'}
            />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#1abc9c"
            textContainerStyle={{
              backgroundColor: 'black',
              borderWidth: 0,
              padding: 10,
            }}
            textStyle={{color: '#fff', fontSize: 12}}
            spaceBetween={10}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onPress={onAddRemoveFavoritePress}>
            <Ionicons
              name="md-heart"
              style={{
                fontSize: 20,
                height: 22,
                color: 'white',
              }}
            />
          </ActionButton.Item>
        </AnimatedActionButton>
      </SafeAreaView>
    </>
  );
};

export default LocksScreen;
