import { Injectable } from '@angular/core';
import { get, set } from 'idb-keyval';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {


  getItem<T>(key: string): Observable<T | undefined> {
    return from(get(key))
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await set(key, value)
    } catch (error) {
      console.error(`Falha ao salvar a chave [${key}] no IndexedDB:`, error)
    }
  }
}
