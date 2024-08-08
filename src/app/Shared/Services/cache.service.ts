import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class CacheService {
    async clearCacheForFile(filename: string): Promise<any> {

        // Replace 'cache-buster' with a unique name for your cache.
        const cache = await caches.open('asset-cache');

        try {
            const keys = await cache.keys();

            for (const key of keys) {
                if (key.url.includes(filename)) {
                    await cache.delete(key);
                }
            }
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }
}