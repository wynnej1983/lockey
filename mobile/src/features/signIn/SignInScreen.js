import React, {useState, useEffect} from 'react';
import {TouchableOpacity, StatusBar, Animated, Easing} from 'react-native';
import styled from 'styled-components/native';
import LottieView from 'lottie-react-native';
import TouchID from 'react-native-touch-id';
import Snackbar from 'react-native-snackbar';

import {delay} from '../../utils';

const SafeAreaView = styled.SafeAreaView`
  flex: 1;
  background: #1e1e32;
  justify-content: center;
`;

const Info = styled.Text`
  font-size: 21px;
  text-align: center;
  color: #a2a2aa;
  opacity: 0.8;
  margin-bottom: 300px;
`;

const SkipButton = styled.Text`
  font-size: 15px;
  line-height: 23px;
  text-align: center;
  color: #00aea9;
`;

const SignInScreen = ({route}) => {
  const {onSignIn} = route.params;
  const [authSuccess, setAuthSuccess] = useState(false);
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, {
      useNativeDriver: true,
      toValue: 0.1,
      duration: 3000,
      delay: 1000,
      easing: Easing.linear,
    }).start(async () => {
      try {
        const biometryType = await TouchID.isSupported({
          unifiedErrors: false,
          passcodeFallback: false,
        });
        if (biometryType === 'FaceID') {
          console.log('FaceID is supported.');
        } else {
          console.log('TouchID is supported.');
        }
        Animated.timing(progress, {
          useNativeDriver: true,
          toValue: 0.5,
          duration: 3000,
          easing: Easing.linear,
        }).start();
        await TouchID.authenticate('Lockey auth', {
          title: 'Authentication Required', // Android
          imageColor: '#e00606', // Android
          imageErrorColor: '#ff0000', // Android
          sensorDescription: 'Touch sensor', // Android
          sensorErrorDescription: 'Failed', // Android
          cancelText: 'Cancel', // Android
          fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
          unifiedErrors: true, // use unified error messages (default false)
          passcodeFallback: true, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
        });
        // await delay(3000);
        setAuthSuccess(true);
        await delay(600);
        onSignIn();
      } catch (err) {
        Snackbar.show({
          text: err.message,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: '#00aea9',
          action: {
            text: 'OK',
            textColor: '#fbd042',
          },
        });
      }
    });
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <Info>Scan your fingerprint to login</Info>
        {authSuccess ? (
          <LottieView
            source={require('../../../assets/lottie/success.json')}
            autoPlay
            loop={false}
          />
        ) : (
          <LottieView
            progress={progress}
            source={require('../../../assets/lottie/fingerprint.json')}
          />
        )}
        <TouchableOpacity onPress={onSignIn}>
          <SkipButton>Skip</SkipButton>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

export default SignInScreen;
