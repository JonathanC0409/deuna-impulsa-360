import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, radii } from '../../theme';

const SEGMENT_COLORS = [
  colors.primary,
  '#6B3FA0',
  colors.cashback,
  '#F5B942',
  '#E85D75',
  '#2EE6C8',
];

const SHORT_LABELS = ['$0.10', '$0.25', '5%', '10%', 'Giro', '★'];

/**
 * Ruleta visual de 6 segmentos (rotación aplicada desde el padre).
 */
export default function RuletaWheel({ rotation, size = 280 }) {
  const segmentAngle = 360 / 6;
  const radius = size / 2;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.disc,
          {
            width: size,
            height: size,
            borderRadius: radius,
            transform: [{ rotate: rotation }],
          },
        ]}
      >
        {SEGMENT_COLORS.map((bg, index) => (
          <View
            key={index}
            style={[
              styles.slice,
              {
                backgroundColor: bg,
                transform: [{ rotate: `${index * segmentAngle}deg` }],
              },
            ]}
          >
            <View style={styles.sliceInner}>
              <Text style={styles.sliceText}>{SHORT_LABELS[index]}</Text>
            </View>
          </View>
        ))}
      </Animated.View>

      <View style={[styles.hub, { width: size * 0.28, height: size * 0.28, borderRadius: size * 0.14 }]}>
        <Text style={styles.hubLogo}>d!</Text>
      </View>

      <View style={styles.pointer}>
        <View style={styles.pointerTriangle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disc: {
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: colors.white,
    backgroundColor: colors.white,
  },
  slice: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    left: '50%',
    top: 0,
    transformOrigin: 'left bottom',
  },
  sliceInner: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 18,
  },
  sliceText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.white,
    transform: [{ rotate: '60deg' }],
    textAlign: 'center',
  },
  hub: {
    position: 'absolute',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.primary,
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  hubLogo: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
    fontStyle: 'italic',
  },
  pointer: {
    position: 'absolute',
    top: -6,
    zIndex: 10,
    alignSelf: 'center',
  },
  pointerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 26,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.primary,
  },
});
