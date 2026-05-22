import { View, Text, StyleSheet } from 'react-native';
import { colorEstadoItem, fondoEstadoItem } from '../../../utils/estadoInventario';

export default function EstadoItemBadge({ estado }) {
  return (
    <View style={[styles.badge, { backgroundColor: fondoEstadoItem(estado) }]}>
      <Text style={[styles.text, { color: colorEstadoItem(estado) }]}>{estado}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
