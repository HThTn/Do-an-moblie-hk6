import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {RadioButton, TextInput} from 'react-native-paper';
import {CheckBox} from 'react-native-elements';
import TokenContext from '../../Context/TokenContext';
import {Picker} from '@react-native-picker/picker';
import {ExamUtils, ClassUtils} from '../../utils';
import Toast from 'react-native-toast-message';
const examDetail = ({route}) => {
  const {_id} = route.params;
  const token = useContext(TokenContext);
  const [exam, setexam] = useState({
    student_ids: [],
    status: '',
    _id: '',
    name: '',
    year: '',
    faculty: '',
    year: '',
    time: '',
    questions: [],
    for: '',
    subject_id: '',
    start_at: '',
    expire_at: '',
  });
  const [subject, setSubject] = useState({
    quantity: 0,
    status: '',
    _id: '',
    name: 'Không có',
    year: '',
    faculty: '',
  });
  const initError = {
    status: false,
    _id: false,
    name: false,
    year: false,
    faculty: false,
    year: false,
    time: false,
    questions: [],
    for: false,
  };
  const [check, SetCheck] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState(initError);
  const [result, setResult] = useState(false);
  const [answer, setAnswer] = useState([]);

  const getExam = async () => {
    await fetch(`http://quocha.xyz/api/exam/lecture/${_id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => res.json())
      .then(async res => {
        await setexam(res.data);
      })
      .catch(error => console.log('error', error));
    console.log(exam.subject_id);
  };

  useEffect(async () => {
    await setIsLoadingData(true);
    await getExam();
    await setIsLoadingData(false);
    return () => {
      setExam();
    };
  }, []);
  useEffect(async () => {
    if (exam.for === 'subject') {
      const url = `http://quocha.xyz/api/subject/lecture/${exam.subject_id}`;
      await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
        .then(res => res.json())
        .then(res => {
          if (res.data != null) {
            setSubject(res.data);
          }
        })
        .catch(error => {
          console.log('error get class', error);
        });
    }
  }, [exam]);
  const handlerCancel = () => {
    setUpdate(false);
    setError(initError);
    getExam();
  };
  const save = async () => {
    // setIsProcessing(true);
    const query = {
      token: token,
      id: _id,
      exam: {
        name: exam.name,
      },
    };
    await setTimeout(async () => {
      try {
        const updateExam = await ExamUtils.updateExam(query).then(res => res);
        const updateStatus = await ExamUtils.updateExamStatus({
          token: token,
          id: _id,
          status: exam.status,
        }).then(res => res);
        if (updateExam.statusCode == 200 && updateStatus.statusCode == 200) {
          Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Cập nhật thành công ',
            visibilityTime: 1000,
            autoHide: true,
          });
          await setUpdate(!update);
        } else {
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Cập nhật thất bại',
            text2: JSON.stringify(updateExam.message),
            visibilityTime: 1000,
            autoHide: true,
          });
          console.log(updateExam);
          await handlerCancel();
        }
      } catch (err) {
        console.log('Error submit:', err);
      }
      // await setIsProcessing(false);
    }, 1000);
  };
  // if (exam.status === 'active') {
  //   exam.status = 'Đang mở';
  // }
  // if (exam.status === 'disabled') {
  //   exam.status === 'Đã đ';
  // }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerView}>
        {!update ? (
          <Text style={styles.headerText}>{exam.name}</Text>
        ) : (
          <TextInput
            value={exam.name}
            onChangeText={text => setexam({...exam, name: text})}
            multiline={true}
            errorMessage={error.name}
            style={styles.headerText}
          />
        )}
      </View>
      <View style={styles.container1}>
        <View style={styles.ContentText}>
          <View style={styles.SubContentText}>
            <Text style={styles.lable}>Thời gian:</Text>
            <Text style={styles.textx}> {exam.time} phút</Text>
          </View>
          <View style={styles.SubContentText}>
            <Text style={styles.lable}>Số lượng câu hỏi:</Text>
            <Text style={styles.textx}>{exam.questions.length.toString()}</Text>
          </View>
          <View style={styles.SubContentText}>
            <Text style={styles.lable}>Loại bài thi:</Text>
            <Text style={styles.textx}>{exam.for}</Text>
          </View>
          <View style={styles.SubContentText}>
            <Text style={styles.lable}>Ngày bắt đầu:</Text>
            <Text style={styles.textx}>
              {exam.start_at.split('T')[0].split('-').reverse().join('/')}
            </Text>
          </View>
          <View style={styles.SubContentText}>
            <Text style={styles.lable}>Ngày kết thúc:</Text>
            <Text style={styles.textx}>
              {exam.expire_at.split('T')[0].split('-').reverse().join('/')}
            </Text>
          </View>
          {exam.for === 'subject' && (
            <View style={styles.SubContentText}>
              <Text style={styles.lable}>Lớp:</Text>
              <Text style={styles.textx}>{subject.name}</Text>
            </View>
          )}
          {!update ? (
            <View style={styles.SubContentText}>
              <Text style={styles.lable}>Trạng thái:</Text>
              <Text style={styles.textx}> {exam.status}</Text>
            </View>
          ) : (
            <View style={styles.picker}>
              <Text style={styles.lable}>Trạng thái:</Text>
              <View style={{flex: 1.5}}>
                <Picker
                  // style={{width: '60%'}}
                  mode="dropdown"
                  itemStyle={{fontFamily: 'Inter', fontSize: 16}}
                  enabled={true}
                  selectedValue={exam.status}
                  onValueChange={val => setexam({...exam, status: val})}>
                  <Picker.Item label="Active" value="active" />
                  <Picker.Item label="Disabled" value="disabled" />
                </Picker>
              </View>
            </View>
          )}
        </View>
      </View>
      {exam.for === 'subject' &&
        (!update ? (
          <View style={styles.container1}>
            <Button
              title="Cập nhật bài kiểm tra"
              // isProcessing={isProcessing}
              onPress={() => setUpdate(true)}
            />
          </View>
        ) : (
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 5,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={{marginRight: 20}}>
              <Button
                title="Cập nhật"
                onPress={() => {
                  save();
                }}
              />
            </View>
            <View style={{marginLeft: 20}}>
              <Button title="Hủy" onPress={handlerCancel} />
            </View>
          </View>
        ))}
      <View style={styles.container1}>
        <CheckBox
          title="Xem câu hỏi"
          checked={check}
          onPress={() => {
            SetCheck(!check);
            setResult(false);
          }}
          checkedColor={'green'}
        />
      </View>
      <View style={styles.container2}>
        <CheckBox
          title="Xem kết quả"
          checked={result}
          onPress={() => {
            setResult(!result);
            SetCheck(false);
          }}
          checkedColor={'green'}
        />
      </View>
      <ScrollView>
        {check == true && (
          <View>
            {exam.questions.map((item, i) => {
              return (
                <RadioButton.Group key={i} value={item.answer}>
                  <View style={styles.questionBox}>
                    <Text style={styles.label}>
                      Câu {i + 1}: {item.question}
                    </Text>
                    {item.selection.map((ans, index) => {
                      return (
                        <View key={index} style={styles.answer}>
                          <RadioButton value={ans} />
                          <Text>{ans}</Text>
                        </View>
                      );
                    })}
                  </View>
                </RadioButton.Group>
              );
            })}
          </View>
        )}
      </ScrollView>
      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};
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
  container2: {
    // flex: 1,
    paddingVertical: 10,
    // paddingHorizontal: 5,
    alignItems: 'center',
    marginTop: -20,
  },
  headerText: {
    position: 'relative',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  headerView: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '2.5%',
  },
  NotiView: {
    position: 'relative',
    marginVertical: '2%',
  },
  NotiText: {
    marginHorizontal: '2.5%',
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 10,
    marginVertical: '.5%',
    borderColor: '#BFBFBF',
  },
  TitleText: {
    fontSize: 20,
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
  },
  SubContentText: {
    justifyContent: 'space-around',
    fontSize: 15,
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: '2%',
  },
  lable: {
    flex: 2,
    marginLeft: 30,
    fontSize: 16,
  },
  textx: {
    flex: 1,
    fontSize: 16,
  },
  label: {
    flex: 2,
    fontSize: 16,
  },
  questionBox: {
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    width: '100%',
    backgroundColor: '#FEFEFE',
    borderRadius: 15,
    shadowRadius: 15,
    shadowColor: '#BFBFBF',
  },
  answer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    // justifyContent: 'space-around',
    fontSize: 15,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    // marginBottom: '2%',
  },
});

export default examDetail;
