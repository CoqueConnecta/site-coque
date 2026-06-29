function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function mergeWithFallback<T>(fallback: T, incoming: unknown): T {
  if (Array.isArray(fallback)) {
    return (Array.isArray(incoming) ? incoming : fallback) as T;
  }

  if (isRecord(fallback)) {
    if (!isRecord(incoming)) {
      return fallback;
    }

    const result: Record<string, unknown> = { ...fallback };
    for (const key of Object.keys(fallback)) {
      result[key] = mergeWithFallback(
        (fallback as Record<string, unknown>)[key],
        incoming[key]
      );
    }
    return result as T;
  }

  return (incoming === undefined || incoming === null ? fallback : incoming) as T;
}

function getValueAtPath(source: unknown, path: Array<string | number>): unknown {
  return path.reduce<unknown>((accumulator, key) => {
    if (Array.isArray(accumulator) && typeof key === 'number') {
      return accumulator[key];
    }

    if (isRecord(accumulator) && typeof key === 'string') {
      return accumulator[key];
    }

    return undefined;
  }, source);
}

function setValueAtPath(
  source: unknown,
  path: Array<string | number>,
  value: unknown
): unknown {
  if (path.length === 0) {
    return value;
  }

  const [head, ...rest] = path;

  // Quando o segmento intermediário ainda não existe no source (campo novo,
  // nunca salvo no Firebase), cria o container certo em vez de abortar —
  // senão a escrita é descartada silenciosamente e o input volta a ficar vazio.
  if (typeof head === 'number') {
    const next = Array.isArray(source) ? [...source] : [];
    next[head] = setValueAtPath(next[head], rest, value);
    return next;
  }

  const base = isRecord(source) ? source : {};
  return {
    ...base,
    [head]: setValueAtPath(base[head], rest, value),
  };
}

function buildEmptyFromTemplate(template: unknown): unknown {
  if (Array.isArray(template)) {
    return [];
  }

  if (isRecord(template)) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(template)) {
      result[key] = buildEmptyFromTemplate(value);
    }
    return result;
  }

  if (typeof template === 'number') {
    return 0;
  }

  if (typeof template === 'boolean') {
    return false;
  }

  return '';
}

export {
  isRecord,
  mergeWithFallback,
  getValueAtPath,
  setValueAtPath,
  buildEmptyFromTemplate,
};
