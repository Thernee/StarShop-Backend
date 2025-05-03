import { Request } from 'express';

export const mockRequest = (data: Partial<Request> = {}): Request => {
  return {
    user: { id: data.user?.id },
    ...data,
  } as Request;
};
