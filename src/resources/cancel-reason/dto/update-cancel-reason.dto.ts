import { PartialType } from '@nestjs/mapped-types';
import { CreateCancelReasonDto } from './create-cancel-reason.dto';

export class UpdateCancelReasonDto extends PartialType(CreateCancelReasonDto) {}
