import { StyleSheet } from 'react-native'
import theme from '../Themes/theme'

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginVertical: theme.metrics.section
  },
  contentContainer: {
    alignSelf: 'center',
    alignItems: 'center'
  },
  message: {
    marginTop: theme.metrics.baseMargin,
    marginHorizontal: theme.metrics.baseMargin,
    textAlign: 'center',
    fontFamily: theme.fonts.type.base,
    fontSize: theme.fonts.size.regular,
    fontWeight: 'bold',
    color: theme.colors.brand.primary
  },
  icon: {
    color: theme.colors.steel
  }
})
