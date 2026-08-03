import { useCallback } from 'react'
import { api } from '../services/api'
import { AxiosError, AxiosResponse } from 'axios'

interface UseApiOptions {
  onError?: (error: AxiosError) => void
}

export function useApi() {
  const get = useCallback(async <T,>(url: string, options?: UseApiOptions): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await api.get(url)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && options?.onError) {
        options.onError(error)
      }
      throw error
    }
  }, [])

  const post = useCallback(async <T, D = unknown>(
    url: string,
    data?: D,
    options?: UseApiOptions
  ): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await api.post(url, data)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && options?.onError) {
        options.onError(error)
      }
      throw error
    }
  }, [])

  const put = useCallback(async <T, D = unknown>(
    url: string,
    data?: D,
    options?: UseApiOptions
  ): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await api.put(url, data)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && options?.onError) {
        options.onError(error)
      }
      throw error
    }
  }, [])

  const remove = useCallback(async <T,>(url: string, options?: UseApiOptions): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await api.delete(url)
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && options?.onError) {
        options.onError(error)
      }
      throw error
    }
  }, [])

  return { get, post, put, delete: remove }
}
