import React, {useEffect, useState, Component} from 'react';
import {View, ToastAndroid, SafeAreaView} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

import {Checkbox} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {authUrl} from '../../config/config';
import styles from '../../style/style';

import TextInput from '../../components/TextInput';
import Password from '../../components/Password';
import Text from '../../components/Text';
const img = require('../../../assets/public/img/online-course.png');
import SubmitButton from '../../components/SubmitButton';
import {mainWhite} from '../../style/color';

export default Login = ({token, setToken}) => {
  const [account, setAccount] = useState({phone: '', password: ''});
  const [error, setError] = useState({phone: false, password: false});
  const [isLoading, SetIsLoading] = useState(false);
  const [savePassword, setSavePassword] = useState(false);

  useEffect(async () => {
    let data = await getPassword();
    if (data) {
      setSavePassword(true);
      setAccount({phone: data.phone, password: data.password});
    }
  }, []);
  useEffect(async () => {
    await handlerSavePassword();
  }, [account]);
  useEffect(async () => {
    await handlerSavePassword();
  }, [savePassword]);
  const handlerSavePassword = async () => {
    if (savePassword) {
      await storagePassword(JSON.stringify(account));
    } else {
      await storagePassword('');
    }
  };
  const onLoginPress = async () => {
    await SetIsLoading(true);

    try {
      await fetch(authUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: account.phone,
          password: account.password,
        }),
      })
        .then(async res => {
          return await res.json();
        })
        .then(async res => {
          await SetIsLoading(false);

          if (res.error == 4000) {
            return setError(res.messages);
          }
          if (res.error == 7000) {
            return setError({
              messages: 'Tài khoản hoặc mật khẩu không chính xác',
            });
          }
          await setError({phone: false, password: false});
          setToken(res.data.token);
          return await SetIsLoading(false);
        });
    } catch (err) {
      console.log('Login error: ', err);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: mainWhite}}>
      <View
        style={{
          height: '40%',
          borderBottomLeftRadius: 120,
          backgroundColor: '#0598FC',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <Icon name="user-cog" size={56} color="#FFFFFF" />
      </View>
      <View style={{flex: 1, marginTop: 50}}>
        <View style={styles.container}>
          <View style={{width: '85%', marginBottom: 20}}>
            <View style={{marginBottom: 15}}>
              <TextInput
                style={{borderRadius: 30}}
                shadow={1}
                isFocus={true}
                placeholder="Tên đăng nhập"
                value={account.phone}
                onChangeText={val => setAccount({...account, phone: val})}
                leftIcon="user"
                errorMessage={error.phone}
              />
            </View>
            <View style={{marginBottom: 10}}>
              <Password
                isFocus={true}
                shadow={1}
                style={{marginTop: 10}}
                value={account.password}
                onChangeText={val => setAccount({...account, password: val})}
                errorMessage={error.password}
              />
              {error.messages && (
                <Text size={14} style={styles.textErr}>
                  {error.messages}
                </Text>
              )}
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                marginLeft: 5,
              }}>
              <Checkbox
                status={savePassword ? 'checked' : 'unchecked'}
                onPress={() => setSavePassword(!savePassword)}
                color="#0598FC"
              />
              <Text>Nhớ mật khẩu</Text>
            </View>
          </View>
          <SubmitButton
            isProcessing={isLoading}
            onPress={() => onLoginPress()}
            textProcessing="Đang xử lý...">
            Đăng nhập
          </SubmitButton>

          <View
            style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
            <Text>Ứng dụng quản lý học vụ</Text>
            <Text size={12}> Lecture v1.0</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
const storagePassword = async data => {
  try {
    await AsyncStorage.setItem('account', data);
  } catch (err) {
    console.log('Save Error: ', err);
  }
};

const getPassword = async () => {
  let data = '';
  try {
    data = await AsyncStorage.getItem('account');
    return data != null ? JSON.parse(data) : null;
  } catch (err) {
    console.log('Read Error: ', err);
  }
};
