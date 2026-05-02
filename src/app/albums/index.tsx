import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons'

export default function AlbumsScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Мої фото</Text>
            <TouchableOpacity style={styles.addBtnSmall}>
              <Feather name="camera" size={16} color="#6B7280" />
              <Text style={styles.addBtnText}>Додати фото</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push('/albums/id')}>
            <Image
              source={{ uri: 'https://placehold.co/400x400' }} 
              style={styles.photoMain}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { marginTop: 16 }]}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Настрій</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconCircle}>
                <Ionicons name="eye-outline" size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Feather name="more-vertical" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Природа</Text>
            <Text style={styles.value}>2025 рік</Text>
          </View>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Фотографії</Text>

          <TouchableOpacity
            style={styles.addPhotoPlaceholder}
            onPress={() => router.push('/albums/modal/create')}
          >
            <View style={styles.plusCircle}>
              <Text style={styles.plusText}>+</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#E5E7EB' }, 
  scroll: { flexGrow: 1, padding: 16 },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  addBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  addBtnText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  photoMain: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 12,
  },
  value: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  addPhotoPlaceholder: {
    width: 120,
    height: 150,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  plusCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    fontSize: 24,
    color: '#9CA3AF',
    lineHeight: 28,
  },
});