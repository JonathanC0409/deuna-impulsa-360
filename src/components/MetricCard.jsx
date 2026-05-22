import { Text, StyleSheet } from 'react-native';
import DeunaCard from './DeunaCard';
import { colors, typography } from '../theme';

export default function MetricCard({ label, value, subtitle, accent = colors.primary, style }) {
  return (
    <DeunaCard style={[styles.metric, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: accent }]}>{value}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </DeunaCard>
  );
}

const styles = StyleSheet.create({
  metric: {
    flex: 1,
    minWidth: 140,
  },
  label: {
    ...typography.label,
  },
  value: {
    ...typography.amountSm,
    marginTop: 4,
  },
  subtitle: {
    ...typography.caption,
    marginTop: 4,
  },
});
