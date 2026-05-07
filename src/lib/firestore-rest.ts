/**
 * Fetches Firestore documents via the REST API (no Firebase Admin SDK required).
 * Used by Server Components / generateMetadata so Google can index page content.
 */

const PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'zb-propiedades-33291448-88816';
const API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCcsf98_rKc566-sbYo-XUCX2Ewy1YLUgw';

type FirestoreFieldValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { nullValue: null }
  | { arrayValue: { values?: FirestoreFieldValue[] } }
  | { mapValue: { fields: Record<string, FirestoreFieldValue> } };

function parseValue(value: FirestoreFieldValue): unknown {
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('nullValue' in value) return null;
  if ('arrayValue' in value)
    return (value.arrayValue.values ?? []).map(parseValue);
  if ('mapValue' in value) return parseFields(value.mapValue.fields);
  return null;
}

function parseFields(
  fields: Record<string, FirestoreFieldValue>
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, parseValue(v)])
  );
}

export async function getDocument<T>(
  collection: string,
  id: string
): Promise<(T & { id: string }) | null> {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}/${id}?key=${API_KEY}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.fields) return null;
    return { id, ...parseFields(data.fields) } as T & { id: string };
  } catch {
    return null;
  }
}

export async function getCollection<T>(
  collection: string,
  pageSize = 60
): Promise<Array<T & { id: string }>> {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collection}?pageSize=${pageSize}&key=${API_KEY}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    const documents = data.documents ?? [];

    return documents
      .map((doc: { name?: string; fields?: Record<string, FirestoreFieldValue> }) => {
        if (!doc.fields || !doc.name) return null;
        const id = doc.name.split('/').pop() || '';
        return { id, ...parseFields(doc.fields) } as T & { id: string };
      })
      .filter(Boolean) as Array<T & { id: string }>;
  } catch {
    return [];
  }
}
