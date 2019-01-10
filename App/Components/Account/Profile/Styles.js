import { StyleSheet } from 'react-native';
import brand from '../../../Styles/brand'

// define your styles
export default StyleSheet.create({

  //  container: {
  //       flex: 1,
  //       backgroundColor: brand.colors.white
  //   },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageContainer:{
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: brand.colors.secondary,
    },
    logo: {
        position: 'absolute',
        // width: 400,
        // height: 200
    },
    title:{
        color: "#FFF",
        marginTop: 120,
        width: 180,
        textAlign: 'center',
        opacity: 0.9
    },
    formContainer: {
               flexGrow: 1,
        marginBottom: 100
    },


  header:{
    backgroundColor: brand.colors.secondary,
    height:70,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:20
  },
      input:{
        height: 40,
        backgroundColor: '#ffffff',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
        padding: 10,
        color: brand.colors.gray,
        borderColor: brand.colors.silver, 
        borderWidth: 1,
        borderRadius: 5
    },
  name:{
    fontSize:22,
    color:brand.colors.gray,
    fontWeight:'600',
  },
  body:{
    marginTop: 5,
  },
  bodyContent: {
    // flex: 1,
    alignItems: 'center',
    padding:30,
  },
  photoLink:{
    fontSize:16,
    color: brand.colors.secondary,
    marginTop:5,
    marginBottom: 5
  },
  name:{
    fontSize:28,
    color: brand.colors.gray,
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: brand.colors.gray,
    marginTop:10
  },
  description:{
    fontSize:16,
    color: brand.colors.gray,
    marginTop:10,
    textAlign: 'center'
  }
})