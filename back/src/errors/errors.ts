// errors.ts
export class EntityNotFoundError extends Error {
    constructor(entity: string, id: string) {
      super(`${entity} with id ${id} not found`);
      this.name = 'EntityNotFoundError';
    }
  }
  
  export class UniqueConstraintViolationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'UniqueConstraintViolationError';
    }
  }
  