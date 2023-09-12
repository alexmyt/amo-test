import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { HttpService, HttpModuleOptions } from '@nestjs/axios';
import * as deepmerge from 'deepmerge';

import { OAuthGrantType, OAuthRequestPayload, OAuthResponse } from './amocrm.interface';

// TODO: Remove all these constants to .env
const AMO_ULI = 'https://alexmyt1.amocrm.ru';
const REDIRECT_URI = 'https://ff76-83-239-184-102.ngrok-free.app/auth/redirect';
const CLIENT_SECRET = 'QlEYDvhWyDbrFizHvgAopZcEfJLaC91msDXrnA6JppTOe0zspoEViUWrbYObul1I';

@Injectable()
export class AmoCRMService {
  private access_token: string;
  private refresh_token: string;
  private expires_at: number;

  constructor(private readonly httpService: HttpService) {}

  /** Authorized request to AMOCRM API */
  public async request<T = unknown>(options: HttpModuleOptions): Promise<T> {
    const defaultOptions: HttpModuleOptions = {
      baseURL: AMO_ULI,
      headers: { Authorization: `Bearer ${this.access_token}` },
    };

    const resultOptions = deepmerge(defaultOptions, options);
    const result = await this.httpService.axiosRef.request<T>(resultOptions);

    const { status } = result;

    switch (status) {
      case 400:
        throw new BadRequestException(result);

      case 401:
        throw new UnauthorizedException(result);

      default:
        break;
    }

    return result.data;
  }

  /** Get access token by authorization code  */
  public async accessTokenByCode(client_id: string, code: string): Promise<OAuthResponse> {
    const grants: OAuthGrantType = {
      grant_type: 'authorization_code',
      code,
    };

    return await this.accessToken(client_id, grants);
  }

  /** Get access token by refresh token */
  public async accessTokenByRefreshToken(client_id: string): Promise<OAuthResponse> {
    const grants: OAuthGrantType = {
      grant_type: 'refresh_token',
      refresh_token: this.refresh_token,
    };

    return await this.accessToken(client_id, grants);
  }

  /** Get access token by grant type (authorization_code or refresh_token) */
  private async accessToken(client_id: string, grants: OAuthGrantType): Promise<OAuthResponse> {
    const payload: OAuthRequestPayload = {
      client_id,
      redirect_uri: REDIRECT_URI,
      client_secret: CLIENT_SECRET,
      ...grants,
    };

    const result = await this.httpService.axiosRef.post<OAuthResponse>(
      `/oauth2/access_token`,
      payload,
      { baseURL: AMO_ULI },
    );

    this.access_token = result.data.access_token;
    this.refresh_token = result.data.refresh_token;
    this.expires_at = Date.now() + result.data.expires_in;

    console.log(result.data);
    return result.data;
  }
}
