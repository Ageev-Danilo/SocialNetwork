import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Input, Button, Icon } from '@/shared/ui';
import { BASE, COLORS } from '@/shared/consts';
import { THEMES, YEARS } from '@/modules/albums/albums.mock';

export default function CreateAlbumScreen() {
    const [name,       setName]       = useState('');
    const [theme,      setTheme]      = useState('');
    const [year,       setYear]       = useState('');
    const [themeOpen,  setThemeOpen]  = useState(false);
    const [yearOpen,   setYearOpen]   = useState(false);

    function handleCreate() {
        if (!name.trim()) return;
        router.back();
    }

    return (
        <ScrollView
            contentContainerStyle={styles.overlay}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.modal}>
                <View style={[BASE.yc, { justifyContent: 'space-between', marginBottom: 20 }]}>
                    <Text style={styles.title}>Створити альбом</Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Icon name="close" size={20} />
                    </TouchableOpacity>
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Назва альбому</Text>
                    <Input
                        value={name}
                        onChangeText={setName}
                        holder="Настрій"
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Оберіть тему</Text>
                    <TouchableOpacity
                        style={styles.select}
                        onPress={() => { setThemeOpen(v => !v); setYearOpen(false); }}
                    >
                        <Text style={theme ? styles.selectValue : styles.selectPlaceholder}>
                            {theme || 'Природа'}
                        </Text>
                        <Text style={{ color: '#666' }}>∨</Text>
                    </TouchableOpacity>
                    {themeOpen && (
                        <View style={styles.dropdown}>
                            {THEMES.map((t) => (
                                <TouchableOpacity
                                    key={t}
                                    style={styles.dropdownItem}
                                    onPress={() => { setTheme(t); setThemeOpen(false); }}
                                >
                                    <Text style={styles.dropdownText}>{t}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Рік альбому</Text>
                    <TouchableOpacity
                        style={styles.select}
                        onPress={() => { setYearOpen(v => !v); setThemeOpen(false); }}
                    >
                        <Text style={year ? styles.selectValue : styles.selectPlaceholder}>
                            {year || 'Оберіть рік'}
                        </Text>
                        <Text style={{ color: '#666' }}>∨</Text>
                    </TouchableOpacity>
                    {yearOpen && (
                        <View style={styles.dropdown}>
                            {YEARS.map((y) => (
                                <TouchableOpacity
                                    key={y}
                                    style={styles.dropdownItem}
                                    onPress={() => { setYear(y); setYearOpen(false); }}
                                >
                                    <Text style={styles.dropdownText}>{y} рік</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                <View style={[BASE.yc, { justifyContent: 'flex-end', gap: 10, marginTop: 8 }]}>
                    <Button type="outline" text="Скасувати" onPress={() => router.back()} />
                    <Button type="fill"    text="Зберегти"  onPress={handleCreate} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flexGrow:        1,
        justifyContent:  'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding:         20,
    },
    modal: {
        borderRadius:    20,
        backgroundColor: '#fff',
        padding:         24,
        gap:             4,
    },
    title: {
        fontSize:   18,
        fontWeight: '700',
        color:      '#1a1a1a',
    },
    field: {
        gap:        6,
        marginTop:  14,
    },
    label: {
        fontSize:   14,
        fontWeight: '500',
        color:      '#1a1a1a',
    },
    select: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'center',
        borderWidth:    1,
        borderColor:    '#CDCED2',
        borderRadius:   10,
        paddingHorizontal: 16,
        paddingVertical:   12,
    },
    selectPlaceholder: {
        color:    '#999',
        fontSize: 14,
    },
    selectValue: {
        color:    '#1a1a1a',
        fontSize: 14,
    },
    dropdown: {
        borderWidth:   1,
        borderColor:   '#eee',
        borderRadius:  10,
        backgroundColor: '#fff',
        elevation:     4,
        shadowColor:   '#000',
        shadowOpacity: 0.08,
        shadowRadius:  8,
        shadowOffset:  { width: 0, height: 2 },
    },
    dropdownItem: {
        paddingHorizontal: 16,
        paddingVertical:   12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    dropdownText: {
        fontSize: 14,
        color:    '#1a1a1a',
    },
});