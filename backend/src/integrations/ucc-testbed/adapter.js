export class UccTestbedAdapter {
  constructor({ endpoint, token } = {}) { this.endpoint = endpoint; this.token = token; }
  async analyse() {
    if (!this.endpoint || !this.token) return { status: 'not_configured' };
    throw new Error('Remote inference is intentionally disabled until the event endpoint and credentials are supplied.');
  }
}
