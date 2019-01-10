import { StyleSheet } from 'react-native';
import brand from '../../Styles/brand'

// define your styles
export default StyleSheet.create({

  subtitleView: {
    color: brand.colors.gray,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5
  },
  list: {
    marginTop: -20
  },
  listItem: {
    color: brand.colors.gray,
    marginBottom: 10
  },
  ratingText: {
    color: brand.colors.gray,
    paddingLeft: 0,
    color: '#808080'
  },
  avatar: {
    marginLeft: 2,
    width: 48,
    height: 48,
    borderRadius: 48/2,
    borderWidth: 0.9,
    borderColor: brand.colors.gray,
  },

})