import { Platform, Dimensions, StyleSheet } from 'react-native'
import { normalize } from 'react-native-elements'

const colors = {
  warning: '#f1c40f',
  success: '#2ecc71',
  danger: '#e74c3c',
  info: '#3498db',
  primary: '#3498db',
  white: '#ffffff',

  muted: '#999999',
  mutedLighten: '#cccccc',
  mutedDarken: '#666666',

  black: '#000000',
  banner: '#5F3E63',
  bloodOrange: '#fb5f26',
  border: '#777777',
  ricePaper: 'rgba(255,255,255, 0.75)',
  frost: '#D8D8D8',
  cloud: 'rgba(200,200,200, 0.35)',
  windowTint: 'rgba(0, 0, 0, 0.4)',
  panther: '#161616',
  charcoal: '#595959',
  coal: '#2d2d2d',
  silver: '#F7F7F7',
  steel: '#CCCCCC',
  ember: 'rgba(164, 0, 48, 0.5)',
  fire: '#e73536',
  drawer: 'rgba(30, 30, 29, 0.95)',
  eggplant: '#251a34',
  transparent: 'transparent',
  lightest: '#fafafa',
  light: '#f3f3f3',
  lightGrey: '#e9e9e9',
  brand: {
    primary: '#1867B2',
    secondary: '#31B0D5',
    gray: '#E6E6E6',
    lightGray: '#DDDDDD',
    green: '#449D44',
    orange: '#EC971F',
    border: '#DDDDDD',
    background: '#FFFFFF'
  },
  tabbar: {
    iconDefault: '#BABDC2',
    iconSelected: '#0E4EF8'
  }
}

const { width, height } = Dimensions.get('window')
const screenWidth = width < height ? width : height

const platformValue = (ios = null, android = null) => {
  return Platform.select({
    ios,
    android
  })
}

const borderWidth = StyleSheet.hairlineWidth
const radius = platformValue(4, 3)
const radiusSml = platformValue(2, 2)
const padding = platformValue(10, 16)
const paddingSml = platformValue(5, 7)
const margin = platformValue(10, 8)
const marginSml = platformValue(1, 2)
const section = platformValue(25, 23)

const borders = {}
const borderRadius = {}
;['Bottom', 'Top', 'Left', 'Right'].forEach(key => {
  const keyName = key === 'all' ? '' : key

  borders[key.toLowerCase()] = {
    ['border' + keyName + 'Width']: borderWidth,
    ['border' + keyName + 'Color']: colors.brand.border
  }

  borderRadius[key.toLowerCase()] = {
    ['border' + keyName + 'RightRadius']: radius,
    ['border' + keyName + 'LeftRadius']: radius
  }
})

const metrics = {
  section: section,
  doubleSection: 50,
  baseMargin: margin,
  doubleBaseMargin: margin * 2,
  smallMargin: marginSml,
  marginHorizontal: margin,
  marginVertical: margin,
  horizontalLineHeight: borderWidth,
  searchBarHeight: 30,
  screenWidth: screenWidth,
  screenHeight: width < height ? height : width,
  navBarHeight: Platform.OS === 'ios' ? 64 : 54,
  statusBarHeight: Platform.OS === 'ios' ? 16 : 0,
  tabbarHeight: 51,
  buttonRadius: radius,
  padding: padding,
  paddingSml: paddingSml,
  paddingTiny: paddingSml - 2,
  borderRadiusSml: radiusSml,
  borderRadius: radius,
  widthHalf: screenWidth * 0.5,
  widthThird: screenWidth * 0.333,
  widthTwoThirds: screenWidth * 0.666,
  widthQuarter: screenWidth * 0.25,
  widthThreeQuarters: screenWidth * 0.75,
  toggleButtonHeight: 30,
  dayToggleButtonHeight: 30,
  dayToggleButtonWidth: 40,
  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 50
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 140
  }
}

const type = {
  base: 'Avenir-Book',
  bold: 'Avenir-Black',
  emphasis: 'HelveticaNeue-Italic'
}

const size = {
  h1: normalize(38),
  h2: normalize(34),
  h3: normalize(30),
  h4: normalize(26),
  h5: normalize(20),
  h6: normalize(19),
  input: normalize(18),
  tiny: normalize(8.5),
  xxsmall: normalize(10),
  xsmall: normalize(12),
  small: normalize(14),
  medium: normalize(16),
  large: normalize(18),
  xlarge: normalize(20),
  xxlarge: normalize(22)
}

const style = {
  h1: {
    fontFamily: type.base,
    fontSize: size.h1
  },
  h2: {
    fontWeight: 'bold',
    fontSize: size.h2
  },
  h3: {
    fontFamily: type.emphasis,
    fontSize: size.h3
  },
  h4: {
    fontFamily: type.base,
    fontSize: size.h4
  },
  h5: {
    fontFamily: type.base,
    fontSize: size.h5
  },
  h6: {
    fontFamily: type.emphasis,
    fontSize: size.h6
  },
  normal: {
    fontFamily: type.base,
    fontSize: size.regular
  },
  description: {
    fontFamily: type.base,
    fontSize: size.medium
  }
}

const flexplatformValues = {
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  flex3: { flex: 3 },
  flex4: { flex: 4 },
  flex5: { flex: 5 },
  flex6: { flex: 6 },
  justAlignCenter: { justifyContent: 'center', alignItems: 'center' },
  justAlignStart: { justifyContent: 'flex-start', alignItems: 'flex-start' },
  justAlignEnd: { justifyContent: 'flex-end', alignItems: 'flex-end' }
}

const theme = {
  border: { ...borders },
  borderRadius: { ...borderRadius },
  separator: {
    backgroundColor: colors.border,
    height: borderWidth
  },
  flex: flexplatformValues,
  colors: colors,
  metrics: metrics,
  //images: images, /* commenting this constant as it is causing error coz these images are not imported. will uncomment them when neeeded -- 09/13/18 */
  fonts: {
    size: size,
    type: type,
    style: style
  },
  background: colors.light,
  backgroundDarker: colors.lightGrey,
  borderColor: colors.border,
  iconWidth: 29,
  styles: {
    left: {
      alignItems: 'flex-start'
    },
    right: {
      alignItems: 'flex-end'
    }
  },
  screen: {
    container: {
      flex: 1,
      backgroundColor: colors.background
    }
  },
  isAndroid: platformValue(false, true),
  isIOS: platformValue(true, false),
  borderWidth,
  radius,
  padding,
  margin,
  marginSml,
  platformValue
}

export default theme
