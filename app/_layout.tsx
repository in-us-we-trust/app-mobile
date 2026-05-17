import { Stack } from 'expo-router';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import { AuthProvider } from '../presentation/auth/context/authContext';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <PaperProvider theme={DefaultTheme}>
                <AuthProvider>
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
                </AuthProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
}