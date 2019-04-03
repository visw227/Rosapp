import { StyleSheet, Dimensions } from 'react-native';

// const window = Dimensions.get('window');
// export const IMAGE_HEIGHT = window.width / 2;
// export const IMAGE_HEIGHT_SMALL = window.width / 5;

export const MIN_HEIGHT = 150;
export const MAX_HEIGHT = 200;

import brand from '../../../Styles/brand'

// define your styles
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: brand.colors.primary
    },
    logoContainer:{
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo: {
        position: 'absolute',
        // width: 400,
        // height: 200
        maxHeight: 150,
        maxWidth: 150,
        marginTop: 150
    },
    formContainer: {
        marginBottom: 50
    }
});