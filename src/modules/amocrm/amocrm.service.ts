import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService, HttpModuleOptions } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as deepmerge from 'deepmerge';

import { OAuthGrantType, OAuthRequestPayload, OAuthResponse } from './amocrm.interface';

@Injectable()
export class AmoCRMService {
  private access_token: string;
  private refresh_token: string;
  private expires_at: number;

  private redirectUri: string;
  private apiUri: string;
  private integrationId: string;
  private integrationSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.redirectUri = `${this.configService.get<string>('APP_URI')}/auth/redirect`;
    this.apiUri = this.configService.get<string>('AMO_URI');
    this.integrationId = this.configService.get<string>('INTEGRATION_ID');
    this.integrationSecret = this.configService.get<string>('INTEGRATION_SECRET');
  }

  /** Authorized request to AMOCRM API */
  public async request<T = unknown>(options: HttpModuleOptions): Promise<T> {
    if (Date.now() >= this.expires_at) {
      await this.accessTokenByRefreshToken();
    }

    const defaultOptions: HttpModuleOptions = {
      baseURL: this.apiUri,
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
  public async accessTokenByCode(code: string): Promise<OAuthResponse> {
    const grants: OAuthGrantType = {
      grant_type: 'authorization_code',
      code,
    };

    return await this.accessToken(grants);
  }

  /** Get access token by refresh token */
  public async accessTokenByRefreshToken(): Promise<OAuthResponse> {
    const grants: OAuthGrantType = {
      grant_type: 'refresh_token',
      refresh_token: this.refresh_token,
    };

    return await this.accessToken(grants);
  }

  /** Get access token by grant type (authorization_code or refresh_token) */
  private async accessToken(grants: OAuthGrantType): Promise<OAuthResponse> {
    const payload: OAuthRequestPayload = {
      client_id: this.integrationId,
      redirect_uri: this.redirectUri,
      client_secret: this.integrationSecret,
      ...grants,
    };

    const result = await this.httpService.axiosRef
      .post<OAuthResponse>(`/oauth2/access_token`, payload, { baseURL: this.apiUri })
      .catch(error => {
        const { message } = error;
        throw new InternalServerErrorException(message);
      });

    this.access_token = result.data.access_token;
    this.refresh_token = result.data.refresh_token;
    this.expires_at = Date.now() + result.data.expires_in;

    console.log(result.data);
    return result.data;
  }
}
