import { StyleSheet } from 'react-native';
import brand from '../../Styles/brand'

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
  scheduleRow: {
    justifyContent: 'space-between',
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginLeft: 5, 
    marginTop: 5, 
    paddingTop: 5,
    paddingBottom: 10,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    
  },
  leftColumn: {
    flexDirection: 'row', 
    alignItems: 'flex-start', 
  },
  middleColumn: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0
  },
  middleColumnTitle: {
    fontSize: 12,
    fontStyle: 'italic',
    color: brand.colors.gray
  },
  middleColumnInfo: {
    fontSize: 10,
    fontStyle: 'italic',
    color: brand.colors.gray
  },
  listItem: {
    paddingLeft: 5,
    marginTop: 10,
    marginBottom: 10
  },
  itemImage: {
    marginLeft: 2,
    width: 48,
    height: 48,
    borderRadius: 48/2,
    borderWidth: 0.9,
    borderColor: brand.colors.gray,
  },
  timeColumn: {
    flexDirection: 'column',
    paddingLeft: 5,
    marginTop: 0,
    marginBottom: 0
  },
  timeColumnTime: {
    color: brand.colors.gray,
    fontSize: 15
  },
  timeColumnRole: {
    color: brand.colors.gray,
    fontSize: 14
  },
  timeColumnLocation: {
    color: brand.colors.gray,
    fontSize: 14
  },
  actionRow: {
    justifyContent: 'flex-start',
    flexDirection: 'row', 
    alignItems: 'flex-start',     
  },
  actionColumn: {
    paddingRight: 10,
    flexWrap: 'wrap',
    alignItems: 'flex-end'
  },
  actionButtonsColumn: {
    flexDirection: 'column',
    paddingLeft: 5,
    marginTop: 0,
    marginBottom: 0
    
  },
  actionButton: {
    //position: 'absolute', right: 0
    
  },
  modalButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 50,
    backgroundColor: '#056ecf',
    borderRadius: 5
  },
  modalButtonText: {
    fontSize: 25,
    color: '#fff'   
  }

})