import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import { colors } from '../../theme/colors';

export default function RegistrarVentaScreen({ navigation }) {
  const [cliente, setCliente] = useState('');
  const [monto, setMonto] = useState('');

  const handleRegistrar = () => {
    if (!cliente.trim() || !monto.trim()) {
      Alert.alert('Datos incompletos', 'Ingresa cliente y monto.');
      return;
    }
    Alert.alert('Venta registrada (demo)', `${cliente} — $${monto}`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <DeunaCard>
        <Text style={styles.label}>Cliente</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del cliente"
          placeholderTextColor={colors.textMuted}
          value={cliente}
          onChangeText={setCliente}
        />
        <Text style={[styles.label, styles.spaced]}>Monto total ($)</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          value={monto}
          onChangeText={setMonto}
        />
      </DeunaCard>
      <Text style={styles.hint}>Los puntos se acreditarán automáticamente al cliente.</Text>
      <DeunaButton title="Registrar venta" variant="cashback" onPress={handleRegistrar} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, gap: 12 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginTop: 6,
    fontSize: 16,
    color: colors.text,
  },
  spaced: { marginTop: 16 },
  hint: { fontSize: 13, color: colors.textMuted, textAlign: 'center' },
});
