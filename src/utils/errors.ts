export class UnauthorizedError extends Error {
    constructor(message: string = 'Unauthorized access') {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

export class ValidationError extends Error {
    constructor(message: string = 'Validation failed') {
        super(message);
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends Error {
    constructor(message: string = 'Resource not found') {
        super(message);
        this.name = 'NotFoundError';
    }
}

export class BadRequestError extends Error {
    constructor(message: string = 'Bad request') {
        super(message);
        this.name = 'BadRequestError';
    }
}

// Custom error for handling reference errors in a more structured way
export class ReferenceValidationError extends Error {
    constructor(message: string = 'Invalid reference') {
        super(message);
        this.name = 'ReferenceValidationError';
    }
}