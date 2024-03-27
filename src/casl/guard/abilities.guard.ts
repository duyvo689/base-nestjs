import * as Mustache from 'mustache';

import { Reflector } from '@nestjs/core';

import {
  ForbiddenError,
  ForcedSubject,
  MongoAbility,
  RawRuleOf,
  createMongoAbility,
  subject,
} from '@casl/ability';
import { Request } from 'express';
import { map, size } from 'lodash';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CHECK_ABILITY, RequiredRule } from '../decorator/abilities.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

export const actions = [
  'read',
  'manage',
  'create',
  'update',
  'delete',
] as const;

export const subjects = ['Story', 'User', 'all'] as const;

export type Abilities = [
  (typeof actions)[number],
  (
    | (typeof subjects)[number]
    | ForcedSubject<Exclude<(typeof subjects)[number], 'all'>>
  ),
];

export type AppAbility = MongoAbility<Abilities>;

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  createAbility = (rules: RawRuleOf<AppAbility>[]) =>
    createMongoAbility<AppAbility>(rules);

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const rules: any =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, ctx.getHandler()) || [];
    const currentUser: any = ctx.switchToHttp().getRequest().user; //Staff
    const request: Request = ctx.switchToHttp().getRequest();

    const userPermissions = await this.prisma.permissions.findMany({
      where: {
        roleId: currentUser.roleId,
      },
    });

    const parsedUserPermissions = this.parseCondition(
      userPermissions,
      currentUser,
    );

    try {
      const ability = this.createAbility(Object(parsedUserPermissions));

      for await (const rule of rules) {
        let sub = {};
        if (size(rule?.conditions)) {
          const subId = +request.params['id'];
          sub = await this.getSubjectById(subId, rule.subject);
        }

        ForbiddenError.from(ability)
          .setMessage('You are not allowed to perform this action')
          .throwUnlessCan(rule.action, subject(rule.subject, sub));
      }
      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }
  //Staff
  parseCondition(permissions: any, currentUser: any) {
    const data = map(permissions, (permission) => {
      if (size(permission.conditions)) {
        const parsedVal = Mustache.render(
          permission.conditions['created_by'],
          currentUser,
        );
        return {
          ...permission,
          conditions: { created_by: +parsedVal },
        };
      }
      return permission;
    });
    return data;
  }

  async getSubjectById(id: number, subName: string) {
    const subject = await this.prisma[subName].findUnique({
      where: {
        id,
      },
    });
    if (!subject) throw new NotFoundException(`${subName} not found`);
    return subject;
  }
}
