import React, {useState, useEffect} from 'react';

import {View, TextInput as TextInputBase, ImageBackground} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable';

import styles from '../style/style';
import {
  errorColor,
  mainBlack,
  mainBlue,
  mainGray,
  mainWhite,
} from '../style/color';
import Text from './Text';
const fadeIn = {
  from: {
    top: 25,
  },
  to: {
    top: 0,
  },
};

const TextInput = ({
  placeholder,
  onChangeText,
  errorMessage = false,
  value,
  leftIcon = false,
  style,
  outlineColor = mainGray,
  outLine = !shadow,
  focusColor = mainBlue,
  isFocus = true,
  type = 'outline',
  editable = true,
  multiline = false,
  shadow = false,
  label = false,
}) => {
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

  if (type == 'flat') {
    return (
      <View>
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomColor: hasFocus ? focusColor : outlineColor,
              borderBottomWidth: outLine ? 2 : 0,
            },
            style,
            !errorMessage ? null : {borderBottomColor: errorColor},
          ]}>
          {leftIcon && (
            <View style={{marginLeft: 15}}>
              <Icon
                name={leftIcon}
                size={24}
                color={errorMessage ? '#ED557A' : '#999999'}
              />
            </View>
          )}
          <TextInputBase
            multiline={multiline}
            style={[
              {
                flex: 1,
                marginLeft: 10,
                fontFamily: 'Inter',
                fontSize: 16,
                color: mainBlack,
              },
            ]}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            editable={editable}
          />
        </View>
        {errorMessage && (
          <Text size={14} style={styles.textErr}>
            {errorMessage}
          </Text>
        )}
      </View>
    );
  }
  return (
    <View style={{paddingTop: 11}}>
      {label && (hasFocus || !value == false) && (
        <Animatable.View
          animation={fadeIn}
          duration={500}
          style={{
            position: 'absolute',
            top: 0,
            marginLeft: !leftIcon ? 15 : 50,
            backgroundColor: mainWhite,
            borderColor: mainWhite,
            zIndex: 100,
          }}>
          <Text size={14} color={borderColor}>
            {placeholder}
          </Text>
        </Animatable.View>
      )}
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 10,
            borderColor: hasFocus ? focusColor : outlineColor,
            borderWidth: outLine ? 1 : hasFocus ? 1 : 0,
            zIndex: 0,
            elevation: shadow ? shadow : 0,
          },
          style,
          !errorMessage ? null : styles.borderErr,
        ]}>
        {leftIcon && (
          <View style={{marginLeft: 15}}>
            <Icon
              name={leftIcon}
              size={24}
              color={
                errorMessage ? '#ED557A' : hasFocus ? focusColor : '#999999'
              }
            />
          </View>
        )}
        <TextInputBase
          placeholderTextColor={borderColor}
          multiline={multiline}
          style={[
            {
              flex: 1,
              marginLeft: 10,
              fontFamily: 'Inter',
              fontSize: 14,
              color: mainBlack,
            },
          ]}
          placeholder={label ? (hasFocus ? null : placeholder) : placeholder}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
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
      </View>
      {errorMessage && (
        <Text size={14} style={[styles.textErr]}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

export default TextInput;
