import { Request, Response, NextFunction } from "express"

type AsyncHandler<T extends Request> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<void>

export default function asyncHandler<T extends Request>(
  execution: AsyncHandler<T>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    execution(req as T, res, next).catch(next)
  }
}
