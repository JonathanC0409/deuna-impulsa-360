import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import { colors } from '../../theme/colors';
import { MOCK_PREMIO_RULETA } from '../../data/mockData';

export default function ResultadoRecompensaScreen({ navigation, route }) {
  const premio = route?.params?.premio ?? MOCK_PREMIO_RULETA;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>¡Felicidades!</Text>
        <DeunaCard style={styles.card}>
          <Text style={styles.premio}>{premio.nombre}</Text>
          <Text style={styles.desc}>{premio.descripcion}</Text>
        </DeunaCard>
        <DeunaButton
          title="Ver mis recompensas"
          onPress={() =>
            navigation.navigate('Cliente', {
              screen: 'MisRecompensas',
            })
          }
        />
        <DeunaButton
          title="Volver al inicio"
          variant="outline"
          onPress={() => navigation.navigate('Cliente')}
          style={styles.gap}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  emoji: { fontSize: 64, textAlign: 'center' },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', color: colors.primary, marginVertical: 16 },
  card: { alignItems: 'center', marginBottom: 24 },
  premio: { fontSize: 22, fontWeight: '700', color: colors.cashback },
  desc: { fontSize: 14, color: colors.textMuted, marginTop: 8, textAlign: 'center' },
  gap: { marginTop: 12 },
});
