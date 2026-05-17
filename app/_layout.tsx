import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import { AuthProvider } from '../presentation/auth/context/authContext';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <PaperProvider theme={DefaultTheme}>
                <AuthProvider>
                    <Stack screenOptions={{ headerShown: false }} />
                </AuthProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
}