import { Request, Response, NextFunction } from 'express';
import { verifyTokenString, TokenPayload } from '../utils/jwt';
import { User, UserRole } from '../models/User';

// Extend Express Request interface to carry decoded authenticated user payload
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * 1. Authentication Middleware
 * Checks for a valid Bearer JWT token in the Authorization header.
 * Verifies the token and confirms that the user still exists and is active.
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check Authorization header for "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
      });
      return;
    }

    // Verify and decode JWT token
    const decoded = verifyTokenString(token);

    // Confirm user still exists in database and has not been deactivated
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'User account no longer exists or has been deactivated.',
      });
      return;
    }

    // Attach user payload to the request object
    req.user = decoded;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please login again.',
    });
  }
};

/**
 * 2. Role-Based Access Control (RBAC) Authorization Middleware
 * Ensures the authenticated user possesses one of the allowed roles.
 * Example usage: authorizeRoles('admin') or authorizeRoles('company', 'admin')
 */
export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required prior to authorization.',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized to access this resource. Allowed roles: [${roles.join(', ')}]`,
      });
      return;
    }

    next();
  };
};
