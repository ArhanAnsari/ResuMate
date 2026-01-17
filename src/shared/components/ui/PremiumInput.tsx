import { COLORS, LAYOUT, SPACING, TYPOGRAPHY } from '@/src/core/theme';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface PremiumInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  style?: React.ComponentProps<typeof View>['style'];
}

export const PremiumInput: React.FC<PremiumInputProps> = ({
  label,
  error,
  icon,
  style,
  onFocus,
  onBlur,
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useSharedValue(0);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    focusAnim.value = withTiming(1);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    focusAnim.value = withTiming(0);
    if (onBlur) onBlur(e);
  };

  const animatedLabelStyle = useAnimatedStyle(() => {
    const shouldFloat = isFocused || (value && value.length > 0);
    return {
      transform: [
        { translateY: withTiming(shouldFloat ? -28 : 0) },
        { translateX: withTiming(shouldFloat ? -6 : 0) },
        { scale: withTiming(shouldFloat ? 0.85 : 1) },
      ],
      color: withTiming(error ? COLORS.error : isFocused ? COLORS.primary : COLORS.textTertiary),
    };
  });
  
  // Container border color animation logic would go here, simplified for now
  const borderColor = error 
    ? COLORS.error 
    : isFocused 
      ? COLORS.primary 
      : COLORS.border;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.inputContainer, { borderColor }]}>
        <Animated.Text 
          style={[styles.label, animatedLabelStyle]}
          pointerEvents="none"
        >
          {label}
        </Animated.Text>
        <TextInput
          style={styles.input}
          placeholder=""
          placeholderTextColor="transparent"
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          selectionColor={COLORS.primary}
          {...props}
        />
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  inputContainer: {
    height: 56,
    borderWidth: 1.5,
    borderRadius: LAYOUT.borderRadius.md,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: SPACING.md,
    top: 17,
    fontFamily: TYPOGRAPHY.fontFamily,
    fontSize: TYPOGRAPHY.sizes.base,
    backgroundColor: COLORS.surface, // Cover border
    paddingHorizontal: 4,
    zIndex: 1,
  },
  input: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamily,
    fontSize: TYPOGRAPHY.sizes.base,
    color: COLORS.text,
    paddingTop: SPACING.xs, // Push text down slightly
    height: '100%',
  },
  iconContainer: {
    position: 'absolute',
    right: SPACING.md,
  },
  errorText: {
    marginTop: SPACING.xs,
    color: COLORS.error,
    fontSize: TYPOGRAPHY.sizes.xs,
    marginLeft: SPACING.xs,
  },
});
