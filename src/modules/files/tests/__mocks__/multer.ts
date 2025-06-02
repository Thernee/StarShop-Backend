const multer = jest.fn().mockReturnValue({
  single: jest.fn().mockReturnValue((req: any, res: any, next: any) => next()),
  array: jest.fn().mockReturnValue((req: any, res: any, next: any) => next()),
});

export default multer;
