# 🌾 AgriDhaan API

A comprehensive **Agricultural Marketplace REST API** built with **Node.js**, **Express.js**, and **MongoDB**. AgriDhaan connects farmers, collectors, wholesalers, retailers, and service providers in a unified digital platform for agricultural commerce.

---

## 🎯 What is AgriDhaan?

AgriDhaan is a B2B agricultural marketplace platform that digitizes the agricultural supply chain by connecting:

| Role | Description |
|------|-------------|
| 🏘️ **VLC (Village Level Collector)** | Collects agricultural produce directly from farmers at the village level |
| 🧑‍🌾 **Seller** | Farmers and producers who list and sell their agricultural products |
| 📦 **Wholeseller** | Bulk buyers who purchase large quantities for distribution |
| 🏪 **Retailer** | Shop owners selling agricultural products to end consumers |
| 👷 **Labour Provider** | Agencies providing agricultural labor services for farming activities |
| 🚜 **Implement Provider** | Providers renting/selling farm equipment and machinery |

---

## ✨ Features

### Authentication & Security
- 📱 **OTP-based Phone Authentication** - Secure login via SMS OTP verification
- 🔐 **JWT Token Authorization** - Stateless authentication with 3-day token validity
- 🛡️ **Role-based Access Control** - Granular permissions based on user roles

### User Management
- 👤 **Multi-Role System** - Users can register for multiple roles simultaneously
- 📝 **Profile Management** - Update name, profile picture, and personal details
- 📍 **Multiple Address Support** - Save and manage multiple delivery/pickup addresses

### KYC & Document Verification
- 🪪 **Aadhar Verification** - Upload Aadhar card (front & back) for identity verification
- 🏦 **Bank Details** - Link bank account with passbook verification
- 📜 **GST Registration** - For sellers, wholesalers, and retailers
- 🎓 **Certificate Upload** - Labour provider certification verification
- ⏳ **Approval Workflow** - Documents go through pending → approved/rejected status

### Admin Features
- 👑 **User Management** - View and manage all registered users
- ✅ **Document Approval** - Review and approve/reject KYC documents

### API Documentation
- 📚 **Swagger UI** - Interactive API documentation at `/api-docs`

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js (≥12.0.0) |
| **Framework** | Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens) |
| **SMS Gateway** | Custom SMS API Integration |
| **Documentation** | Swagger / OpenAPI |

---

## 📁 Project Structure

```
agridhaan/
├── index.js                 # Application entry point
├── package.json             # Dependencies and scripts
├── db/
│   └── mongoose.js          # MongoDB connection setup
├── middlewares/
│   └── verifyToken.js       # JWT authentication middleware
├── models/
│   ├── User.js              # User schema with embedded addresses
│   ├── Aadhar.js            # Aadhar document schema
│   ├── BankDetails.js       # Bank details schema
│   ├── Certificate.js       # Certificate schema
│   ├── Gst.js               # GST details schema
│   ├── VLC.js               # Village Level Collector schema
│   ├── Seller.js            # Seller schema
│   ├── Wholeseller.js       # Wholeseller schema
│   ├── Retailer.js          # Retailer schema
│   ├── LabourProvider.js    # Labour Provider schema
│   └── Implement.js         # Implement Provider schema
├── controllers/
│   ├── AuthController.js    # OTP send/verify logic
│   ├── UserController.js    # Profile & role management
│   ├── AddressController.js # Address CRUD operations
│   ├── AdminController.js   # Admin operations
│   └── DocumentController.js# Document upload logic
├── routers/
│   ├── auth.js              # Authentication routes
│   ├── user.js              # User routes
│   ├── address.js           # Address routes
│   ├── admin.js             # Admin routes
│   └── document.js          # Document routes
└── swagger/
    └── swagger.json         # API documentation config
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v12.0.0 or higher)
- MongoDB (local or Atlas)
- SMS API credentials

### Setup

```bash
# Clone the repository
git clone https://github.com/AryanMishra586/Ecommerce-API.git
cd Ecommerce-API

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URL=mongodb://localhost:27017/agridhaan
JWT_SECRET=your_super_secret_jwt_key
SMS_API_KEY=your_sms_provider_api_key
```

### Run the Application

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

The server will start at `http://localhost:5555`

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sendotp` | Send OTP to phone number |
| POST | `/api/auth/verifyotp` | Verify OTP and get JWT token |

### User Management
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/user/getUserProfile` | Get current user profile | ✅ |
| PUT | `/api/user/name/:id` | Update user name | ✅ Owner/Admin |
| POST | `/api/user/profilepic/:id` | Update profile picture | ✅ Owner/Admin |
| POST | `/api/user/userroles` | Add role to user | ✅ |
| DELETE | `/api/user/:id` | Delete user account | ✅ Owner/Admin |

### Address Management
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| PUT | `/api/address/addAddress` | Add new address | ✅ |
| PUT | `/api/address/updateAddress/:id` | Update address | ✅ |
| DELETE | `/api/address/deleteAddress/:id` | Delete address | ✅ |
| GET | `/api/address/getAddresses` | Get all addresses | ✅ |
| GET | `/api/address/getAddress/:id` | Get address by ID | ✅ |

### Document Upload (KYC)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/document/aadhar` | Upload Aadhar card | ✅ |
| POST | `/api/document/bankdetail` | Upload bank details | ✅ |
| POST | `/api/document/certificate` | Upload certificate | ✅ LabourProvider |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/getAllUsers` | Get all users | ✅ Admin |

---

## 🔐 Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│  1. User sends phone number                                   │
│     POST /api/auth/sendotp { "phone": "9876543210" }         │
│                              ↓                                │
│  2. Server generates OTP, sends SMS, returns temp token      │
│                              ↓                                │
│  3. User submits OTP with temp token                         │
│     POST /api/auth/verifyotp { "token": "...", "otp": "..." }│
│                              ↓                                │
│  4. Server validates → Creates/finds user → Returns JWT      │
│                              ↓                                │
│  5. User includes JWT in all subsequent requests             │
│     Headers: { "token": "Bearer <jwt_token>" }               │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema

```
User ─────────────────────────────────────────────────────────┐
  │                                                            │
  │ ← userId (ObjectId ref)                                   │
  │                                                            │
  ├──→ Aadhar (aadharNo, front, back, status)                 │
  ├──→ BankDetails (account, IFSC, passbook, status)          │
  ├──→ Certificate (certificateNo, image, status)             │
  ├──→ GST (companyName, CIN, GST, PAN, status)               │
  │                                                            │
  └──→ Role Documents (VLC, Seller, Wholeseller, Retailer,    │
       LabourProvider, Implement) - each references:           │
         • userId → User                                       │
         • aadhar → Aadhar                                     │
         • bank → BankDetails                                  │
         • gst → GST (for Seller/Wholeseller/Retailer)        │
         • certificate → Certificate (for LabourProvider)     │
```

---

## 📖 API Documentation

Interactive Swagger documentation is available at:
```
http://localhost:5555/api-docs
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the Apache-2.0 License.

---

## 👨‍💻 Author

**Aryan Mishra**
- GitHub: [@AryanMishra586](https://github.com/AryanMishra586)

---

## 🙏 Acknowledgments

- AgriDhaan Global Private Limited
- All contributors and supporters of this project
