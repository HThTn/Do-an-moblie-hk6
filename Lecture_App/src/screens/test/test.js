import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Button,
  Text,
} from 'react-native';
import RNFS from 'react-native-fs';
import TokenContext from '../../Context/TokenContext';
import {Picker} from '@react-native-picker/picker';
import {apiURL, yearList} from '../../config/config';
const test = () => {
  const [lop, setLop] = useState('IS336.L11');
  const token = useContext(TokenContext);
  const [text, onChangeText] = React.useState('');
  const [mon, setMon] = useState('');
  const [listSub, setListSub] = useState([]);
  useEffect(async () => {
    await fetch(`${apiURL}/subject/lecture`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => res.json())
      .then(res => {
        setListSub(res.data);
      });
  });
  return (
    <View style={styles.Container}>
      <View style={styles.createNoti}>
        <Text style={styles.text}>Lớp</Text>
        <Picker
          style={{width: '60%'}}
          selectedValue={lop}
          onValueChange={(item, index) => {
            setLop(item);
          }}>
          <Picker.Item label="IS336.L11" value="IS336.L11" />
          <Picker.Item label="IS336.L12" value="IS336.L12" />
        </Picker>
      </View>
      <View style={styles.createNoti}>
        <Text>Loại thông báo</Text>
        <Picker
          style={{width: '60%'}}
          selectedValue={mon}
          onValueChange={(item, index) => {
            setMon(item);
          }}></Picker>
        {listSub.map((item, i) => {
          <View>
            <Text>{item.name}</Text>
          </View>;
        })}
      </View>
      <View>
        <Text style={styles.text}>Nội dung</Text>
        <View style={styles.content}>
          <TextInput onChangeText={onChangeText} value={text} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  headerText: {
    position: 'relative',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  headerView: {
    // position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '3.5%',
    // backgroundColor: '#4B75F2',
    flexDirection: 'row',
  },
  createNoti: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  createNoti1: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  imageBack: {
    height: 40,
    width: 40,
  },
  text: {
    paddingTop: 20,
    paddingLeft: 10,
  },
  buttonContainer: {
    padding: 50,
  },
  input: {
    height: 20,
    margin: 12,
    borderWidth: 1,
    borderRadius: 15,
  },
});
export default test;
