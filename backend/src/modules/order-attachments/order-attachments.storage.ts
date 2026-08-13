export interface AttachmentStorage {
  upload(path: string, bytes: Buffer, mimeType: string): Promise<void>
  remove(path: string): Promise<void>
  createSignedUrl(path: string): Promise<string>
}

type StorageBucket = {
  upload(path: string, bytes: Buffer, options: { contentType: string; upsert: false }): Promise<{ error: Error | null }>
  remove(paths: string[]): Promise<{ error: Error | null }>
  createSignedUrl(path: string, expiresIn: number): Promise<{ data: { signedUrl: string } | null; error: Error | null }>
}

type StorageClient = { storage: { from(bucket: string): StorageBucket } }

export class SupabaseAttachmentStorage implements AttachmentStorage {
  private readonly bucket: StorageBucket

  constructor(client: StorageClient) {
    this.bucket = client.storage.from('order-attachments')
  }

  async upload(path: string, bytes: Buffer, mimeType: string) {
    const { error } = await this.bucket.upload(path, bytes, { contentType: mimeType, upsert: false })
    if (error) throw error
  }

  async remove(path: string) {
    const { error } = await this.bucket.remove([path])
    if (error) throw error
  }

  async createSignedUrl(path: string) {
    const { data, error } = await this.bucket.createSignedUrl(path, 60)
    if (error || !data?.signedUrl) throw error ?? new Error('Storage did not return a signed URL')
    return data.signedUrl
  }
}

export const createSupabaseAttachmentStorage = (supabaseUrl: string, serviceRoleKey: string) => new SupabaseAttachmentStorage(
  createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } })
)
import { createClient } from '@supabase/supabase-js'
