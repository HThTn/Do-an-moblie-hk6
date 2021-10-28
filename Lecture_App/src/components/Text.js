import React from 'react';
import {Text} from 'react-native';
const TextCustom = ({children, style, size = 18, color = '#1a1821'}) => {
  return (
    <Text style={[{fontFamily: 'Inter', fontSize: size, color: color}, style]}>
      {children}
    </Text>
  );
};

export default TextCustom;
