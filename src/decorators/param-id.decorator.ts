import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const ParamId = createParamDecorator((data: unknown, context: ExecutionContext) => {
  console.log(`log no decora ${context.switchToHttp().getRequest().params.id}`);
  
  return Number(context.switchToHttp().getRequest().params.id)
})