import { NextFunction, Request, Response } from 'express';
import {
  BadRequestException,
  ForbidenException,
  NotFoundException,
} from '../../exceptions';
import { InstanceDto } from '../dto/instance.dto';
import { waMonitor } from '../whatsapp.module';

export function instanceExistsGuard(req: Request, res: Response, next: NextFunction) {
  if (req.originalUrl.includes('/instance/create')) {
    return next();
  }

  const param = req.params as unknown as InstanceDto;
  if (!param?.instanceName) {
    throw new BadRequestException('"instanceName" not provided.');
  }

  const instance = waMonitor.waInstances[param.instanceName];

  if (!instance) {
    throw new NotFoundException(`The "${param.instanceName}" instance does not exist`);
  }

  next();
}

export function instanceLoggedGuard(req: Request, res: Response, next: NextFunction) {
  if (req.originalUrl.includes('/instance/create')) {
    const instance = req.body as InstanceDto;
    const waInstance = waMonitor.waInstances[instance.instanceName];
    if (waInstance) {
      throw new ForbidenException(
        `This name "${instance.instanceName}" is already in use.`,
      );
    }
  }

  next();
}