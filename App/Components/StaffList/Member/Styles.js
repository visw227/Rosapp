import { StyleSheet } from 'react-native';
import brand from '../../../Styles/brand'

// define your styles
export default StyleSheet.create({

  header:{
    backgroundColor: brand.colors.secondary,
    height:200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:130
  },
  body:{
    marginTop:10,
  },
  bodyContent: {
    alignItems: 'center',
    
  },
  name:{
    fontSize:28,
    color: brand.colors.gray,
    fontWeight: "600",
    marginBottom: 10
  },

  info:{
    fontSize:16,
    color: brand.colors.gray,
    marginTop:10,
    marginBottom: 10,
    textAlign: 'center'
  },
  buttonText: {
    color: brand.colors.white,
    marginLeft: 20,
    fontSize: 20
  },
  buttonContainer: {
    marginTop:15,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: brand.colors.secondary,
    color: '#ffffff'
  },

})