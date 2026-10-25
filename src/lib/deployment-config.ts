type Environment = Record<string, string | undefined>;

const devWebsite = 'https://website-dev.belgianstreamerscommunity.be';
const devCC = 'https://cc-dev.belgianstreamerscommunity.be';

function configuredOrigin(kind: 'website' | 'cc', env: Environment): string {
  const mode = env.BESC_DEPLOYMENT_ENV ?? 'dev';
  if (mode !== 'dev' && mode !== 'production') throw Error('invalid_deployment_environment');
  const raw = kind === 'website' ? env.BESC_WEBSITE_URL : env.BESC_CC_URL;
  const dev = kind === 'website' ? devWebsite : devCC;
  const url = new URL(raw ?? (mode === 'dev' ? dev : ''));
  if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw Error('invalid_configured_origin');
  }
  const local = url.hostname === 'localhost' && env.NODE_ENV !== 'production';
  if (mode === 'dev') {
    if (url.origin !== dev && !(local && ['http:', 'https:'].includes(url.protocol))) {
      throw Error('invalid_dev_origin');
    }
  } else {
    // A separate operator-configured allowlist prevents a DEV or unapproved target
    // from receiving the publication key or authentication redirects.
    const approved = kind === 'website'
      ? env.BESC_APPROVED_PRODUCTION_WEBSITE_ORIGIN
      : env.BESC_APPROVED_PRODUCTION_CC_ORIGIN;
    if (url.protocol !== 'https:' || url.port || !approved || url.origin !== approved ||
        [devWebsite, devCC].includes(url.origin) ||
        url.hostname === 'localhost' || url.hostname.endsWith('.localhost')) {
      throw Error('unapproved_production_origin');
    }
  }
  return url.origin;
}

export function websiteOrigin(env: Environment = process.env): string {
  return configuredOrigin('website', env);
}

export function commandCenterOrigin(env: Environment = process.env): string {
  return configuredOrigin('cc', env);
}

export function releasePreviewEnabled(env: Environment = process.env): boolean {
  return env.BESC_RELEASE_PREVIEW_ENABLED === 'true';
}
