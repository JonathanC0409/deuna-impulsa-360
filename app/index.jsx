import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#4B168C',
  cashback: '#00C896',
  white: '#FFFFFF',
  text: '#1E1E1E',
  textMuted: '#6F6F7A',
};

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.logo}>deuna!</Text>
        <Text style={styles.title}>Deuna Impulsa 360</Text>
        <Text style={styles.subtitle}>
          Más ventas para tu negocio, más recompensas para tus clientes
        </Text>

        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          activeOpacity={0.85}
          onPress={() => router.push('/negocio')}
        >
          <Text style={styles.buttonTextLight}>Entrar como Negocio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          activeOpacity={0.85}
          onPress={() => router.push('/cliente')}
        >
          <Text style={styles.buttonTextPrimary}>Entrar como Cliente</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: COLORS.white,
  },
  logo: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textMuted,
    marginBottom: 40,
  },
  button: {
    minHeight: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    paddingHorizontal: 24,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonOutline: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonTextLight: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonTextPrimary: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
