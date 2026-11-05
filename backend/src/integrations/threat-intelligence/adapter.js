export class ThreatIntelligenceAdapter {
  async checkIndicators() {
    return { status: 'not_configured', matches: [] };
  }
}
