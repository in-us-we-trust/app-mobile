import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    useWindowDimensions,
    View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import {
    Button,
    Text,
    TextInput,
    useTheme,
} from "react-native-paper";

import { isValidEmail } from "@/helpers/email-validation.helper";
import { useAuth } from "../hooks/useAuth";

const FIRST_NAME = "firstName";
const LAST_NAME = "lastName";
const EMAIL = "email";
const PASSWORD = "password";
const CONFIRM_PASSWORD = "confirmPassword";

const WORDING_ERRORS = {
    GENERIC_REGISTER_ERROR: 'Error al crear la cuenta. Por favor, inténtelo de nuevo.',
};

export default function RegisterLogin() {
    const { height } = useWindowDimensions();
    const theme = useTheme();

    const { register, isLoading } = useAuth();

    const [form, setForm] = useState({
        [FIRST_NAME]: "",
        [LAST_NAME]: "",
        [EMAIL]: "",
        [PASSWORD]: "",
        [CONFIRM_PASSWORD]: "",
    });

    const [errors, setErrors] = useState({
        [FIRST_NAME]: null as string | null,
        [LAST_NAME]: null as string | null,
        [EMAIL]: null as string | null,
        [PASSWORD]: null as string | null,
        [CONFIRM_PASSWORD]: null as string | null,
    });

    const [showPassword, setShowPassword] = useState(false);

    const onChangeText = (value: string, field: string) => {
        setForm({ ...form, [field]: value });
        if (value.length > 0) {
            setErrors({ ...errors, [field]: null });
        }
    };

    const onRegister = async () => {
        setErrors({ [FIRST_NAME]: null, [LAST_NAME]: null, [EMAIL]: null, [PASSWORD]: null, [CONFIRM_PASSWORD]: null });

        const newErrors = {
            [FIRST_NAME]: !form[FIRST_NAME] ? "El nombre es obligatorio" : null,
            [LAST_NAME]: !form[LAST_NAME] ? "El apellido es obligatorio" : null,
            [EMAIL]: !form[EMAIL]
                ? "El email es obligatorio"
                : !isValidEmail(form[EMAIL])
                    ? "El email no es válido"
                    : null,
            [PASSWORD]: !form[PASSWORD] ? "La contraseña es obligatoria" : null,
            [CONFIRM_PASSWORD]: !form[CONFIRM_PASSWORD]
                ? "Debe repetir la contraseña"
                : form[CONFIRM_PASSWORD] !== form[PASSWORD]
                    ? "Las contraseñas no coinciden"
                    : null,
        };

        setErrors(newErrors);
        if (Object.values(newErrors).some(Boolean)) return;

        try {
            await register(
                form[FIRST_NAME],
                form[LAST_NAME],
                form[EMAIL],
                form[PASSWORD],
            );

            Alert.alert("Éxito", "Cuenta creada correctamente");

            router.replace("/(auth)/login");
        } catch (error: any) {
            Alert.alert("Error", WORDING_ERRORS.GENERIC_REGISTER_ERROR);
        }
    };

    return (
        <KeyboardAwareScrollView
            bottomOffset={24}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            // El padding va en el contenido y no en el scroll: si no, el bottomOffset no lo tiene en cuenta y "Repetir contraseña" queda tapada.
            contentContainerStyle={{ backgroundColor: theme.colors.background, paddingHorizontal: 40, paddingTop: height * 0.3 }}
        >
            <View>
                <Text
                    variant="headlineLarge"
                    style={{
                        fontWeight: "bold",
                        color: theme.colors.onBackground,
                        marginBottom: 8,
                    }}
                >
                    Crear cuenta
                </Text>

                <Text
                    style={{
                        color: theme.colors.onSurfaceVariant,
                    }}
                >
                    Completa tus datos
                </Text>
            </View>

            <View style={{ marginTop: 20 }}>
                <TextInput
                    label="Nombre"
                    mode="outlined"
                    left={<TextInput.Icon icon="account" />}
                    value={form[FIRST_NAME]}
                    onChangeText={(value) => onChangeText(value, FIRST_NAME)}
                    error={!!errors[FIRST_NAME]}
                    style={{ marginBottom: 12 }}
                />
                {errors[FIRST_NAME] && (
                    <Text style={{ color: theme.colors.error, fontSize: 12, marginTop: -8, marginBottom: 8 }}>
                        {errors[FIRST_NAME]}
                    </Text>
                )}

                <TextInput
                    label="Apellido"
                    mode="outlined"
                    left={<TextInput.Icon icon="account" />}
                    value={form[LAST_NAME]}
                    onChangeText={(value) => onChangeText(value, LAST_NAME)}
                    error={!!errors[LAST_NAME]}
                    style={{ marginBottom: 12 }}
                />
                {errors[LAST_NAME] && (
                    <Text style={{ color: theme.colors.error, fontSize: 12, marginTop: -8, marginBottom: 8 }}>
                        {errors[LAST_NAME]}
                    </Text>
                )}

                <TextInput
                    label="Email"
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="email" />}
                    value={form[EMAIL]}
                    onChangeText={(value) => onChangeText(value, EMAIL)}
                    error={!!errors[EMAIL]}
                    style={{ marginBottom: 12 }}
                />
                {errors[EMAIL] && (
                    <Text style={{ color: theme.colors.error, fontSize: 12, marginTop: -8, marginBottom: 8 }}>
                        {errors[EMAIL]}
                    </Text>
                )}

                <TextInput
                    label="Contraseña"
                    mode="outlined"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="lock" />}
                    right={
                        <TextInput.Icon
                            icon={showPassword ? "eye-off" : "eye"}
                            onPress={() => setShowPassword(!showPassword)}
                        />
                    }
                    value={form[PASSWORD]}
                    onChangeText={(value) => onChangeText(value, PASSWORD)}
                    error={!!errors[PASSWORD]}
                />
                {errors[PASSWORD] && (
                    <Text style={{ color: theme.colors.error, fontSize: 12, marginTop: 4 }}>
                        {errors[PASSWORD]}
                    </Text>
                )}

                <TextInput
                    label="Repetir contraseña"
                    mode="outlined"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="lock" />}
                    value={form[CONFIRM_PASSWORD]}
                    onChangeText={(value) => onChangeText(value, CONFIRM_PASSWORD)}
                    error={!!errors[CONFIRM_PASSWORD]}
                    style={{ marginTop: 12 }}
                />
                {errors[CONFIRM_PASSWORD] && (
                    <Text style={{ color: theme.colors.error, fontSize: 12, marginTop: 4 }}>
                        {errors[CONFIRM_PASSWORD]}
                    </Text>
                )}
            </View>

            <Button
                mode="contained"
                icon="arrow-right"
                style={{ marginTop: 20 }}
                onPress={onRegister}
                loading={isLoading}
                disabled={isLoading}
            >
                Crear cuenta
            </Button>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 40 }}>
                <Text style={{ color: theme.colors.onSurfaceVariant }}>¿Ya tienes una cuenta? </Text>
                <Button
                    mode="text"
                    onPress={() => router.replace("/(auth)/login")}
                    labelStyle={{ color: theme.colors.primary, fontWeight: 'bold' }}
                >
                    Ingresar
                </Button>
            </View>
        </KeyboardAwareScrollView>
    );
}