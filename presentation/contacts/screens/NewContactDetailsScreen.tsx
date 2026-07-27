import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import styled from 'styled-components/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TextInput, Switch, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ContactType } from './NewContactTypeScreen';
import { useContacts } from '../hooks/useContacts';
import { usePhotoPicker } from '../hooks/usePhotoPicker';

export default function NewContactDetailsScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: ContactType }>();
  const isNotify = type === 'notify';
  const { addContactos, isSubmitting } = useContacts();
  const { selectedCaptures, clearSelection } = usePhotoPicker();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [notify, setNotify] = useState(true);

  // Arranque limpio de un intento nuevo de alta (cubre re-entradas tras
  // cancelar o tras haber elegido una foto en un intento anterior).
  useEffect(() => {
    clearSelection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    try {
      // TODO: reemplazar por las fotos reales una vez que se implemente la
      // captura (el backend requiere al menos 3 imágenes en base64).
      await addContactos({
        name,
        lastName,
        role,
        email: isNotify ? email : undefined,
        notify: isNotify ? notify : false,
        type: isNotify ? 'cercano' : 'conocido',
        images: [],
      });
      clearSelection();
      router.push({
        pathname: '/contacts/new/confirmation',
        params: { name, type, hasPhoto: selectedCaptures.length > 0 ? '1' : '0' },
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el contacto. Intentalo de nuevo.');
    }
  };

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{ padding: 20, alignItems: 'center', flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {selectedCaptures.length === 0 ? (
          <>
            <PhotoPicker onPress={() => router.push('/contacts/new/photo')}>
              <MaterialCommunityIcons name="camera-outline" size={26} color="#6C4EF5" />
            </PhotoPicker>
            <PhotoLabel>Tomar foto</PhotoLabel>
          </>
        ) : (
          <>
            <PhotoLabel>
              {`${selectedCaptures.length} foto${selectedCaptures.length > 1 ? 's' : ''} seleccionada${selectedCaptures.length > 1 ? 's' : ''}`}
            </PhotoLabel>
            <View style={{ height: 110, width: '100%' }}>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10, paddingVertical: 8 }}
                style={{ width: '100%', marginTop: 4 }}
              >
                <AddPhotoTile onPress={() => router.push('/contacts/new/photo')}>
                  <MaterialCommunityIcons name="plus" size={24} color="#6C4EF5" />
                </AddPhotoTile>
                {selectedCaptures.map((capture) => (
                  <PhotoTile key={capture.id}>
                    <PhotoTileImage source={{ uri: capture.imageUri }} />
                  </PhotoTile>
                ))}
              </ScrollView>
            </View>
          </>
        )}
        <PhotoHint>La IA usa estas foto para reconocer a la persona en la puerta.</PhotoHint>

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
          {!isNotify && (
            <>
              <FieldLabel>Apellido</FieldLabel>
              <TextInput
                mode="outlined"
                placeholder="Ej. Ríos"
                value={lastName}
                onChangeText={setLastName}
                style={{ backgroundColor: '#fff', marginBottom: 4 }}
              />
            </>
          )}

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
            </>
          )}

          {isNotify && (
            <SwitchRow>
              <SwitchTextWrapper>
                <SwitchTitle>Notificar en incidentes</SwitchTitle>
                <SwitchDescription>Le llega una alerta si pasa algo.</SwitchDescription>
              </SwitchTextWrapper>
              <Switch value={notify} onValueChange={setNotify} color="#6C4EF5" />
            </SwitchRow>
          )}
        </FormSection>

        <Footer>
          <Button
            mode="contained"
            onPress={handleSave}
            contentStyle={{ height: 48 }}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
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

const AddPhotoTile = styled.Pressable`
  width: 90px;
  height: 90px;
  border-radius: 12px;
  border-width: 1.5px;
  border-color: #6C4EF5;
  border-style: dashed;
  align-items: center;
  justify-content: center;
`;

const PhotoTile = styled.View`
  width: 90px;
  height: 90px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f0f0f0;
`;

const PhotoTileImage = styled.Image`
  width: 100%;
  height: 100%;
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
