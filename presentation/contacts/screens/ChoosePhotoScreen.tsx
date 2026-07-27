import React, { useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { SegmentedButtons, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePhotoPicker } from '../hooks/usePhotoPicker';
import { MOCK_DOORBELL_CAPTURES } from '../mocks/doorbellCapturesMock';
import { DoorbellCapture } from '../types';

type PhotoSource = 'timbre' | 'galeria';

export default function ChoosePhotoScreen() {
  const router = useRouter();
  const { selectedCaptures, setSelectedCaptures } = usePhotoPicker();
  const [source, setSource] = useState<PhotoSource>('timbre');
  const [selectedIds, setSelectedIds] = useState<string[]>(
    selectedCaptures.map((c) => c.id),
  );

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleConfirm = () => {
    const captures = MOCK_DOORBELL_CAPTURES.filter((c) => selectedIds.includes(c.id));
    if (captures.length === 0) return;
    setSelectedCaptures(captures);
    router.back();
  };

  return (
    <Container>
      <SegmentedButtons
        value={source}
        onValueChange={(v) => setSource(v as PhotoSource)}
        buttons={[
          { value: 'timbre', label: 'Del timbre' },
          { value: 'galeria', label: 'De tu galería' },
        ]}
        style={{ marginHorizontal: 16, marginTop: 16, marginBottom: 12 }}
      />

      {source === 'timbre' ? (
        <>
          <Subtitle>Capturas recientes de tu timbre. Elegí la que muestre mejor su rostro.</Subtitle>
          <FlatList
            data={MOCK_DOORBELL_CAPTURES}
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
        <EmptyGallery>
          <MaterialCommunityIcons name="image-multiple-outline" size={40} color="#ccc" />
          <EmptyGalleryText>Elegir fotos de tu galería va a estar disponible pronto.</EmptyGalleryText>
        </EmptyGallery>
      )}

      <Footer>
        <Button
          mode="contained"
          onPress={handleConfirm}
          disabled={source === 'galeria' || selectedIds.length === 0}
          contentStyle={{ height: 48 }}
        >
          {selectedIds.length > 0 ? `Usar ${selectedIds.length} foto${selectedIds.length > 1 ? 's' : ''}` : 'Usar esta foto'}
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
`;
