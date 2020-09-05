import React, {useEffect} from 'react';
import {StatusBar, Dimensions} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import styled from 'styled-components/native';

import {fetchFavorites} from './favoritesSlice';
import {updateLockStatus} from '../locks/locksSlice';
import Lock from '../../components/Lock';

const {width} = Dimensions.get('window');

const SafeAreaView = styled.SafeAreaView`
  flex: 1;
  background: #1e1e32;
`;

const FavoritesScreen = () => {
  const dispatch = useDispatch();
  const {favorites} = useSelector((state) => {
    return state.favorites;
  });
  useEffect(() => {
    dispatch(fetchFavorites());
  }, []);

  const onChangeLockStatus = (houseId, lockId, lockName, status) => {
    dispatch(updateLockStatus(houseId, lockId, lockName, status));
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <Carousel
          data={favorites}
          renderItem={({item}) => (
            <Lock
              {...item}
              onChangeStatus={(lockId, lockName, status) =>
                onChangeLockStatus(item.houseId, lockId, lockName, status)
              }
            />
          )}
          layout={'default'}
          sliderWidth={width}
          itemWidth={210}
        />
      </SafeAreaView>
    </>
  );
};

export default FavoritesScreen;
