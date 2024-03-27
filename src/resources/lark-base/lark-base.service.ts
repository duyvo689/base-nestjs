import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { SearchEqualRecordDto } from './dto/search-equal-record.dto';
import { RecordSearchBase } from './interface.ts';
import { GetTenantAccessTokenDto } from './dto/get-tenant-access-token.dto';

const listBotApp = {
  AURA_BOT_APP: {
    appId: 'cli_a361a3bc4939d00a',
    appSecret: 'u2Q2FTc0Ma7yrS1OvBUBPctL5VMyhqem',
  },
};

@Injectable()
export class LarkBaseService {
  constructor(private readonly prismaService: PrismaService) {}

  //Truyền appToken và tableId từ frondend xuống, không dùng hàm create trên nữa
  async createRecordBase(
    createRecordBitableDto: CreateRecordDto,
    tenantAccessToken?: string,
  ) {
    try {
      const infoBoxApp =
        listBotApp[createRecordBitableDto.nameBoxApp] ??
        listBotApp['AURA_BOT_APP'];

      let token = tenantAccessToken;

      if (!tenantAccessToken) {
        const tenantToken = await this.getTenantAccessToken(infoBoxApp);

        if (tenantToken.code !== 0) {
          throw new Error(tenantToken.msg);
        }
        token = tenantToken.tenant_access_token;
      }

      const urlBitable = `https://open.larksuite.com/open-apis/bitable/v1/apps/${createRecordBitableDto.appToken}/tables/${createRecordBitableDto.tableId}/records`;
      var config = {
        method: 'POST',
        url: urlBitable,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: { fields: createRecordBitableDto.fields },
      };

      const respont = await axios(config);
      console.log('respont', respont);
      return respont.data;
    } catch (error) {
      console.log('error', error);

      throw new Error(error);
    }
  }

  //Update 1 record cho t table trong base
  async updateRecordBase(
    updateRecordDto: UpdateRecordDto,
    tenantAccessToken?: string,
  ) {
    try {
      const infoBoxApp =
        listBotApp[updateRecordDto.nameBoxApp] ??
        listBotApp['AURA_BOT_APP'];

      let token = tenantAccessToken;

      if (!tenantAccessToken) {
        const tenantToken = await this.getTenantAccessToken(infoBoxApp);

        if (tenantToken.code !== 0) {
          throw new Error(tenantToken.msg);
        }
        token = tenantToken.tenant_access_token;
      }

      const recordSearch = await this.searchEqualRecordBase(
        {
          appToken: updateRecordDto.appToken,
          tableId: updateRecordDto.tableId,
          filters: updateRecordDto.filters,
        },
        token,
      );

      if (
        !recordSearch ||
        !recordSearch.data ||
        !recordSearch.data.items ||
        recordSearch.data.items.length == 0
      ) {
        throw new NotFoundException();
      }
      const newData = {
        ...recordSearch.data.items[0].fields,
        ...updateRecordDto.fieldsUpdate,
      };

      const urlBitable = `https://open.larksuite.com/open-apis/bitable/v1/apps/${updateRecordDto.appToken}/tables/${updateRecordDto.tableId}/records/${recordSearch.data.items[0].record_id}`;
      var config = {
        method: 'PUT',
        url: urlBitable,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: { fields: newData },
      };

      const respont = await axios(config);
      console.log('respont', respont);
      return respont.data;
    } catch (error) {
      console.log('error', error);

      throw new Error(error);
    }
  }

  //Tìm điều kiện bằng record trong 1 bảng, trả về 1 record trùng điều kiện đầu tiên
  async searchEqualRecordBase(
    searchEqualRecordDto: SearchEqualRecordDto,
    tenantAccessToken?: string,
  ) {
    try {
      const infoBoxApp =
        listBotApp[searchEqualRecordDto.nameBoxApp] ??
        listBotApp['AURA_BOT_APP'];

      let token = tenantAccessToken;

      if (!tenantAccessToken) {
        const tenantToken = await this.getTenantAccessToken(infoBoxApp);

        if (tenantToken.code !== 0) {
          throw new Error(tenantToken.msg);
        }
        token = tenantToken.tenant_access_token;
      }
      const data = {
        filter: {
          conjunction: 'and',
          conditions: [
            {
              field_name: searchEqualRecordDto.filters.fieldName,
              operator: 'is',
              value: [searchEqualRecordDto.filters.value],
            },
          ],
        },
        automatic_fields: false,
      };
      const urlBitable = `https://open.larksuite.com/open-apis/bitable/v1/apps/${searchEqualRecordDto.appToken}/tables/${searchEqualRecordDto.tableId}/records/search?page_size=1`;
      var config = {
        method: 'POST',
        url: urlBitable,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: data,
      };

      const respont = await axios(config);
      return respont.data as RecordSearchBase;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTenantAccessToken(getTenantAccessTokenDto: GetTenantAccessTokenDto) {
    try {
      const data = {
        app_id: getTenantAccessTokenDto.appId,
        app_secret: getTenantAccessTokenDto.appSecret,
      };
      var config = {
        method: 'POST',
        url: `https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };
      const respont = await axios(config);

      return respont.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}
