import React, { useState } from 'react';
import { Alert, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { usePhotoPicker } from '../hooks/usePhotoPicker';
import { MOCK_DOORBELL_CAPTURES } from '../mocks/doorbellCapturesMock';
import { DoorbellCapture } from '../types';

/** Mismo mínimo que exige el alta (y el backend) para poder reconocer a la persona. */
const MIN_PHOTOS = 3;

export default function ChoosePhotoScreen() {
  const router = useRouter();
  const { prefill } = useLocalSearchParams<{ prefill?: string }>();
  // Cuando se llega desde una sugerencia de contacto (ver
  // EventsScreen.handleAcceptSuggestion), solo puede usarse lo que recomienda
  // el timbre, no fotos nuevas de la galería. En el alta normal es al revés:
  // no se ofrecen las capturas del timbre.
  const isSuggestionFlow = prefill === '1';
  const {
    selectedCaptures,
    setSelectedCaptures,
    galleryCaptures,
    addGalleryCaptures,
    suggestedCaptures,
  } = usePhotoPicker();
  const [selectedIds, setSelectedIds] = useState<string[]>(
    selectedCaptures.map((c) => c.id),
  );
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const doorbellCaptures = [...suggestedCaptures, ...MOCK_DOORBELL_CAPTURES];

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const pickFromGallery = async () => {
    setIsLoadingGallery(true);
    try {
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

      const newCaptures: DoorbellCapture[] = result.assets.map((asset, index) => ({
        id: asset.assetId ?? `${asset.uri}-${index}`,
        label: 'Galería',
        imageUri: asset.uri,
      }));

      addGalleryCaptures(newCaptures);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...newCaptures.map((c) => c.id)])));
    } finally {
      setIsLoadingGallery(false);
    }
  };

  const handleConfirm = () => {
    const allCaptures = [...doorbellCaptures, ...galleryCaptures];
    const captures = allCaptures.filter((c) => selectedIds.includes(c.id));
    if (captures.length === 0) return;
    setSelectedCaptures(captures);
    router.back();
  };

  const handleBack = () => {
    router.back();
  }

  return (
    <Container>
      {isSuggestionFlow ? (
        <>
          <Subtitle style={{ marginTop: 16 }}>
            Capturas recientes de tu timbre. Elegí la que muestre mejor su rostro.
          </Subtitle>
          <FlatList
            data={doorbellCaptures}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}
            columnWrapperStyle={{ gap: 12 }}
            renderItem={({ item }) => (
              <CaptureCard
                capture={item}
                selected={selectedIds.includes(item.id)}
                onPress={() => toggleSelection(item.id)}
              />
            )}
          />
        </>
      ) : (
        <>
          <GalleryActions style={{ marginTop: 16 }}>
            <Button
              mode="outlined"
              icon="image-multiple-outline"
              onPress={pickFromGallery}
              loading={isLoadingGallery}
              disabled={isLoadingGallery}
            >
              {galleryCaptures.length > 0 ? 'Agregar más fotos' : 'Elegir de la galería'}
            </Button>
          </GalleryActions>

          {galleryCaptures.length === 0 ? (
            <EmptyGallery>
              <MaterialCommunityIcons name="image-multiple-outline" size={40} color="#ccc" />
              <EmptyGalleryText>Elegí una o más fotos de tu galería para usarlas como referencia.</EmptyGalleryText>
            </EmptyGallery>
          ) : (
            <FlatList
              data={galleryCaptures}
              keyExtractor={(item) => item.id}
              numColumns={3}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}
              columnWrapperStyle={{ gap: 12 }}
              renderItem={({ item }) => (
                <CaptureCard
                  capture={item}
                  selected={selectedIds.includes(item.id)}
                  onPress={() => toggleSelection(item.id)}
                />
              )}
            />
          )}
        </>
      )}

      <Footer>
        {/* Solo informativo: el mínimo lo valida el form del alta, acá se puede
            confirmar con menos e ir sumando fotos en varias pasadas. */}
        {selectedIds.length < MIN_PHOTOS && (
          <SelectionHint>
            {`Se necesitan al menos ${MIN_PHOTOS} fotos (llevás ${selectedIds.length}).`}
          </SelectionHint>
        )}
        <Button
          mode="contained"
          onPress={handleConfirm}
          disabled={selectedIds.length === 0}
          contentStyle={{ height: 48 }}
        >
          {selectedIds.length > 0 ? `Usar ${selectedIds.length} foto${selectedIds.length > 1 ? 's' : ''}` : 'Usar estas fotos'}
        </Button>
        <Button
          mode="outlined"
          onPress={handleBack}
          contentStyle={{ height: 48 }}
        >
          Volver
        </Button>
      </Footer>
    </Container>
  );
}

function CaptureCard({
  capture,
  selected,
  onPress,
}: {
  capture: DoorbellCapture;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Card selected={selected} onPress={onPress}>
      <Thumbnail source={{ uri: capture.imageUri }} />
      <TimeBadge>
        <TimeBadgeText>{capture.label}</TimeBadgeText>
      </TimeBadge>
      {selected && (
        <CheckBadge>
          <MaterialCommunityIcons name="check" size={14} color="#fff" />
        </CheckBadge>
      )}
    </Card>
  );
}

// ---------- Estilos ----------

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const Subtitle = styled.Text`
  font-size: 13px;
  color: #777;
  padding-horizontal: 16px;
  margin-bottom: 12px;
  line-height: 18px;
`;

const Card = styled.Pressable<{ selected: boolean }>`
  flex: 1;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f0f0f0;
  border-width: ${({ selected }) => (selected ? 2 : 0)}px;
  border-color: #6C4EF5;
`;

const Thumbnail = styled.Image`
  width: 100%;
  height: 100%;
`;

const TimeBadge = styled.View`
  position: absolute;
  top: 6px;
  left: 6px;
  background-color: rgba(0, 0, 0, 0.55);
  border-radius: 6px;
  padding: 2px 6px;
`;

const TimeBadgeText = styled.Text`
  font-size: 10px;
  font-weight: 600;
  color: #fff;
`;

const CheckBadge = styled.View`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #0fa968;
  align-items: center;
  justify-content: center;
`;

const GalleryActions = styled.View`
  padding-horizontal: 16px;
  margin-bottom: 12px;
`;

const EmptyGallery = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-horizontal: 40px;
`;

const EmptyGalleryText = styled.Text`
  font-size: 13px;
  color: #999;
  text-align: center;
  margin-top: 12px;
  line-height: 18px;
`;

const Footer = styled.View`
  padding: 16px;
  gap: 12px;
`;

const SelectionHint = styled.Text`
  font-size: 12px;
  color: #999;
  text-align: center;
`;
