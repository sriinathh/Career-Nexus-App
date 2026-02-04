import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function CustomButton({ title, onPress, loading, disabled, style, icon, variant = 'primary' }) {
  const getColors = () => {
    if (variant === 'primary') return ['#4F46E5', '#7C3AED'];
    if (variant === 'danger') return ['#DC2626', '#991B1B'];
    if (variant === 'success') return ['#10B981', '#059669'];
    return ['#6B7280', '#4B5563'];
  };

  return (
    <LinearGradient
      colors={getColors()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.gradient, style]}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={loading || disabled}
        style={styles.button}
      >
        {loading ? (
          <Text style={styles.loadingText}>⏳</Text>
        ) : (
          <View style={styles.content}>
            {icon && <MaterialCommunityIcons name={icon} size={18} color="white" style={styles.icon} />}
            <Text style={styles.text}>{title}</Text>
          </View>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
}

export function Card({ children, style, onPress }) {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component
      onPress={onPress}
      style={[styles.card, style]}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Component>
  );
}

export function ProgressBar({ value, max = 100, label, style }) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <View style={[styles.progressContainer, style]}>
      {label && <Text style={styles.progressLabel}>{label}</Text>}
      <View style={styles.progressTrack}>
        <LinearGradient
          colors={['#4F46E5', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${percentage}%` }]}
        />
      </View>
      <Text style={styles.progressText}>{Math.round(percentage)}%</Text>
    </View>
  );
}

export function SkillSlider({ label, value, onValueChange, min = 0, max = 10 }) {
  return (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <View style={styles.sliderValue}>
          <Text style={styles.sliderValueText}>{value}</Text>
          <Text style={styles.sliderMax}>/{max}</Text>
        </View>
      </View>
      <View style={styles.sliderTrack}>
        {Array.from({ length: max + 1 }).map((_, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.sliderDot,
              i <= value && styles.sliderDotActive
            ]}
            onPress={() => onValueChange(i)}
          />
        ))}
      </View>
    </View>
  );
}

export function StatsCard({ icon, title, value, color = '#4F46E5', style }) {
  return (
    <Card style={[styles.statsCard, style]}>
      <View style={[styles.statsIconContainer, { backgroundColor: color + '20' }]}>
        <MaterialCommunityIcons name={icon} size={16} color={color} />
      </View>
      <Text style={styles.statsTitle}>{title}</Text>
      <Text style={styles.statsValue}>{value}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  loadingText: {
    fontSize: 18,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressContainer: {
    marginVertical: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  sliderContainer: {
    marginVertical: 12,
    paddingHorizontal: 4,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  sliderValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderValueText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5',
  },
  sliderMax: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 2,
  },
  sliderTrack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D1D5DB',
  },
  sliderDotActive: {
    backgroundColor: '#4F46E5',
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  statsCard: {
    alignItems: 'center',
  },
  statsIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 1,
  },
  statsValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
});
