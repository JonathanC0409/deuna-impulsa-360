import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import { colors } from '../../theme/colors';

export default function CrearItemScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');

  const handleGuardar = () => {
    if (!nombre.trim() || !precio.trim()) {
      Alert.alert('Datos incompletos', 'Ingresa nombre y precio.');
      return;
    }
    Alert.alert('Item guardado (demo)', `"${nombre}" por $${precio}`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <DeunaCard>
        <Text style={styles.label}>Nombre del item</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Café americano"
          placeholderTextColor={colors.textMuted}
          value={nombre}
          onChangeText={setNombre}
        />
        <Text style={[styles.label, styles.spaced]}>Precio ($)</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          value={precio}
          onChangeText={setPrecio}
        />
      </DeunaCard>
      <DeunaButton title="Guardar item" onPress={handleGuardar} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, gap: 16 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginTop: 6,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  spaced: { marginTop: 16 },
});
