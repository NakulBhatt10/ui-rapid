import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Vibration } from 'react-native';
import { Theme, lightTheme } from '../theme';

export interface SOSButtonProps {
  onSOS: () => void;
  theme?: Theme;
  disabled?: boolean;
}

export const SOSButton: React.FC<SOSButtonProps> = ({
  onSOS,
  theme = lightTheme,
  disabled = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleLongPress = () => {
    if (disabled) return;
    
    Vibration.vibrate([100, 50, 100]);
    setIsPressed(true);
    
    // Show confirmation after long press
    setTimeout(() => {
      if (isPressed) {
        onSOS();
        setIsPressed(false);
      }
    }, 1000);
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: disabled ? theme.colors.muted : theme.colors.destructive,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    text: {
      color: theme.colors.destructiveForeground,
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    instruction: {
      marginTop: theme.spacing.md,
      color: theme.colors.mutedForeground,
      fontSize: 14,
      textAlign: 'center',
    },
  });

  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity
        style={[styles.container, isPressed && { transform: [{ scale: 0.95 }] }]}
        onLongPress={handleLongPress}
        onPressOut={() => setIsPressed(false)}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={styles.text}>SOS</Text>
      </TouchableOpacity>
      <Text style={styles.instruction}>
        {disabled ? 'SOS Disabled' : 'Long press to activate SOS'}
      </Text>
    </View>
  );
};