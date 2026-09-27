import { CertProvider, MediaData } from '../models';

/** Public, read-only Apps Script endpoint that lists publicly shared Drive files. No secrets here. */
export const MEDIA_API =
  'https://script.google.com/macros/s/AKfycbwS24ni0MjdKx66VqrFbVYKp3OlFIsU24s9AINO5yqfhmaf5_PwvyCvQvDmSmjbkQtc/exec';

export const PROVIDERS: Record<CertProvider, { label: string; full: string }> = {
  dicoding: { label: 'Dicoding', full: 'Dicoding Indonesia' },
  dqlab: { label: 'DQLab', full: 'DQLab Academy' },
  taalenta: { label: 'Taalenta', full: 'Taalenta Digital' },
  bnsp: { label: 'BNSP', full: 'Badan Nasional Sertifikasi Profesi' },
};

/** Used until the API responds (or if it is unreachable). */
export const MEDIA_FALLBACK: MediaData = {
  photos: [
    { id: '1akEyhdGvOzpaTsm3BqWj95Zq21UgPvJH', name: 'Foto 1', mime: 'image/png' },
    { id: '1te39EIufQS2iizoutCFzvO65yPSu9avu', name: 'Foto 2', mime: 'image/png' },
    { id: '1Gvca_AFg5MG30R8_TbUicQHys7_hhIDS', name: 'Foto 3', mime: 'image/png' },
    { id: '1-8pObwYRdmjP1xKMcvmvKjuL0illRClu', name: 'Foto 4', mime: 'image/png' },
  ],
  favicon: { id: '1Th9dRIrkdmbLxwCYXg5pM_7IZMjVhvV9', name: 'Favicon', mime: 'image/png' },
  certificates: [
    { key: 'dicoding', label: 'Dicoding', files: [{ id: '1WVeByXMFFSYibqcb7q1NbsiDFHj3_boI', name: 'Dicoding', mime: 'application/pdf' }] },
    { key: 'dqlab', label: 'DQLab', files: [{ id: '1gg0nBcWn9Il84QSVZkC9deE2oXL2rU-n', name: 'DQLab', mime: 'application/pdf' }] },
    { key: 'taalenta', label: 'Taalenta', files: [{ id: '1ZBQwIA4BpSX44TuhKWy9JUSRrLYIze01', name: 'Taalenta', mime: 'application/pdf' }] },
    { key: 'bnsp', label: 'BNSP', files: [{ id: '1YcQgXWLhD9wKnuFHcbxuWKKNc5UtP9nJ', name: 'BNSP - Sertifikasi Amil', mime: 'application/pdf' }] },
  ],
};
