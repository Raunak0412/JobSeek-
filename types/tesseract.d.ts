declare module "tesseract.js" {
  type RecognizeResult = {
    data?: {
      text?: string
      confidence?: number
    }
  }

  type Worker = {
    load: () => Promise<void>
    loadLanguage: (lang: string) => Promise<void>
    initialize: (lang: string) => Promise<void>
    recognize: (input: Blob | File | string) => Promise<RecognizeResult>
    terminate: () => Promise<void>
  }

  export function createWorker(): Promise<Worker>
}
