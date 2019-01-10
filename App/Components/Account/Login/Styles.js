import { StyleSheet } from 'react-native';
import brand from '../../../Styles/brand'

// define your styles
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: brand.colors.primary
    },
    loginContainer:{
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo: {
        position: 'absolute',
        // width: 400,
        // height: 200
        maxHeight: 150
    },
    title:{
        color: "#FFF",
        marginTop: 120,
        width: 180,
        textAlign: 'center',
        opacity: 0.9
    },
    formContainer: {
        marginBottom: 100
    }
});