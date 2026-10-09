import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import { useAuth } from '@/presentation/auth/hooks/useAuth';

export default function RootLayout() {
    const { initializeAuth } = useAuth();

    useEffect(() => {
        void initializeAuth();
    }, [initializeAuth]);

    return (
        <SafeAreaProvider>
            <KeyboardProvider>
            <PaperProvider theme={DefaultTheme}>
                {Platform.OS === 'web' ? (
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f0f0f0',
                    }}>
                        {/* Marco del iPhone */}
                        <View style={{
                            width: 430,
                            height: 932,
                            backgroundColor: '#000',
                            borderRadius: 55,
                            padding: 12,
                            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
                        } as any}>
                            {/* Notch */}
                            <View style={{
                                position: 'absolute',
                                top: 12,
                                alignSelf: 'center',
                                width: 120,
                                height: 34,
                                backgroundColor: '#000',
                                borderRadius: 20,
                                zIndex: 10,
                            }} />
                            {/* Pantalla */}
                            <View style={{
                                flex: 1,
                                borderRadius: 44,
                                overflow: 'hidden',
                                backgroundColor: '#fff',
                            }}>
                                <Stack screenOptions={{ headerShown: false }} />
                            </View>
                        </View>
                    </View>
                ) : (
                    <Stack screenOptions={{ headerShown: false }} />
                )}
            </PaperProvider>
            </KeyboardProvider>
        </SafeAreaProvider>
    );
}