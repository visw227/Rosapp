import { StyleSheet } from 'react-native';
import brand from '../../../Styles/brand'

// define your styles
export default StyleSheet.create({

  sectionHeader: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    backgroundColor: brand.colors.secondary,
    color: brand.colors.white,
    fontStyle: 'italic'
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: 'white',
  //   paddingTop: 0,
  //   marginTop: 0
  // },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    // marginTop: 0,
    // paddingTop: 0,
    // paddingBottom: 0,
    // backgroundColor: 'white',
  },

})