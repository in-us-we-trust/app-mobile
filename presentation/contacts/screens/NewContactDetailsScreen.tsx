import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import styled from 'styled-components/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { TextInput, Switch, Button, HelperText } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ContactType } from './NewContactTypeScreen';
import { useContacts } from '../hooks/useContacts';
import { usePhotoPicker } from '../hooks/usePhotoPicker';
import { imageUriToBase64 } from '@/helpers/image.helper';

/** El backend rechaza el alta con menos de 3 imágenes de referencia. */
const MIN_PHOTOS = 3;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormErrors = {
  photos?: string;
  name?: string;
  lastName?: string;
  role?: string;
  email?: string;
};

export default function NewContactDetailsScreen() {
  const router = useRouter();
  const { type, prefill } = useLocalSearchParams<{ type: ContactType; prefill?: string }>();
  const isNotify = type === 'notify';
  const { addContact, isSubmitting } = useContacts();
  const { selectedCaptures, clearSelection } = usePhotoPicker();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [notify, setNotify] = useState(true);
  const [isPreparingImages, setIsPreparingImages] = useState(false);
  // Los errores se muestran recién al intentar guardar, y el de un campo se
  // borra apenas se lo edita: si sigue mal, vuelve en el próximo "Guardar".
  const [errors, setErrors] = useState<FormErrors>({});

  const clearError = (field: keyof FormErrors) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  // Arranque limpio de un intento nuevo de alta (cubre re-entradas tras
  // cancelar o tras haber elegido una foto en un intento anterior). Se omite
  // cuando se llega desde el modal de "sugerencia de contacto", que precarga
  // las fotos detectadas antes de navegar hasta acá.
  useEffect(() => {
    if (prefill !== '1') {
      clearSelection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (selectedCaptures.length < MIN_PHOTOS) {
      nextErrors.photos = `Subí al menos ${MIN_PHOTOS} fotos (llevás ${selectedCaptures.length}).`;
    }
    if (!name.trim()) nextErrors.name = 'Ingresá el nombre.';
    if (!lastName.trim()) nextErrors.lastName = 'Ingresá el apellido.';
    if (!role.trim()) nextErrors.role = 'Ingresá la relación o rol.';
    if (isNotify) {
      if (!email.trim()) nextErrors.email = 'Ingresá el email.';
      else if (!EMAIL_REGEX.test(email.trim())) nextErrors.email = 'Ingresá un email válido.';
    }

    return nextErrors;
  };

  // Mismo criterio que en los campos de texto: al cambiar la selección de fotos
  // se limpia el error, aunque todavía no llegue al mínimo.
  useEffect(() => {
    clearError('photos');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCaptures.length]);

  const handleSave = async () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setIsPreparingImages(true);
      const images = await Promise.all(
        selectedCaptures.map((capture) => imageUriToBase64(capture.imageUri)),
      );
      setIsPreparingImages(false);

      const contactId = await addContact({
        name: name.trim(),
        lastName: lastName.trim(),
        role: role.trim(),
        email: isNotify ? email.trim() : undefined,
        notify: isNotify ? notify : false,
        type: isNotify ? 'cercano' : 'conocido',
        images,
      });

      // Se guarda antes de limpiar la selección: la confirmación muestra esta
      // foto como avatar (la URL real del backend todavía no la tenemos).
      const photoUri = selectedCaptures[0]?.imageUri ?? '';
      clearSelection();
      router.push({
        pathname: '/contacts/new/confirmation',
        params: { name: name.trim(), type, photoUri, contactId },
      });
    } catch (error) {
      setIsPreparingImages(false);
      Alert.alert('Error', 'No se pudo agregar el contacto. Intentalo de nuevo.');
    }
  };

  return (
    <Container>
      <KeyboardAwareScrollView
        contentContainerStyle={{ padding: 20, alignItems: 'center', flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
      >
        {selectedCaptures.length === 0 ? (
          <>
            <PhotoPicker onPress={() => router.push({ pathname: '/contacts/new/photo', params: prefill === '1' ? { prefill } : {} })}>
              <MaterialCommunityIcons name="camera-outline" size={26} color="#6C4EF5" />
            </PhotoPicker>
            <PhotoLabel>Cargar foto</PhotoLabel>
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
                {prefill !== '1' && (
                  <AddPhotoTile onPress={() => router.push('/contacts/new/photo')}>
                    <MaterialCommunityIcons name="plus" size={24} color="#6C4EF5" />
                  </AddPhotoTile>
                )}
                {selectedCaptures.map((capture) => (
                  <PhotoTile key={capture.id}>
                    <PhotoTileImage source={{ uri: capture.imageUri }} />
                  </PhotoTile>
                ))}
              </ScrollView>
            </View>
          </>
        )}
        <PhotoHint>
          La IA usa estas fotos para reconocer a la persona en la puerta. Necesita
          al menos {MIN_PHOTOS}.
        </PhotoHint>
        {!!errors.photos && <PhotoError>{errors.photos}</PhotoError>}

        {/* width: 100% explícito acá evita que el TextInput, al no tener
                    tamaño propio, herede el flex: 1 del contenedor y se estire. */}
        <FormSection>
          <FieldLabel>Nombre</FieldLabel>
          <TextInput
            mode="outlined"
            placeholder="Ej. María González"
            value={name}
            onChangeText={(text) => {
              setName(text);
              clearError('name');
            }}
            error={!!errors.name}
            style={{ backgroundColor: '#fff' }}
          />
          {!!errors.name && <HelperText type="error">{errors.name}</HelperText>}

          <FieldLabel>Apellido</FieldLabel>
          <TextInput
            mode="outlined"
            placeholder="Ej. Ríos"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              clearError('lastName');
            }}
            error={!!errors.lastName}
            style={{ backgroundColor: '#fff', marginBottom: 4 }}
          />
          {!!errors.lastName && <HelperText type="error">{errors.lastName}</HelperText>}

          <FieldLabel>Relación / Rol</FieldLabel>
          <TextInput
            mode="outlined"
            placeholder="Ej. Hija, Vecino, Encargada"
            value={role}
            onChangeText={(text) => {
              setRole(text);
              clearError('role');
            }}
            error={!!errors.role}
            style={{ backgroundColor: '#fff', marginBottom: 4 }}
          />
          {!!errors.role && <HelperText type="error">{errors.role}</HelperText>}

          {isNotify && (
            <>
              <FieldLabel>Email</FieldLabel>
              <TextInput
                mode="outlined"
                placeholder="ejemplo@mail.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearError('email');
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                error={!!errors.email}
                style={{ backgroundColor: '#fff' }}
              />
              {!!errors.email && <HelperText type="error">{errors.email}</HelperText>}
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
            loading={isSubmitting || isPreparingImages}
            disabled={isSubmitting || isPreparingImages}
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
      </KeyboardAwareScrollView>
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

const PhotoError = styled.Text`
  font-size: 12px;
  color: #b3261e;
  text-align: center;
  margin-top: -12px;
  margin-bottom: 16px;
  padding-horizontal: 24px;
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
