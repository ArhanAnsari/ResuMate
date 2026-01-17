import { LogBox } from 'react-native';

if (__DEV__) {
  const ignoreWarns = [
    'SafeAreaView has been deprecated',
  ];

  const warn = console.warn;
  console.warn = (...arg) => {
    for (const warning of ignoreWarns) {
      if (typeof arg[0] === 'string' && arg[0].includes(warning)) {
        return;
      }
    }
    warn(...arg);
  };

  LogBox.ignoreLogs(ignoreWarns);
}
