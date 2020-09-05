import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {Provider, useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import store from './src/app/store';
import SignInScreen from './src/features/signIn/SignInScreen';
import HousesScreen from './src/features/houses/HousesScreen';
import LocksScreen from './src/features/locks/LocksScreen';
import FavoritesScreen from './src/features/favorites/FavoritesScreen';
import {fetchFavorites} from './src/features/favorites/favoritesSlice';
import {fetchHouses} from './src/features/houses/housesSlice';
import BackArrowIcon from './assets/icons/back.png';

const BackArrow = styled.Image`
  width: 20px;
  height: 15px;
  margin-left: 20px;
`;

const options = {
  headerStyle: {
    backgroundColor: '#1e1e32',
    borderBottomWidth: 0,
    shadowOffset: {height: 0, width: 0},
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 15,
    fontWeight: '600',
  },
  headerBackTitleVisible: false,
  headerBackImage: () => <BackArrow source={BackArrowIcon} />,
};

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const HomeTabs = () => {
  const dispatch = useDispatch();
  const onHomeTabPress = () => dispatch(fetchHouses());
  const onFavoritesTabPress = () => dispatch(fetchFavorites());

  return (
    <Tab.Navigator
      initialRouteName="Houses"
      activeColor="#00aea9"
      inactiveColor="#a2a2aa"
      barStyle={{backgroundColor: '#29293c'}}
      style={{backgroundColor: '#29293c'}}>
      <Tab.Screen
        name="Houses"
        component={HousesScreen}
        listeners={{
          tabPress: onHomeTabPress,
        }}
        options={{
          tabBarLabel: 'Houses',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        listeners={{
          tabPress: onFavoritesTabPress,
        }}
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="heart" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const onSignIn = () => setIsSignedIn(true);

  return (
    <Provider store={store}>
      <NavigationContainer>
        {isSignedIn ? (
          <Stack.Navigator screenOptions={options}>
            <Stack.Screen name="Houses" component={HomeTabs} />
            <Stack.Screen
              name="Locks"
              component={LocksScreen}
              options={({route}) => ({title: route.params.houseName})}
            />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator screenOptions={options}>
            <Stack.Screen
              name="Login"
              component={SignInScreen}
              initialParams={{onSignIn}}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </Provider>
  );
};

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
