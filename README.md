# 🛒 E-Commerce Backend

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **Multer** (for file uploads)
- **Cloudinary** (for image hosting)
- **JWT Authentication**

## 🚀 Features

✅ Admin Authentication  
✅ Manage Products (Add, Edit, Delete)  
✅ Manage Orders (Update Status, Delete)  
✅ View User List & Manage Users  
✅ View Sales Reports  
✅ Image Upload Handling  
✅ API for Frontend Integration  

## 📂 Folder Structure

```
backend
├── controllers
├── models
├── routes
├── middlewares
├── utils
├── server.js
```

## 🎯 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-repo/ecommerce-mern.git
cd ecommerce-mern/backend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4️⃣ Run the Server
```bash
npm run dev
```

## 🔗 API Endpoints

### **User Routes**

| Method | Endpoint               | Description          |
|--------|------------------------|----------------------|
| POST   | /api/v1/user/register  | Register a new user |
| POST   | /api/v1/user/login     | Login user          |
| GET    | /api/v1/user/profile   | Get user profile    |
| PUT    | /api/v1/user/update    | Update user details |

### **Product Routes**

| Method | Endpoint                | Description                  |
|--------|-------------------------|------------------------------|
| GET    | /api/v1/product/all     | Get all products            |
| GET    | /api/v1/product/:id     | Get single product details  |
| POST   | /api/v1/product/new     | Create a new product (Admin) |
| PUT    | /api/v1/product/:id     | Update product (Admin)      |
| DELETE | /api/v1/product/:id     | Delete product (Admin)      |

### **Order Routes**

| Method | Endpoint                 | Description                  |
|--------|--------------------------|------------------------------|
| POST   | /api/v1/order/new        | Place a new order           |
| GET    | /api/v1/order/:id        | Get order details           |
| GET    | /api/v1/order/user/:userId | Get orders for a user      |
| PUT    | /api/v1/order/:id        | Update order status (Admin) |
| DELETE | /api/v1/order/:id        | Delete an order (Admin)     |

## 🖼️ Image Upload Configuration

Images are stored in **Cloudinary**. Alternatively, they can be stored locally under `/uploads/`.

## 🛒 Payment Integration

**Payment Gateway:** Stripe / Razorpay (Future Implementation)

## 📝 Future Enhancements

- Wishlist & Favorite Products
- Real-time Order Tracking
- Admin Dashboard with Analytics
- Email & SMS Notifications

## 🤝 Contributing

1. **Fork** the repository  
2. **Create a new branch** (`git checkout -b feature-branch`)  
3. **Commit changes** (`git commit -m 'Add new feature'`)  
4. **Push to branch** (`git push origin feature-branch`)  
5. **Create a Pull Request**  

## 📜 License

This project is open-source and available under the **MIT License**.
