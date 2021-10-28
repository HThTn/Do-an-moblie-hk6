import React from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import Spinkit from 'react-native-spinkit';

import Text from './Text'

const LoadingModal = ({ isVisible }) => {
    return (
        <Modal isVisible={isVisible}
        >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
                <View style={{ alignItems: 'center' }}>
                    <Spinkit type='FadingCircleAlt' color='#FFFFF' size={50} />
                    <Text style={{ fontFamily: 'Inter', fontSize: 18, color: '#FFFFFF' }}> Đang xử lý ...</Text>
                </View>
            </View>
        </Modal>
    );
};

export default LoadingModal;