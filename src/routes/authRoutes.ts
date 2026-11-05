import { Router } from 'express';
import {
  registerClient,
  registerStaffOrAdmin,
  login,
  getMe,
} from '../controllers/authController';
import { authenticate, authorizeRoles } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Multi-Role Authentication for Clients, Staff, and Admins
 */

/**
 * @swagger
 * /api/auth/register-client:
 *   post:
 *     summary: Register a new Client with business profile
 *     description: Creates a user account with role 'client' and an associated business profile.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: client@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *               phone:
 *                 type: string
 *                 example: "+91 9876543210"
 *               businessName:
 *                 type: string
 *                 example: Apex Innovations Pvt Ltd
 *               entityType:
 *                 type: string
 *                 example: Private Limited
 *               panGstin:
 *                 type: string
 *                 example: 27AAAAA0000A1Z5
 *               address:
 *                 type: string
 *                 example: Sector 5, Salt Lake, Kolkata
 *     responses:
 *       201:
 *         description: Client registered successfully. Returns user, profile, and JWT token.
 *       400:
 *         description: Validation error (missing required fields).
 *       409:
 *         description: User already exists with this email.
 *       500:
 *         description: Internal server error.
 */
router.post('/register-client', registerClient);

/**
 * @swagger
 * /api/auth/register-staff:
 *   post:
 *     summary: Register a Company Staff member or Admin
 *     description: Creates an internal user account with role 'company' (staff) or 'admin'.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sarah Jenkins
 *               email:
 *                 type: string
 *                 example: staff@company.com
 *               password:
 *                 type: string
 *                 example: StaffSecret123
 *               phone:
 *                 type: string
 *                 example: "+91 9123456789"
 *               role:
 *                 type: string
 *                 enum: [company, admin]
 *                 example: company
 *     responses:
 *       201:
 *         description: Staff or Admin registered successfully.
 *       400:
 *         description: Validation error or invalid role specified.
 *       409:
 *         description: User already exists with this email.
 *       500:
 *         description: Internal server error.
 */
router.post('/register-staff', registerStaffOrAdmin);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Universal Login for all roles (client, company, admin)
 *     description: Verifies user credentials, returns user details, profile, and a JWT authentication token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: client@example.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful. Returns JWT token and user profile.
 *       400:
 *         description: Missing email or password.
 *       401:
 *         description: Invalid email or password.
 *       403:
 *         description: Account is deactivated.
 *       500:
 *         description: Internal server error.
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get Current User Profile
 *     description: Returns the authenticated user's details and client profile (if applicable).
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *       401:
 *         description: Access denied or token expired.
 *       404:
 *         description: User not found.
 */
router.get('/me', authenticate, getMe);

/**
 * @swagger
 * /api/auth/staff-dashboard:
 *   get:
 *     summary: Staff & Admin Only Protected Route (RBAC Demo)
 *     description: Restricted to users with 'company' or 'admin' roles. Clients cannot access this route.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted to staff dashboard.
 *       401:
 *         description: Not authenticated.
 *       403:
 *         description: Forbidden. User lacks required role.
 */
router.get('/staff-dashboard', authenticate, authorizeRoles('company', 'admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Staff Dashboard! You have operational access.',
  });
});

/**
 * @swagger
 * /api/auth/admin-panel:
 *   get:
 *     summary: Admin Only Protected Route (RBAC Demo)
 *     description: Strictly restricted to users with 'admin' role.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted to admin panel.
 *       401:
 *         description: Not authenticated.
 *       403:
 *         description: Forbidden. User is not an admin.
 */
router.get('/admin-panel', authenticate, authorizeRoles('admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Admin Control Panel! Full system privileges granted.',
  });
});

export default router;
