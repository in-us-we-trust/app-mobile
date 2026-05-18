import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    ScrollView,
} from "react-native";

import {
    Button,
    Text,
    TextInput,
    useTheme,
} from "react-native-paper";

import { useAuth } from "../hooks/useAuth";

const FIRST_NAME = "firstName";
const LAST_NAME = "lastName";
const EMAIL = "email";
const PASSWORD = "password";

export default function RegisterLogin() {
    const theme = useTheme();

    const { register, isLoading } = useAuth();

    const [form, setForm] = useState({
        [FIRST_NAME]: "",
        [LAST_NAME]: "",
        [EMAIL]: "",
        [PASSWORD]: "",
    });

    const [errors, setErrors] = useState({
        [FIRST_NAME]: "",
        [LAST_NAME]: "",
        [EMAIL]: "",
        [PASSWORD]: "",
    });

    const onChangeText = (field: string, value: string) => {
        setForm({
            ...form,
            [field]: value,
        });

        setErrors({
            ...errors,
            [field]: "",
        });
    };

    const validate = () => {
        const newErrors = {
            [FIRST_NAME]: !form[FIRST_NAME]
                ? "El nombre es obligatorio"
                : "",

            [LAST_NAME]: !form[LAST_NAME]
                ? "El apellido es obligatorio"
                : "",

            [EMAIL]: !form[EMAIL]
                ? "El email es obligatorio"
                : "",

            [PASSWORD]: !form[PASSWORD]
                ? "La contraseña es obligatoria"
                : "",
        };

        setErrors(newErrors);

        return !Object.values(newErrors).some(Boolean);
    };

    const onRegister = async () => {
        if (!validate()) return;

        try {
            await register(
                form[FIRST_NAME],
                form[LAST_NAME],
                form[EMAIL],
                form[PASSWORD],
            );

            Alert.alert("Éxito", "Cuenta creada correctamente");

            router.replace("/(auth)/login");
        } catch (error) {
            Alert.alert(
                "Error",
                "No se pudo crear la cuenta"
            );
        }
    };

    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
            }}
        >
            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingTop: 80,
                }}
            >
                <Text
                    variant="headlineLarge"
                    style={{
                        fontWeight: "bold",
                        marginBottom: 8,
                    }}
                >
                    Crear cuenta
                </Text>

                <Text
                    style={{
                        marginBottom: 32,
                        color: theme.colors.onSurfaceVariant,
                    }}
                >
                    Completa tus datos
                </Text>

                <TextInput
                    label="Nombre"
                    mode="outlined"
                    value={form[FIRST_NAME]}
                    onChangeText={(value) =>
                        onChangeText(FIRST_NAME, value)
                    }
                    error={!!errors[FIRST_NAME]}
                    style={{ marginBottom: 12 }}
                />

                <TextInput
                    label="Apellido"
                    mode="outlined"
                    value={form[LAST_NAME]}
                    onChangeText={(value) =>
                        onChangeText(LAST_NAME, value)
                    }
                    error={!!errors[LAST_NAME]}
                    style={{ marginBottom: 12 }}
                />

                <TextInput
                    label="Email"
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={form[EMAIL]}
                    onChangeText={(value) =>
                        onChangeText(EMAIL, value)
                    }
                    error={!!errors[EMAIL]}
                    style={{ marginBottom: 12 }}
                />

                <TextInput
                    label="Contraseña"
                    mode="outlined"
                    secureTextEntry
                    autoCapitalize="none"
                    value={form[PASSWORD]}
                    onChangeText={(value) =>
                        onChangeText(PASSWORD, value)
                    }
                    error={!!errors[PASSWORD]}
                    style={{ marginBottom: 24 }}
                />

                <Button
                    mode="contained"
                    onPress={onRegister}
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Crear cuenta
                </Button>

                <Button
                    mode="text"
                    onPress={() =>
                        router.replace("/(auth)/login")
                    }
                    style={{
                        marginTop: 16,
                    }}
                >
                    Ya tengo cuenta
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}