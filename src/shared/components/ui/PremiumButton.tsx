import { COLORS, LAYOUT, SPACING, TYPOGRAPHY } from '@/src/core/theme';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface PremiumButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: any;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    if (disabled || isLoading) return;
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    if (disabled || isLoading) return;
    scale.value = withSpring(1);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: COLORS.secondary, borderWidth: 0 };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.border };
      case 'ghost':
        return { backgroundColor: 'transparent', borderWidth: 0 };
      case 'primary':
      default:
        return { backgroundColor: COLORS.primary, borderWidth: 0 };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.md, height: 36 };
      case 'lg':
        return { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl, height: 56 };
      case 'md':
      default:
        return { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.lg, height: 48 };
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'secondary':
        return { color: COLORS.surface };
      case 'outline':
        return { color: COLORS.text };
      case 'ghost':
        return { color: COLORS.primary };
      case 'primary':
      default:
        return { color: COLORS.surface };
    }
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isLoading}
      style={[
        styles.container,
        getVariantStyles(),
        getSizeStyles(),
        disabled && { opacity: 0.5 },
        style,
        animatedStyle,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.surface} />
      ) : (
        <Text style={[styles.text, getTextStyles(), textStyle]}>
          {title}
        </Text>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: LAYOUT.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
  },
  text: {
    fontFamily: TYPOGRAPHY.fontFamily,
    fontWeight: TYPOGRAPHY.weights.medium,
    letterSpacing: 0.5,
  },
});
