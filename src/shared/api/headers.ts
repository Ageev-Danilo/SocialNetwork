import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BaseQueryApi } from '@reduxjs/toolkit/query';

export async function queryBaseHeaders(
    headers: Headers,
    _api: Pick<BaseQueryApi, 'getState' | 'extra' | 'endpoint' | 'type' | 'forced'>
) {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
}