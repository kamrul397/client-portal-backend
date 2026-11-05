import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '../models/User';
import { ClientProfile } from '../models/ClientProfile';
import { generateToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../middlewares/auth';

/**
 * Register a new Client
 * Endpoint: POST /api/auth/register-client
 * Creates an entry in `users` collection with role='client'
 * and an entry in `clientProfiles` if businessName is provided.
 */
export const registerClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, businessName, entityType, panGstin, address } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.',
      });
      return;
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
      return;
    }

    // 3. Hash the password securely with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user record in MongoDB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: 'client',
      authProvider: 'local',
      isActive: true,
    });

    // 5. Create client profile if business information is provided
    let profile = null;
    if (businessName) {
      profile = await ClientProfile.create({
        userId: user._id,
        businessName,
        entityType,
        panGstin,
        address,
        kycStatus: 'pending',
      });
    }

    // 6. Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // 7. Send success response
    res.status(201).json({
      success: true,
      message: 'Client registered successfully.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
        profile,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while registering client.',
    });
  }
};

/**
 * Register a Company Staff or Admin
 * Endpoint: POST /api/auth/register-staff
 * Creates a user with role 'company' (internal staff) or 'admin'
 */
export const registerStaffOrAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, role } = req.body;

    // 1. Basic validation
    if (!name || !email || !password || !role) {
      res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required fields.',
      });
      return;
    }

    // 2. Validate role matches allowed staff / admin roles
    if (!['company', 'admin'].includes(role)) {
      res.status(400).json({
        success: false,
        message: "Invalid role specified. Role must be either 'company' or 'admin'.",
      });
      return;
    }

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
      return;
    }

    // 4. Hash password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create user record with company or admin role
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role as UserRole,
      authProvider: 'local',
      isActive: true,
    });

    // 6. Generate JWT token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // 7. Send success response
    res.status(201).json({
      success: true,
      message: `${role.toUpperCase()} registered successfully.`,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while registering staff/admin.',
    });
  }
};

/**
 * Universal Login (Client, Company Staff, Admin)
 * Endpoint: POST /api/auth/login
 * Verifies email + password, checks account active status,
 * returns JWT token, user details, and profile (if client).
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required fields.',
      });
      return;
    }

    // 2. Find user in MongoDB and explicitly select the hidden password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    // 3. Check if account is active
    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Your account is deactivated. Please contact support.',
      });
      return;
    }

    // 4. Check if password exists (in case user registered via social auth in future)
    if (!user.password) {
      res.status(400).json({
        success: false,
        message: 'This account was registered using a third-party provider.',
      });
      return;
    }

    // 5. Compare submitted password with hashed password in database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    // 6. Generate signed JWT token
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // 7. If user is a client, fetch their business profile as well
    let profile = null;
    if (user.role === 'client') {
      profile = await ClientProfile.findOne({ userId: user._id });
    }

    // 8. Return success response
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
        profile,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during login.',
    });
  }
};

/**
 * Get Current User Profile
 * Endpoint: GET /api/auth/me
 * Protected Route (requires valid Bearer token)
 */
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    let profile = null;
    if (user.role === 'client') {
      profile = await ClientProfile.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          authProvider: user.authProvider,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        profile,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error fetching profile.',
    });
  }
};
