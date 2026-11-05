export const env = {
  port: Number(process.env.PORT || 4000),
  demoMode: process.env.DEMO_MODE !== 'false',
  uccInferenceUrl: process.env.UCC_INFERENCE_URL || null
};
