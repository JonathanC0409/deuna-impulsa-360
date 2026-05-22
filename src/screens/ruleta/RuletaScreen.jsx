import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import ModuloQuickNav from '../../components/ModuloQuickNav';
import { colors } from '../../theme/colors';
import { MOCK_PREMIO_RULETA } from '../../data/mockData';

export default function RuletaScreen({ navigation }) {
  const handleGirar = () => {
    navigation.navigate('ResultadoRecompensa', { premio: MOCK_PREMIO_RULETA });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ModuloQuickNav navigation={navigation} active="Ruleta" />
      <DeunaCard style={styles.wheel}>
        <Text style={styles.emoji}>🎡</Text>
        <Text style={styles.title}>¡Gira y gana!</Text>
        <Text style={styles.hint}>Tienes 1 giro disponible hoy</Text>
      </DeunaCard>
      <DeunaButton title="Girar ruleta" variant="cashback" onPress={handleGirar} />
      <DeunaButton
        title="Volver"
        variant="outline"
        onPress={() => navigation.navigate('Cliente')}
        style={styles.gap}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 12 },
  wheel: { alignItems: 'center', paddingVertical: 48, marginBottom: 24 },
  emoji: { fontSize: 72 },
  title: { fontSize: 22, fontWeight: '800', color: colors.primary, marginTop: 16 },
  hint: { fontSize: 14, color: colors.textMuted, marginTop: 8 },
  gap: { marginTop: 12 },
});
