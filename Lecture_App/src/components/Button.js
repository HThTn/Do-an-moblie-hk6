import React from 'react';
import {TouchableOpacity} from 'react-native';

import Text from './Text';
import styles from '../style/style';

const Button = ({onPress, children, style}) => {
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: '#0598FC',
          height: 40,
          alignItems: 'center',
          width: 170,
          borderRadius: 30,
          elevation: 5,
          paddingVertical: 5,
        },
        style,
      ]}
      onPress={onPress}>
      <Text color="#FFFFFF">{children}</Text>
    </TouchableOpacity>
  );
};

export default Button;
