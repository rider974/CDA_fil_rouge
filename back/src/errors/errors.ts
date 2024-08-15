/**
 * Custom error class to handle cases where an entity is not found in the database.
 * This error is typically used when querying for an entity by its ID, but the entity does not exist.
 */
export class EntityNotFoundError extends Error {
  /**
   * Creates an instance of EntityNotFoundError.
   * @param entity - The name of the entity that was not found.
   * @param id - The ID of the entity that was not found.
   */
  constructor(entity: string, id: string) {
    super(`${entity} with id ${id} not found`);
    this.name = 'EntityNotFoundError';
  }
}

/**
 * Custom error class to handle cases where a unique constraint is violated.
 * This error is used when attempting to create or update a record that violates a unique constraint, 
 * such as a duplicate email or username.
 */
export class UniqueConstraintViolationError extends Error {
  /**
   * Creates an instance of UniqueConstraintViolationError.
   * @param message - The error message describing the unique constraint violation.
   */
  constructor(message: string) {
    super(message);
    this.name = 'UniqueConstraintViolationError';
  }
}
