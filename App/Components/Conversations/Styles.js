import { StyleSheet } from 'react-native';
import brand from '../../Styles/brand'

// define your styles
export default StyleSheet.create({
  container: {
    marginTop: -20 
  },
  title: {
    fontStyle: 'italic',
    flexDirection: 'row',
    paddingLeft: 10,
    color: brand.colors.gray,
    fontSize: 15,
    fontWeight: "bold"
  },
  subtitleView: {
    fontStyle: 'italic',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 1,
    color: brand.colors.gray,
    fontSize: 14
  },
  list: {
    marginTop: -20
  },
  listItem: {
    marginBottom: 10
  },
  ratingText: {
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