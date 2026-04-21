import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  try {
    posthog.init('phc_clnttmYXCcmPMEgsFAMq4Y9C0KJqnBE1ALZT8XqbKZi', {
      api_host: 'https://eu.i.posthog.com',
      person_profiles: 'identified_only',
      autocapture: true,
      capture_pageview: false
    });
  } catch (error) {
    console.error('PostHog initialization error:', error);
  }
}

export default posthog;
