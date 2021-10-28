import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Button,
  Image,
  Pressable,
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import {Avatar} from 'react-native-paper';
import Image1 from '../../asset/avt.jpg';
import TokenContext from '../../Context/TokenContext';
import {apiURL} from '../../config/config';
import {TextInput} from 'react-native-paper';
import {Input} from 'react-native-elements';
import Toast from 'react-native-toast-message';
import SetTokenContext from '../../Context/SetTokenContext';
export default function Subject({route, navigation}) {
  const token = useContext(TokenContext);
  const [allSubject,setAllSubject]= useState([]);
  const [mySubject,setMySubject]= useState([]);
  const [rSubject,setRSubject]= useState([]);
  const [cSubject,setCSubject]= useState([]);
  const [myIndex,setMyIndex]= useState([]);
  const getAllSubject = async () => {
    
    await fetch(`${apiURL}/subject/student/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => res.json())
      .then(res => {
        setAllSubject(res.data);   
      }).then(getMySubject());
  };
  const getMySubject = async () => {
    await fetch(`${apiURL}/schedule/student/`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => res.json())
      .then(res => {
        setMySubject(res.data.subject_ids);
        let data = [];
        res.data.subject_ids.forEach(element => {
          const t =allSubject.findIndex(x => x.id == element);
          if(t != -1)
          data = data.concat(t);
        });  
        setMyIndex(data);      
      });
  };
  const reload = async () =>{
    getAllSubject();
    getMySubject();
  }
  useEffect(async () => {
    await reload();
  }, []);
  // // const getMyIndex = () => {
  // //   let data = [];
  // //     mySubject.forEach(element => {
  // //       data = data.concat(allSubject.findIndex(x => x.id == element))
  // //     });
  // //   return data;
  // // }
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      await getAllSubject();
      setCSubject(Array(mySubject.length).fill(false));
      setRSubject(Array(allSubject.length).fill(false));        
    });
    return () => {
      unsubscribe;      
      setCSubject(Array(mySubject.length).fill(false));
      setRSubject(Array(allSubject.length).fill(false));
    }
  }, [navigation]);
  // console.log(mySubject,myIndex);
  async function  Register (i ={i}) {
      await fetch(`http://quocha.xyz/api/subject/student/register/${allSubject[i].id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
        .then(res => res.json())
        .then(res => {
          if (res.statusCode === 200) {
            Toast.show({
              type: 'success',
              position: 'top',
              text1: `Đăng ký môn ${allSubject[i].subject_code} thành công `,
              visibilityTime: 800,
              autoHide: true,
            });

          } else {
            Toast.show({
              type: 'error',
              position: 'top',
              text1: `Đăng ký môn ${allSubject[i].subject_code} thất bại `,
              text2: res.message,
              autoHide: true,
              visibilityTime: 800,
            });

          }
        }).then(reload());

  };
  async function Cancel (id = {id}) {
    const i = allSubject.findIndex(x => x.id == id)
      await fetch(`http://quocha.xyz/api/subject/student/Cancel/${allSubject[i].id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
        .then(res => res.json())
        .then(res => {  
          if (res.statusCode === 200) {
            Toast.show({
              type: 'success',
              position: 'top',
              text1: `Hủy môn ${allSubject[i].subject_code} thành công `,
              visibilityTime: 800,
              autoHide: true,
            });

          } else {
            Toast.show({
              type: 'error',
              position: 'top',
              text1: `Đăng môn ${allSubject[i].subject_code} thất bại `,
              text2: res.message,
              visibilityTime: 800,
            });
          }
        }).then(reload());
  };
  async function xRegister() {
    for( let i=0; i < rSubject.length; i++)
    {
      if(rSubject[i]){
        await Register(i);
      }
    }
    setRSubject(Array(allSubject.length).fill(false));
    await getMySubject(); 
  }
  async function xCancel() {
    for( let i=0; i < cSubject.length; i++)
    {
      if(cSubject[i]){
        await Cancel(id = mySubject[i]);
      }
    }
    setCSubject(Array(mySubject.length).fill(false));
    await getMySubject();
  }
  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.inforView}>
        <View style={[styles.ContentText,{height:"50%"}]}>
          <View style={styles.NotiView, {flexDirection: 'row',justifyContent: 'space-between',paddingVertical: 7.5, marginHorizontal: 10}}>
                <Text style={{fontWeight:'bold', fontSize: 18}}>Danh sách môn học đã đăng kí</Text>
                <TouchableOpacity
                    style={styles.pressable}
                    onPress={() => {xCancel()}}>
                    <Text style={styles.textStyle}>Hủy môn</Text>
                </TouchableOpacity>
          </View>
          <ScrollView style ={{height:"50%"}}>
          {myIndex.map((item,i) => (
            <View key = {i}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Checkbox
                status={cSubject[i] ? 'checked' : 'unchecked'}
                onPress={() => {const X=[...cSubject]; X[i] = !cSubject[i]; setCSubject(X)}}
              />
              {/* <Text>{allSubject[].subject_code}</Text> */}
              <Text style= {{width:'25%'}}>{allSubject[item].subject_code}</Text>
              <Text style= {{width: '42%'}}>{allSubject[item].name}</Text>
              <Text style= {{width: '33%'}}>{allSubject[item].faculty}</Text>
            </View>
          ))}
          </ScrollView>
        </View>
        <View style={[styles.ContentText,{height:"50%"}]}>
          <View style={styles.NotiView, {flexDirection: 'row',justifyContent: 'space-between',paddingVertical: 7.5, marginHorizontal: 10}}>
                <Text style={{fontWeight:'bold', fontSize: 18}}>Đăng ký môn học</Text>
                <TouchableOpacity
                    style={styles.pressable}
                    onPress={() => {xRegister()}}>
                    <Text style={styles.textStyle}>Đăng ký</Text>
                </TouchableOpacity>
          </View>
          <ScrollView style ={{height:"50%"}}>
          {allSubject.map((item,i) => (
            <View key = {i}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                {myIndex.findIndex(ix => ix == i) === -1 ? (
                <Checkbox
                status={rSubject[i] ? 'checked' : 'unchecked'}
                onPress={() => {const X=[...rSubject]; X[i] = !rSubject[i];setRSubject(X)}}
                />):(
                <Checkbox
                  status={rSubject[i] ? 'checked' : 'unchecked'} disabled = {true}
                  onPress={() => {const X=[...rSubject]; X[i] = !rSubject[i];setRSubject(X)}}
                />)}
              
              <Text style= {{width:'25%'}}>{item.subject_code}</Text>
              <Text style= {{width: '42%'}}>{item.name}</Text>
              <Text style= {{width: '33%'}}>{item.faculty}</Text>
            </View>
          ))}
          </ScrollView>
        </View>
      </View>
      <Toast ref={ref => Toast.setRef(ref)} />   
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 5,
    // paddingHorizontal: 5,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#BFBFBF',
  },
  inforView: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '2%',
    height:'100%'
  },
  avatar: {
    borderWidth: 1,
    borderRadius: 70,
    borderColor: '#BFBFBF',
    marginTop: 30,
  },
  inforText: {
    marginHorizontal: '2.5%',
    marginVertical: '.5%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEFEFE',
    borderRadius: 15,
    width: '90%',
  },
  TitleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  SubTitleText: {
    fontSize: 15,
    color: 'black',
    marginBottom: 15,
    marginTop: 5,
  },
  ContentText: {
    marginVertical: 5,
    paddingVertical: 10,
    // paddingHorizontal: 15,
    width: '97%',
    backgroundColor: '#FEFEFE',
    borderRadius: 15,
    shadowRadius: 15,
    shadowColor: '#BFBFBF',
  },
  SubContentText: {
    justifyContent: 'space-between',
    fontSize: 15,
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: '1%',
  },
  imageBack: {
    position: 'absolute',
    height: 20,
    width: 20,
    marginLeft: '2.5%',
  },
  lable: {
    flex: 3,
    fontSize: 16,
  },
  textx: {
    flex: 5,
    fontSize: 16,
  },
  container1: {
    // flex: 1,
    paddingVertical: 10,
    // paddingHorizontal: 5,
    alignItems: 'center',
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
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#3891E9',
  },
  buttonClose: {
    backgroundColor: '#3891E9',
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
  pressable: {
    backgroundColor: '#3891E9',
    padding: 5,
    width: 100,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: '#3891E9',
    padding: 15,
    width: 100,
    borderRadius: 10,
  },
  save: {
    backgroundColor: '#3891E9',
    padding: 15,
    width: 120,
    borderRadius: 10,
  },
});