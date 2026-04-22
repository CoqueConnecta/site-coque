export type RtdbStrategy = 'standard-local' | 'standard-global' | 'split-array';

export interface RtdbMappingConfig {
  /** The base Firebase RTDB path for this section. Example: 'cms/v2/projects' */
  basePath: string;
  
  /** The saving strategy to apply */
  strategy: RtdbStrategy;
  
  /** Configuration exclusively used for 'split-array' strategy */
  splitConfig?: {
    globalFields: string[];
    localFields: string[];
    duplicatedFields?: string[];
  };
}

/**
 * Mapping of section keys to their database routing strategy.
 * If a section is not found here, the system falls back to 'cms/v2/landing'
 * and infers 'standard-global' or 'standard-local' based on `isGlobalSection`.
 */
export const RTDB_MAPPINGS: Record<string, RtdbMappingConfig> = {
  projects: {
    basePath: 'cms/v2/projects',
    strategy: 'split-array',
    splitConfig: {
      globalFields: ['image', 'location', 'actionHref'],
      localFields: ['title', 'bodyMd', 'actionLabel'],
      duplicatedFields: ['id'], // Fields stored in both global and language-specific paths
    },
  },
};

/**
 * Helper to get the routing configuration for a given section.
 * Falls back to landing defaults if not explicitly mapped.
 */
export function getRtdbConfig(section: string, isGlobal: boolean): RtdbMappingConfig {
  if (RTDB_MAPPINGS[section]) {
    return RTDB_MAPPINGS[section];
  }

  return {
    basePath: 'cms/v2/landing',
    strategy: isGlobal ? 'standard-global' : 'standard-local',
  };
}
