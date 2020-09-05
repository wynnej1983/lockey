import React, {useEffect, useCallback} from 'react';
import {StatusBar, FlatList} from 'react-native';
import {useStore, useSelector, useDispatch} from 'react-redux';
import Config from 'react-native-config';
import io from 'socket.io-client';
import styled from 'styled-components/native';

import {fetchHouses} from './housesSlice';
import {updateLockStatus} from '../locks/locksSlice';

const {API_URL} = Config;

const Card = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: #00aea9;
  height: 150px;
  padding: 5px;
  margin: 5px;
  border-radius: 5px;
`;

const CardContent = styled.Text`
  text-align: center;
  color: #ffffff;
  font-family: Montserrat-Medium;
  font-size: 25px;
  font-weight: 600;
`;

const CardFooter = styled.Text`
  text-align: center;
  color: #ffffff;
  font-family: Montserrat-Medium;
  font-size: 15px;
  opacity: 0.8;
`;

const SafeAreaView = styled.SafeAreaView`
  flex: 1;
  background: #1e1e32;
`;

const HousesScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const store = useStore();
  const {houses} = useSelector((state) => state.houses);

  const onLockStatusChanged = useCallback((updatedLock) => {
    const {id, name, houseId, status} = updatedLock;
    const {locks, favorites} = store.getState();
    if (
      locks.locks.some((lock) => lock.id === id && lock.status !== status) ||
      favorites.favorites.some(
        (favorite) => favorite.id === id && favorite.status !== status,
      )
    ) {
      dispatch(updateLockStatus(houseId, id, name, status, true));
    }
  }, []);

  useEffect(() => {
    dispatch(fetchHouses());
    const socket = io(API_URL.replace('/api/v1', ''));
    socket.on('/lock/status', onLockStatusChanged);
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <FlatList
          data={houses}
          numColumns={2}
          renderItem={({item}) => (
            <Card
              onPress={() =>
                navigation.navigate('Locks', {
                  houseId: item.id,
                  houseName: item.name,
                })
              }
              {...item}>
              <CardContent>{item.name}</CardContent>
              <CardFooter>{item.numLocks} locks</CardFooter>
            </Card>
          )}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    </>
  );
};

export default HousesScreen;
