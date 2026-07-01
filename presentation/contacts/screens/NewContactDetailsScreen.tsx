import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TextInput, Switch, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ContactType } from './NewContactTypeScreen';

export default function NewContactDetailsScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: ContactType }>();
  const isNotify = type === 'notify';

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [notify, setNotify] = useState(true);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const handleSave = () => {
    const payload = {
      type,
      name,
      role,
      photoUri,
      // Solo se manda email/notify si es un contacto "a notificar"
      ...(isNotify && { email, notify }),
    };
    // TODO: conectar con el hook/servicio real de creación de contacto
    router.push({
      pathname: '/contacts/new/confirmation',
      params: { name, type, hasPhoto: photoUri ? '1' : '0' },
    });
  };

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{ padding: 20, alignItems: 'center', flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <PhotoPicker onPress={() => {/* TODO: abrir cámara / image picker */ }}>
          <MaterialCommunityIcons name="camera-outline" size={26} color="#6C4EF5" />
        </PhotoPicker>
        <PhotoLabel>Tomar foto</PhotoLabel>
        <PhotoHint>La IA usa esta foto para reconocer a la persona en la puerta.</PhotoHint>

        {/* width: 100% explícito acá evita que el TextInput, al no tener
                    tamaño propio, herede el flex: 1 del contenedor y se estire. */}
        <FormSection>
          <FieldLabel>Nombre</FieldLabel>
          <TextInput
            mode="outlined"
            placeholder="Ej. María González"
            value={name}
            onChangeText={setName}
            style={{ backgroundColor: '#fff' }}
          />

          <FieldLabel>Relación / Rol</FieldLabel>
          <TextInput
            mode="outlined"
            placeholder="Ej. Hija, Vecino, Encargada"
            value={role}
            onChangeText={setRole}
            style={{ backgroundColor: '#fff', marginBottom: 4 }}
          />

          {isNotify && (
            <>
              <FieldLabel>Email</FieldLabel>
              <TextInput
                mode="outlined"
                placeholder="ejemplo@mail.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{ backgroundColor: '#fff' }}
              />

              <SwitchRow>
                <SwitchTextWrapper>
                  <SwitchTitle>Notificar en incidentes</SwitchTitle>
                  <SwitchDescription>Le llega una alerta si pasa algo.</SwitchDescription>
                </SwitchTextWrapper>
                <Switch value={notify} onValueChange={setNotify} color="#6C4EF5" />
              </SwitchRow>
            </>
          )}
        </FormSection>

        <Footer>
          <Button mode="contained" onPress={handleSave} contentStyle={{ height: 48 }}>
            Guardar contacto
          </Button>
          <Button
            mode="text"
            onPress={() => router.navigate('/contacts')}
            style={{ marginTop: 4 }}
            contentStyle={{ height: 44 }}
          >
            Cancelar
          </Button>
        </Footer>
      </ScrollView>
    </Container>
  );
}

// ---------- Estilos ----------

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const PhotoPicker = styled.Pressable`
  width: 76px;
  height: 76px;
  border-radius: 38px;
  border-width: 1.5px;
  border-color: #6C4EF5;
  border-style: dashed;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
`;

const PhotoLabel = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #6C4EF5;
  margin-top: 8px;
`;

const PhotoHint = styled.Text`
  font-size: 12px;
  color: #999;
  text-align: center;
  margin-top: 4px;
  margin-bottom: 20px;
  padding-horizontal: 24px;
`;

const FormSection = styled.View`
  width: 100%;
`;

const FieldLabel = styled.Text`
  align-self: flex-start;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  margin-top: 12px;
`;

const SwitchRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 16px;
`;

const SwitchTextWrapper = styled.View`
  flex: 1;
  padding-right: 12px;
`;

const SwitchTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
`;

const SwitchDescription = styled.Text`
  font-size: 12px;
  color: #999;
  margin-top: 2px;
`;

const Footer = styled.View`
  margin-top: 28px;
  width: 100%;
`;
