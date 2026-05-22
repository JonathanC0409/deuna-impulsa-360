import { useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import ScreenContainer from '../../components/ScreenContainer';
import { colors, spacing, radii, typography } from '../../theme';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation, rol = 'Cliente' }) {
  const { signIn } = useAuth();
  const [correo, setCorreo] = useState('');
  const [loading, setLoading] = useState(false);

  const esNegocio = rol === 'Negocio';

  const handleEntrar = async () => {
    if (!correo.trim()) {
      Alert.alert('Correo', 'Escribe tu correo para continuar.');
      return;
    }

    setLoading(true);
    try {
      const { giroBienvenida: giro } = await signIn({
        correo,
        rolEsperado: rol,
      });

      if (!esNegocio && giro) {
        navigation.replace('GiroBienvenida');
        return;
      }

      navigation.replace(esNegocio ? 'NegocioHome' : 'ClienteHome');
    } catch (e) {
      Alert.alert('No se pudo entrar', e.message ?? 'Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <ScreenContainer>
            <Text style={styles.logo}>deuna!</Text>
            <Text style={styles.title}>
              {esNegocio ? 'Entrar como negocio' : 'Entrar como cliente'}
            </Text>
            <Text style={styles.sub}>
              Modo demo: escribe tu correo y listo. Si es la primera vez, creamos tu cuenta
              automáticamente.
            </Text>

            <Text style={styles.label}>Correo</Text>
            <TextInput
              style={styles.input}
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="tu@email.com"
              placeholderTextColor={colors.textMuted}
              onSubmitEditing={handleEntrar}
            />

            <DeunaButton
              title="Continuar"
              onPress={handleEntrar}
              loading={loading}
              style={styles.btn}
            />

            <DeunaButton title="Volver" variant="outline" onPress={() => navigation.goBack()} />
          </ScreenContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.backgroundAlt },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingVertical: spacing.xl },
  logo: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.primary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  title: { ...typography.h1, textAlign: 'center', marginBottom: spacing.sm },
  sub: { ...typography.body, textAlign: 'center', marginBottom: spacing.xl },
  label: { ...typography.label, marginBottom: spacing.xs, marginTop: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.lg,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.text,
  },
  btn: { marginTop: spacing.xl },
});
