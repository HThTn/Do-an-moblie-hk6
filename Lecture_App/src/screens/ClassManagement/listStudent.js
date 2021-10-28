import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import Image1 from '../../asset/avt.png';
import TokenContext from '../../Context/TokenContext';
import {apiURL, authUrl} from '../../config/config';

function listStudent({route, navigation}) {
  const {_id} = route.params;
  const [info, setInfo] = useState({
    student_quantity: 0,
    status: '',
    _id: '',
    name: '',
    faculty: '',
    subject_code: '',
    schedule: [
      {
        _id: '',
        weekday: '',
        from: 0,
        to: 0,
      },
    ],
    lecture_id: '',
  });
  const token = useContext(TokenContext);
  const show = async () => {
    await fetch(`${apiURL}/subject/lecture/${_id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => res.json())
      .then(res => {
        setInfo(res.data);
      });
  };
  useEffect(async () => {
    await show();
    return async () => {
      await setInfo();
    };
  }, []);
  info.schedule.map((item, index) => {
    if (item.weekday == 'monday') {
      item.weekday = 'Thứ hai';
    }
    if (item.weekday == 'tuesday') {
      item.weekday = 'Thứ ba';
    }
    if (item.weekday == 'wednesday') {
      item.weekday = 'Thứ tư';
    }
    if (item.weekday == 'thursday') {
      item.weekday = 'Thứ năm';
    }
    if (item.weekday == 'friday') {
      item.weekday = 'Thứ sáu';
    }
    if (item.weekday == 'saturday') {
      item.weekday = 'Thứ bảy';
    }
  });
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container1}>
        <View style={styles.headerView}>
          <Text style={styles.headerText}>{info.name}</Text>
        </View>
        <View style={styles.ContentText}>
          <View style={styles.SubContentText}>
            <Text style={styles.lable}>Mã môn học:</Text>
            <Text style={styles.textx}>{info.subject_code}</Text>
          </View>
          <View style={styles.SubContentText}>
            <Text style={styles.lable}>Khoa quản lý:</Text>
            <Text style={styles.textx}>{info.faculty}</Text>
          </View>
          <View style={styles.SubContentText}>
            <Text style={styles.lable}>Sỉ số:</Text>
            <Text style={styles.textx}>{info.student_quantity}</Text>
          </View>
          <View style={styles.SubContentText}>
            <Text style={styles.lable}>Lịch học:</Text>
            <Text style={styles.textx}></Text>
          </View>
          <ScrollView>
            {info.schedule.map((item, index) => {
              return (
                <View key={index} style={styles.SubContentText}>
                  <Text style={styles.lable}>{item.weekday}</Text>
                  <Text style={styles.textx}>
                    Từ {item.from}h đến {item.to}h
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    // paddingHorizontal: 5,
    // alignItems: 'center',
  },
  container1: {
    // flex: 1,
    paddingVertical: 10,
    // paddingHorizontal: 5,
    alignItems: 'center',
  },
  headerText: {
    position: 'relative',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  headerView: {
    marginVertical: 5,
    paddingVertical: 20,
    paddingHorizontal: 0,
    width: '90%',
    backgroundColor: '#FEFEFE',
    borderRadius: 15,
    shadowRadius: 15,
    shadowColor: '#BFBFBF',
    marginTop: 30,
    alignItems: 'center',
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
    flexDirection: 'row',
  },
  TitleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ContentText: {
    marginVertical: 5,
    paddingVertical: 20,
    paddingHorizontal: 0,
    width: '90%',
    backgroundColor: '#FEFEFE',
    borderRadius: 15,
    shadowRadius: 15,
    shadowColor: '#BFBFBF',
    marginTop: 30,
  },
  SubContentText: {
    justifyContent: 'space-around',
    fontSize: 15,
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: '2%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // flex: 1,
    // flexDirection: 'row',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  lable: {
    flex: 1,
    marginLeft: 30,
    fontSize: 16,
  },
  textx: {
    flex: 1,
    fontSize: 16,
  },
});
export default listStudent;
