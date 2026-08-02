import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useContactDetail } from '../hooks/useContactDetail';
import { RecognitionStatus } from '../types';
import { imageUriToBase64 } from '@/helpers/image.helper';
import { EditPersonalInfoModal, PersonalInfoFormData } from '../components/EditPersonalInfoModal';
import { ContactInfoFormData, EditContactInfoModal } from '../components/EditContactInfoModal';

type EditingSection = 'personal' | 'contact' | null;

const RECOGNITION_LABEL: Record<RecognitionStatus, string> = {
  active: 'Activo',
  pending: 'Pendiente',
  missing_photo: 'Sin foto',
};

const RECOGNITION_COLOR: Record<RecognitionStatus, string> = {
  active: '#0FA968',
  pending: '#F5A623',
  missing_photo: '#E5534B',
};

export default function ContactDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { contact, isLoading, isSubmitting, addContactImages, updateContact, toggleNotify } = useContactDetail(id);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [editingSection, setEditingSection] = useState<EditingSection>(null);

  const handleSavePersonalInfo = async (data: PersonalInfoFormData) => {
    if (!contact) return;
    try {
      await updateContact(contact.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        email: contact.email,
        cellphone: contact.cellphone,
      });
      // "notify" no viaja en el PATCH (el backend no tiene ese campo), así que
      // se ajusta aparte si el usuario lo cambió en el switch.
      if (data.notify !== contact.notify) {
        toggleNotify(contact.id);
      }
      setEditingSection(null);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los cambios. Intentalo de nuevo.');
    }
  };

  const handleSaveContactInfo = async (data: ContactInfoFormData) => {
    if (!contact) return;
    try {
      await updateContact(contact.id, {
        firstName: contact.firstName,
        lastName: contact.lastName,
        role: contact.relation,
        email: data.email.trim() || null,
        cellphone: data.cellphone.trim() || null,
      });
      setEditingSection(null);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los cambios. Intentalo de nuevo.');
    }
  };

  const handleAddPhotos = async () => {
    if (!contact) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso necesario',
        'Necesitamos acceso a tu galería para que puedas elegir una foto.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 15,
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.length) return;

    setIsUploadingPhotos(true);
    try {
      const images = await Promise.all(
        result.assets.map((asset) => imageUriToBase64(asset.uri)),
      );
      await addContactImages(contact.id, images);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron agregar las fotos. Intentalo de nuevo.');
    } finally {
      setIsUploadingPhotos(false);
    }
  };

  if (isLoading && !contact) {
    return (
      <CenteredContainer>
        <ActivityIndicator color="#6C4EF5" />
      </CenteredContainer>
    );
  }

  if (!contact) {
    return (
      <CenteredContainer>
        <NotFoundText>Contacto no encontrado</NotFoundText>
        <BackButton onPress={() => router.navigate('/contacts')} style={{ marginTop: 16 }}>
          <MaterialCommunityIcons name="chevron-left" size={20} color="#6C4EF5" />
          <BackButtonText>Volver a contactos</BackButtonText>
        </BackButton>
      </CenteredContainer>
    );
  }

  const hasContactInfo = !!contact.email || !!contact.cellphone;

  return (
    <Container>
      <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
        <BackButton onPress={() => router.navigate('/contacts')} style={{ alignSelf: 'flex-start', marginBottom: 12 }}>
          <MaterialCommunityIcons name="chevron-left" size={20} color="#6C4EF5" />
          <BackButtonText>Volver a contactos</BackButtonText>
        </BackButton>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingBottom: 4 }}
          style={{ width: '100%', marginBottom: 20 }}
        >
          <AddPhotoTile onPress={handleAddPhotos} disabled={isUploadingPhotos}>
            {isUploadingPhotos ? (
              <ActivityIndicator color="#6C4EF5" />
            ) : (
              <MaterialCommunityIcons name="plus" size={24} color="#6C4EF5" />
            )}
          </AddPhotoTile>
          {contact.photos.map((uri, index) => (
            <PhotoTile key={`${uri}-${index}`}>
              <PhotoTileImage source={{ uri }} />
            </PhotoTile>
          ))}
        </ScrollView>
        <SectionHeader>
          <SectionLabel>Información personal</SectionLabel>
          <EditIconButton onPress={() => setEditingSection('personal')} hitSlop={8}>
            <MaterialCommunityIcons name="pencil-outline" size={16} color="#6C4EF5" />
          </EditIconButton>
        </SectionHeader>
        <Card>
          <InfoRow>
            <RowLabel>Nombre</RowLabel>
            <RowValue>{contact.name}</RowValue>
          </InfoRow>
          <InfoRow>
            <RowLabel>Relación / Rol</RowLabel>
            <RowValue>{contact.relation || '-'}</RowValue>
          </InfoRow>
          <InfoRowLast>
            <RowLabel>Reconocimiento IA</RowLabel>
            <StatusValueRow>
              <StatusDot color={RECOGNITION_COLOR[contact.recognitionStatus]} />
              <RowValue>{RECOGNITION_LABEL[contact.recognitionStatus]}</RowValue>
            </StatusValueRow>
          </InfoRowLast>
        </Card>

        <SectionHeader>
          <SectionLabel>Información de contacto</SectionLabel>
          {hasContactInfo && (
            <EditIconButton onPress={() => setEditingSection('contact')} hitSlop={8}>
              <MaterialCommunityIcons name="pencil-outline" size={16} color="#6C4EF5" />
            </EditIconButton>
          )}
        </SectionHeader>
        {hasContactInfo ? (
          <Card>
            {contact.cellphone && (
              <ContactInfoRow withBorder={!!contact.email}>
                <IconCircle background="#EAF1FF">
                  <MaterialCommunityIcons name="phone-outline" size={18} color="#4E7FF5" />
                </IconCircle>
                <InfoText>
                  <InfoLabel>Teléfono</InfoLabel>
                  <InfoValue>{contact.cellphone}</InfoValue>
                </InfoText>
              </ContactInfoRow>
            )}
            {contact.email && (
              <ContactInfoRow withBorder={false}>
                <IconCircle background="#F5F2FF">
                  <MaterialCommunityIcons name="email-outline" size={18} color="#6C4EF5" />
                </IconCircle>
                <InfoText>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>{contact.email}</InfoValue>
                </InfoText>
              </ContactInfoRow>
            )}
          </Card>
        ) : (
          <EmptyContactCard onPress={() => setEditingSection('contact')}>
            <EmptyContactIcon>
              <MaterialCommunityIcons name="plus" size={20} color="#6C4EF5" />
            </EmptyContactIcon>
            <EmptyContactTitle>Sin datos de contacto</EmptyContactTitle>
            <EmptyContactSubtitle>
              Agregá un teléfono o email para poder contactarla.
            </EmptyContactSubtitle>
          </EmptyContactCard>
        )}

        <DeleteButton onPress={() => { }}>
          <MaterialCommunityIcons name="trash-can-outline" size={18} color="#E5534B" />
          <DeleteButtonText>Eliminar contacto</DeleteButtonText>
        </DeleteButton>
      </ScrollView>

      <EditPersonalInfoModal
        visible={editingSection === 'personal'}
        contact={contact}
        isSaving={isSubmitting}
        onClose={() => setEditingSection(null)}
        onSave={handleSavePersonalInfo}
      />

      <EditContactInfoModal
        visible={editingSection === 'contact'}
        contact={contact}
        isSaving={isSubmitting}
        onClose={() => setEditingSection(null)}
        onSave={handleSaveContactInfo}
      />
    </Container>
  );
}

// ---------- Estilos ----------

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const CenteredContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #fff;
`;

const NotFoundText = styled.Text`
  color: #999;
  font-size: 14px;
`;

const BackButton = styled.Pressable`
  flex-direction: row;
  align-items: center;
`;

const BackButtonText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #6c4ef5;
  margin-left: 2px;
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

const AddPhotoTile = styled.Pressable`
  width: 90px;
  height: 90px;
  border-radius: 12px;
  border-width: 1.5px;
  border-color: #6c4ef5;
  border-style: dashed;
  align-items: center;
  justify-content: center;
`;

const Name = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
`;

const Relation = styled.Text`
  font-size: 14px;
  color: #777;
  margin-top: 2px;
  margin-bottom: 14px;
  text-align: center;
`;

const StatusBadge = styled.View<{ background: string }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ background }) => background};
  border-radius: 20px;
  padding: 6px 14px;
  gap: 6px;
  margin-bottom: 24px;
`;

const StatusBadgeText = styled.Text<{ color: string }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ color }) => color};
`;

const SectionHeader = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const SectionLabel = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const EditIconButton = styled.Pressable`
  width: 26px;
  height: 26px;
  border-radius: 13px;
  align-items: center;
  justify-content: center;
`;

const Card = styled.View`
  width: 100%;
  background-color: #fff;
  border-width: 1px;
  border-color: #eee;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 20px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom-width: 1px;
  border-bottom-color: #eee;
`;

const InfoRowLast = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
`;

const RowLabel = styled.Text`
  font-size: 13px;
  color: #777;
`;

const RowValue = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
`;

const StatusValueRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const StatusDot = styled.View<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ color }) => color};
`;

const ContactInfoRow = styled.View<{ withBorder: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 14px 16px;
  border-bottom-width: ${({ withBorder }) => (withBorder ? 1 : 0)}px;
  border-bottom-color: #eee;
`;

const IconCircle = styled.View<{ background: string }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${({ background }) => background};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const InfoText = styled.View`
  flex: 1;
`;

const InfoLabel = styled.Text`
  font-size: 12px;
  color: #999;
`;

const InfoValue = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-top: 2px;
`;

const EmptyContactCard = styled.Pressable`
  width: 100%;
  align-items: center;
  border-width: 1.5px;
  border-style: dashed;
  border-color: #e5e5ea;
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 20px;
`;

const EmptyContactIcon = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f5f2ff;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

const EmptyContactTitle = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
`;

const EmptyContactSubtitle = styled.Text`
  font-size: 12px;
  color: #999;
  text-align: center;
  margin-top: 4px;
  line-height: 17px;
  padding-horizontal: 12px;
`;

const DeleteButton = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px;
  margin-top: 4px;
`;

const DeleteButtonText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #e5534b;
`;
