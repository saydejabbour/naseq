-- Create Database
CREATE DATABASE IF NOT EXISTS naseq;
USE naseq;

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- CATEGORIES
-- =========================
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- =========================
-- CLOTHING ITEMS
-- =========================
CREATE TABLE clothing_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    category_id INT,
    image_url VARCHAR(255),
    color VARCHAR(50),
    style VARCHAR(50),
    season VARCHAR(50),
    occasion VARCHAR(50),

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

-- =========================
-- OUTFITS
-- =========================
CREATE TABLE outfits (
    outfit_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100),

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =========================
-- OUTFIT ITEMS (Many-to-Many)
-- =========================
CREATE TABLE member_outfit_items (
    outfit_item_id INT AUTO_INCREMENT PRIMARY KEY,
    outfit_id INT,
    item_id INT,

    FOREIGN KEY (outfit_id) REFERENCES outfits(outfit_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES clothing_items(item_id) ON DELETE CASCADE
);

-- =========================
-- STYLIST PROFILES
-- =========================
CREATE TABLE stylist_profiles (
    stylist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    bio TEXT,
    profile_photo VARCHAR(255),
    status VARCHAR(50),

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =========================
-- STYLIST APPLICATIONS
-- =========================
CREATE TABLE stylist_applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    bio TEXT,
    profile_photo VARCHAR(255),
    status VARCHAR(50),
    submitted_at DATETIME,
    reviewed_at DATETIME,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =========================
-- PORTFOLIO IMAGES
-- =========================
CREATE TABLE portfolio_images (
    portfolio_id INT AUTO_INCREMENT PRIMARY KEY,
    stylist_id INT,
    image_url VARCHAR(255),

    FOREIGN KEY (stylist_id) REFERENCES stylist_profiles(stylist_id) ON DELETE CASCADE
);

-- =========================
-- STYLIST TEMPLATES
-- =========================
CREATE TABLE stylist_templates (
    template_id INT AUTO_INCREMENT PRIMARY KEY,
    stylist_id INT,
    title VARCHAR(100),
    description TEXT,
    style VARCHAR(50),
    season VARCHAR(50),
    occasion VARCHAR(50),

    FOREIGN KEY (stylist_id) REFERENCES stylist_profiles(stylist_id) ON DELETE CASCADE
);

-- =========================
-- TEMPLATE ITEMS
-- =========================
CREATE TABLE stylist_template_items (
    template_item_id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT,
    item_id INT,

    FOREIGN KEY (template_id) REFERENCES stylist_templates(template_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES clothing_items(item_id) ON DELETE CASCADE
);

-- =========================
-- SAVED TEMPLATES
-- =========================
CREATE TABLE saved_templates (
    saved_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    template_id INT,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES stylist_templates(template_id) ON DELETE CASCADE
);

-- =========================
-- CONTACT MESSAGES
-- =========================
CREATE TABLE contact_messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100),
    email VARCHAR(100),
    message TEXT,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);