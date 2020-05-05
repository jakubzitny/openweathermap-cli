// @flow

type Got = (url: string) => Promise<{ body: string }>;

export default class ApiRequestor {
  got: Got;

  constructor(services: { got: Got }) {
    this.got = services.got;
  }

  async fetch(url: string) {
    const response = await this.got(url);

    return JSON.parse(response.body);
  }
}
