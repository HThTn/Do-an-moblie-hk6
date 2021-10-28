import React, {useEffect, useState, useContext} from 'react';
import {StyleSheet, View, Text, ScrollView, Pressable} from 'react-native';
// import {Button, } from 'react-native-paper';

import 'react-native-gesture-handler';
import TokenContext from '../../Context/TokenContext';
import {apiURL, authUrl} from '../../config/config';

function listClass({navigation}) {
  const token = useContext(TokenContext);
  const [classList, setClassList] = useState([]);

  const show = async () => {
    await fetch(`${apiURL}/subject/lecture`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => res.json())
      .then(async res => {
        await setClassList(res.data);
      });
  };
  useEffect(async () => {
    await show();
    return async () => {
      await setClassList();
    };
  });
  classList.map(item => {
    if (item.faculty === 'e_commerce') {
      item.faculty = 'Thương mại điện thử';
    }
    if (item.faculty === 'information_security') {
      item.faculty = 'An toàn thông tin';
    }
    if (item.faculty === 'data_science') {
      item.faculty = 'Khoa học dữ liệu';
    }
  });
  return (
    <View style={styles.Container}>
      <ScrollView style={styles.NotiView}>
        {classList.map((item, i) => (
          <View key={i} style={styles.NotiText}>
            <Text style={styles.TitleText}>{item.name} </Text>
            <Text style={styles.ContentText}>
              Sỉ số: {item.student_quantity}
            </Text>
            <Text style={styles.ContentText}>Khoa: {item.faculty} </Text>

            <View style={styles.ButtonContainer}>
              <Pressable
                style={styles.button}
                title=" Xem danh sách lớp"
                onPress={async () => {
                  await navigation.navigate('Xem chi tiết', {_id: item._id});
                }}>
                <Text style={styles.textStyle}>Xem chi tiết</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  headerText: {
    position: 'relative',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FEFEFE',
  },
  headerView: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '2.5%',
    backgroundColor: '#4B75F2',
  },
  NotiView: {
    position: 'relative',
    marginVertical: '2%',
  },
  NotiText: {
    marginHorizontal: '2.5%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 30,
    marginVertical: '.5%',
    borderColor: '#BFBFBF',
    flex: 1,
    flexDirection: 'column',
  },
  TitleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ContentText: {
    fontSize: 16,
    color: 'black',
  },
  Notification_date: {
    fontSize: 10,
    color: '#262626',
  },
  ButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    width: 150,
    borderRadius: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default listClass;
