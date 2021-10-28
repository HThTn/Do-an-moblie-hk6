import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Text from './Text';
import styles from '../style/style';
import {mainBlue, errorColor} from '../style/color';
const Password = ({
  onChangeText,
  errorMessage = false,
  value = 12346,
  leftIcon = false,
  style,
  outlineColor = '#999999',
  outLine = false,
  focusColor = mainBlue,
  isFocus = false,
  type = 'outline',
  editable = true,
  multiline = false,
  shadow = false,
  label = false,
}) => {
  const [showPassWord, setShowPassWord] = useState(false);
  const [hasFocus, setHasForcus] = useState(false);
  const [borderColor, setBorderColor] = useState(outlineColor);
  useEffect(() => {
    if (hasFocus) {
      if (errorMessage) setBorderColor(errorColor);
      else setBorderColor(focusColor);
    } else {
      if (errorMessage) setBorderColor(errorColor);
      else setBorderColor(outlineColor);
    }
  }, [hasFocus || errorMessage]);

  return (
    <View>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 30,
            elevation: shadow ? shadow : 0,
            borderColor: hasFocus ? focusColor : outlineColor,
            borderWidth: outLine ? 1 : hasFocus ? 1 : 0,
          },
          {style},
          !errorMessage ? null : styles.borderErr,
        ]}>
        <View style={{marginLeft: 15}}>
          <Icon name="lock" size={24} color={borderColor} />
        </View>
        <TextInput
          style={[{flex: 1, marginLeft: 10, fontFamily: 'Inter', fontSize: 14}]}
          placeholder="Mật khẩu"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassWord}
          placeholderTextColor={borderColor}
          onFocus={() => {
            if (isFocus) {
              setHasForcus(true);
            }
          }}
          onBlur={() => {
            if (isFocus) {
              setHasForcus(false);
            }
          }}
        />
        <TouchableOpacity
          style={{marginRight: 20}}
          onPress={() => setShowPassWord(!showPassWord)}>
          <Text style={{padding: 6}} size={12} color={borderColor}>
            {showPassWord ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>
      {errorMessage && (
        <Text size={14} style={[styles.textErr]}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

export default Password;
