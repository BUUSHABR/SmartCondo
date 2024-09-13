import AsyncStorage from '@react-native-async-storage/async-storage';

export function fetchUser() {
  return new Promise(async resolve => {
    let data = await AsyncStorage.getItem('user');

    if (data) {
      let parsedData = JSON.parse(data).data;

      resolve(parsedData);
    }
  });
}
