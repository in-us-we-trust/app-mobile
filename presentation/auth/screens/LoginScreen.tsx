import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, useWindowDimensions, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';

const EMAIL = 'email';
const PASSWORD = 'password';

const WORDING_ERRORS = {
    INVALID_CREDENTIALS: 'Credenciales inválidas. Verifique su correo y contraseña.',
    GENERIC_LOGIN_ERROR: 'Error al iniciar sesión. Por favor, inténtelo de nuevo.',
};

export default function LoginScreen() {
    const { height } = useWindowDimensions();
    const { login, isLoading } = useAuth();
    const theme = useTheme();
    const [form, setForm] = useState({ [EMAIL]: '', [PASSWORD]: '' });
    const [errorForm, setErrorForm] = useState({
        [EMAIL]: null as string | null,
        [PASSWORD]: null as string | null,
    });
    const [showPassword, setShowPassword] = useState(false);

    const onLogin = async () => {
        setErrorForm({ [EMAIL]: null, [PASSWORD]: null });

        const newErrors = {
            [EMAIL]: !form[EMAIL] ? 'El correo electrónico es obligatorio' : null,
            [PASSWORD]: !form[PASSWORD] ? 'La contraseña es obligatoria' : null,
        };

        setErrorForm(newErrors);
        if (newErrors[EMAIL] || newErrors[PASSWORD]) return;

        try {
            await login(form[EMAIL], form[PASSWORD]);
            router.replace('/');
        } catch (error: any) {
            Alert.alert('Error', WORDING_ERRORS.GENERIC_LOGIN_ERROR);
        }
    };

    const onChangeText = (value: string, field: string) => {
        setForm({ ...form, [field]: value });
        if (value.length > 0) {
            setErrorForm({ ...errorForm, [field]: null });
        }
    };

    return (
        <KeyboardAwareScrollView
            bottomOffset={24}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: 40 }}
            contentContainerStyle={{
                backgroundColor: theme.colors.background,
                flexGrow: 1,
                justifyContent: 'center',
                paddingVertical: 40,
            }}
        >
            <View>
                <Text variant="headlineLarge" style={{ fontWeight: 'bold', color: theme.colors.onBackground, marginBottom: 8 }}>
                    Ingresar
                </Text>
                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                    Por favor ingrese para continuar
                </Text>
            </View>

            <View style={{ marginTop: 20 }}>
                <TextInput
                    label="Correo electrónico"
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="email" />}
                    value={form[EMAIL]}
                    onChangeText={(value) => onChangeText(value, EMAIL)}
                    style={{ marginBottom: 12 }}
                    error={!!errorForm[EMAIL]}
                />
                {errorForm[EMAIL] && (
                    <Text style={{ color: theme.colors.error, fontSize: 12, marginTop: -8, marginBottom: 8 }}>
                        {errorForm[EMAIL]}
                    </Text>
                )}

                <TextInput
                    label="Contraseña"
                    mode="outlined"
                    autoCapitalize="none"
                    secureTextEntry={!showPassword}
                    left={<TextInput.Icon icon="lock" />}
                    right={
                        <TextInput.Icon
                            icon={showPassword ? 'eye-off' : 'eye'}
                            onPress={() => setShowPassword(!showPassword)}
                        />
                    }
                    value={form[PASSWORD]}
                    onChangeText={(value) => onChangeText(value, PASSWORD)}
                    error={!!errorForm[PASSWORD]}
                />
                {errorForm[PASSWORD] && (
                    <Text style={{ color: theme.colors.error, fontSize: 12, marginTop: 4 }}>
                        {errorForm[PASSWORD]}
                    </Text>
                )}
            </View>

            <Button
                mode="contained"
                icon="arrow-right"
                style={{ marginTop: 20 }}
                onPress={onLogin}
                disabled={isLoading}
                loading={isLoading}
            >
                Ingresar
            </Button>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 40 }}>
                <Text style={{ color: theme.colors.onSurfaceVariant }}>¿No tienes una cuenta? </Text>
                <Button
                    mode="text"
                    onPress={() => router.push('/(auth)/register')}
                    labelStyle={{ color: theme.colors.primary, fontWeight: 'bold' }}
                >
                    Regístrate
                </Button>
            </View>

            <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Button
                    mode="text"
                    onPress={() => router.push('/(auth)/forgot-password')}
                    labelStyle={{ color: theme.colors.inversePrimary, fontSize: 14 }}
                    compact
                >
                    Olvidé mi contraseña
                </Button>
            </View>
        </KeyboardAwareScrollView>
    );
}