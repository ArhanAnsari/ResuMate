import { PremiumButton } from '@/src/shared/components/ui/PremiumButton';
import { PremiumInput } from '@/src/shared/components/ui/PremiumInput';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';

export const LoginScreen = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) return;
    try {
      await login({ email, password });
    } catch (err) {
      // Error is stored in store
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}
        >
          <View className="mb-8 items-center">
            <Text className="text-3xl font-bold text-text mb-2">Welcome Back!</Text>
            <Text className="text-base text-textSecondary text-center">Sign in to continue building your resume.</Text>
          </View>

          <View className="w-full max-w-[600px] self-center">
            {error && <Text className="text-error mb-4 text-center">{error}</Text>}

            <PremiumInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />

            <PremiumInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <View className="mt-4">
                <PremiumButton 
                    title="Sign In" 
                    onPress={handleLogin} 
                    isLoading={isLoading}
                    size="lg"
                />
            </View>

            <PremiumButton
                title="Create an account"
                variant="ghost"
                onPress={() => router.push('/register')}
                style={{ marginTop: 8 }} 
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


