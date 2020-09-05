import Config from 'react-native-config';

const root =
  Config.IS_STORYBOOK === 'true' ? require('./storybook') : require('./App');

export default root;