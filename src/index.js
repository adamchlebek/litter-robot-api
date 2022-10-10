const http = require("axios");
const ResourceOwnerPassword = require("simple-oauth2").ResourceOwnerPassword;
const PasswordTokenConfig = require("simple-oauth2").PasswordTokenConfig;

module.exports = class LitterRobotClient {
  LR_PARAMS = {
    endpoint: "https://v2.api.whisker.iothings.site",
    token_endpoint: "https://autopets.sso.iothings.site/oauth/token",
    client_id: "IYXzWN908psOm7sNpe4G.ios.whisker.robots",
    client_secret: "C63CLXOmwNaqLTB2xXo6QIWGwwBamcPuaul",
    x_api_key: "p7ndMoj61npRZP5CVz9v4Uj0bG769xy6758QRBPb",
    user_agent:
      "Litter-Robot/1.3.4 (com.autopets.whisker.ios; build:59; iOS 14.5.0) Alamofire/4.9.0",
  };

  accessToken = null;

  constructor({ username, password }) {
    this.username = username;
    this.password = password;
  }

  async fetchToken() {
    const client = new ResourceOwnerPassword({
      client: {
        id: LR_PARAMS.client_id,
        secret: LR_PARAMS.client_secret,
      },
      auth: {
        tokenHost: LR_PARAMS.token_endpoint,
      },
      options: {
        authorizationMethod: "body",
      },
      http: {
        user_agent: LR_PARAMS.user_agent,
      },
    });

    const credentials = {
      username: this.username,
      password: this.password,
    };

    try {
      const accessToken = await client.getToken(credentials);

      return accessToken;
    } catch (error) {
      console.log("Access Token Error", error.message);
    }
  }

  async checkAccessToken() {
    if (!this.accessToken) {
      this.accessToken = await this.fetchToken();
      return true;
    } else if (this.accessToken.expired(120)) {
      this.accessToken = await this.accessToken.refresh();
      return true;
    }
    return false;
  }

  async makeRequest(method, url, data = null, config = {}) {
    await this.checkAccessToken();

    const response = await http({
      method,
      url,
      headers: {
        "User-Agent": LR_PARAMS.user_agent,
        "x-api-key": LR_PARAMS.x_api_key,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response;
  }
};