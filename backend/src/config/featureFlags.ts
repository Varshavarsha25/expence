// Central feature flag definitions.
// For now these are static; later you could back them with DB or remote config.
// Each flag can optionally have metadata (description, rollout info, etc.).

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description?: string;
  metadata?: Record<string, unknown>;
}

// Example: enabling GPT-5 (Preview) for all clients.
// In a real system you might gradually roll out (percentage, user targeting).
export const featureFlags: FeatureFlag[] = [
  {
    key: 'gpt5_preview',
    enabled: true,
    description: 'Enable GPT-5 (Preview) for all clients',
    metadata: {
      version: 'preview',
      rollout: '100%',
      owner: 'platform-ai'
    }
  }
];

export function listFlags(): FeatureFlag[] {
  return featureFlags;
}

export function getFlag(key: string): FeatureFlag | undefined {
  return featureFlags.find(f => f.key === key);
}
