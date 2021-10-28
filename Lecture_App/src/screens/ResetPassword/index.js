import React, {useState} from 'react';
import {StyleSheet, View, Text, KeyboardAvoidingView} from 'react-native';
import {resetPasswordValidator} from '../../helpers/resetPasswordValidator';
import {checkNewPasswordValidator} from '../../helpers/checkNewPasswordValidator';
import {passwordValidator} from '../../helpers/passwordValidator';

import {TextInput, Button} from 'react-native-paper';
export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  let [error, setError] = useState({
    newPassword: false,
    password: false,
    reNewPassword: false,
  });
  const onLoginPress = e => {
    e.preventDefault();
    setError({
      password: passwordValidator(password),
      newPassword: resetPasswordValidator(newPassword, password),
      reNewPassword: checkNewPasswordValidator(reNewPassword, newPassword),
    });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.headerView}>
        <Text style={styles.headerText}>Thay đổi mật khẩu</Text>
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={[
            {marginTop: 8},
            styles.input,
            {borderColor: !error.password ? '#E9EEF4' : '#ED557A'},
          ]}
          placeholder="Mật khẩu hiện tại"
          secureTextEntry={true}
          label="Mật khẩu hiện tại"
          onChangeText={text => setPassword(text)}
        />
        <Text style={{color: '#ED557A', paddingLeft: 10}}>
          {!error.password ? null : error.password}
        </Text>
        <TextInput
          style={[
            {marginBottom: 8},
            styles.input,
            {borderColor: !error.newPassword ? '#E9EEF4' : '#ED557A'},
          ]}
          placeholder="Mật khẩu mới"
          selectionColor="#f13a59"
          secureTextEntry={true}
          label="Mật khẩu mới"
          onChangeText={text => {
            setNewPassword(text);
          }}
        />
        <Text style={{color: '#ED557A', paddingLeft: 10}}>
          {!error.newPassword ? null : error.newPassword}
        </Text>
        <TextInput
          style={[
            {marginBottom: 8},
            styles.input,
            {borderColor: !error.reNewPassword ? '#E9EEF4' : '#ED557A'},
          ]}
          placeholder="Nhập lại mật khẩu mới"
          selectionColor="#f13a59"
          secureTextEntry={true}
          label="Xác nhận mật khẩu mới"
          onChangeText={text => {
            setReNewPassword(text);
          }}
        />
        <Text style={{color: '#ED557A', paddingLeft: 10}}>
          {!error.reNewPassword ? null : error.reNewPassword}
        </Text>
      </View>
      <Button style={styles.button} onPress={onLoginPress} mode="contained">
        Xác nhận
      </Button>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  image: {
    width: 24,
    height: 24,
  },
  headerText: {
    position: 'relative',
    fontSize: 20,
  },
  headerView: {
    position: 'relative',
    top: 10,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputView: {
    position: 'relative',
    width: '90%',
    marginTop: 120,
    marginBottom: 50,
  },
  input: {
    position: 'relative',
    padding: 10,
    backgroundColor: '#F8FAFD',
    borderWidth: 1,
    borderRadius: 10,
  },
  button: {
    width: '80%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
});
