export class ServiceError extends Error {
  public readonly name: string;
  public readonly isOperational: boolean;
  constructor(name: string, description: string, isOperational = true) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.name = name;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

/**
 * @throws {ServiceError}
 * */
export function emptyCollection(name: string, collection: any) {
  if (collection.length === 0) {
    throw new ServiceError(name, "Empty collection", false);
  }
}

/**
 * @throws {ServiceError}
 * */
export function notFound(name: string, message: string) {
  throw new ServiceError(name, message);
}
