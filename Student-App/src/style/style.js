const React = require("react-native");

const { StyleSheet } = React;

export default StyleSheet.create({

    fontInter: {
        fontFamily: 'Inter'
    },
    container: {
        flex: 1,
        alignItems: 'center',

    },
    image: {
        width: 24,
        height: 24,
    },
    headerText: {
        position: "relative",
        fontSize: 20,
        fontFamily: 'Inter',
        color: '#FEFEFE',

    },
    headerView: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0779FC',
        paddingVertical: '2.5%',
        height: 50
    },
    inputView: {
        position: 'relative',
        width: "90%",
    },
    input: {
        position: 'relative',
        padding: 10,
        backgroundColor: "#F8FAFD",
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#E9EEF4',
        fontFamily: 'Inter',
    },
    inputArea: {
        height: 150
    },
    button: {
        position: 'relative',
        fontFamily: 'Inter',
    },
    textErr: {
        color: "#ED557A", paddingLeft: 10,
        fontFamily: 'Inter'

    },
    borderErr: {
        borderWidth: 1,
        borderColor: '#ED557A'
    },
    viewPicker: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    inputDateTime: {
        width: '85%',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        marginRight: 0
    },
    btnDateTime: {
        display: 'flex',
        height: '100%',
        width: '15%',
        alignItems: 'center',
        paddingTop: 10,
        backgroundColor: '#F8FAFD',
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20
    },
    viewRadioGroup: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15
    },
    viewRadio: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 20

    },
    textIRI: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E9EEF4',
    },
    shadownBox: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 4,
    }
})