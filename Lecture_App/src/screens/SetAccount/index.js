import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
import {
  passwordValidator,
  retypePassValidator,
} from '../../helpers/passwordValidator';
import {usernameValidator} from '../../helpers/usernameValidator';
import {RadioButton} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
export default Login = ({token, setToken}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [retypePass, setRetypePass] = useState('');
  const [role, setRole] = useState('');
  const [khoa, setKhoa] = useState('TMDT');
  let [error, setError] = useState({
    username: false,
    password: false,
    retypePass: false,
  });
  const onLoginPress = e => {
    e.preventDefault();
    setError({
      username: usernameValidator(username),
      password: passwordValidator(password),
      retypePass: retypePassValidator(password, retypePass),
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.headerView}>
        <Text style={styles.headerText}>Thêm tài khoản</Text>
      </View>
      <View style={styles.inputLoginView}>
        <TextInput
          style={[
            {marginBottom: 8},
            styles.input,
            {borderColor: !error.username ? '#E9EEF4' : '#ED557A'},
          ]}
          placeholder="Username"
          selectionColor="#f13a59"
          onChangeText={text => {
            setUsername(text);
          }}
        />
        <Text style={{color: '#ED557A', paddingLeft: 10}}>
          {!error.username ? null : error.username}
        </Text>
        <TextInput
          style={[
            {marginTop: 8},
            styles.input,
            {borderColor: !error.password ? '#E9EEF4' : '#ED557A'},
          ]}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
        />
        <Text style={{color: '#ED557A', paddingLeft: 10}}>
          {!error.password ? null : error.password}
        </Text>
        <TextInput
          style={[
            {marginTop: 8},
            styles.input,
            {borderColor: !error.password ? '#E9EEF4' : '#ED557A'},
          ]}
          placeholder="Retype password"
          secureTextEntry={true}
          onChangeText={text => setRetypePass(text)}
        />
        <Text style={{color: '#ED557A', paddingLeft: 10}}>
          {!error.retypePass ? null : error.retypePass}
        </Text>
        <RadioButton.Group onValueChange={value => setRole(value)} value={role}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{width: 50}}>Role</Text>

            <View stye={styles.radioButton}>
              <Text>Sinh viên</Text>
              <RadioButton value="SV" />
            </View>
            <View stye={styles.radioButton}>
              <Text>Giảng viên</Text>
              <RadioButton value="GV" />
            </View>
            <View stye={styles.radioButton}>
              <Text>Admin</Text>
              <RadioButton value="AD" />
            </View>
          </View>
        </RadioButton.Group>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{width: 50}}>Khoa</Text>
          <Picker
            style={{width: '80%'}}
            selectedValue={khoa}
            onValueChange={(item, index) => {
              setKhoa(item);
            }}>
            <Picker.Item label="TMDT" value="TMDT" />
            <Picker.Item label="HTTT" value="HTTT" />
          </Picker>
        </View>
      </View>
      <Button
        style={styles.button}
        title="Thêm tài khoản"
        onPress={onLoginPress}
      />
    </KeyboardAvoidingView>
  );
};

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
  inputLoginView: {
    position: 'relative',
    width: '90%',
    marginTop: 90,
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
    position: 'relative',
  },
  radioButton: {
    position: 'relative',
    marginLeft: 10,
  },
});
