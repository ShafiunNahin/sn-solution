# SN Solution - Deployment Guide

## GitHub থেকে নতুন আপডেট pull করা

লোকাল মেশিনে নতুন পরিবর্তন আপডেট করতে:

```powershell
cd D:\sn-solution
git pull origin main
```

## নতুন ফিচার যোগ করার পর push করা

```powershell
# সব ফাইল add করুন
git add .

# Commit করুন (descriptive message সহ)
git commit -m "Feature: Add [feature name]"

# Push করুন
git push origin main
```

## লাইভ সার্ভারে ডিপ্লয় করা

### Step 1: সার্ভারে Git সেটআপ
```bash
cd /var/www/your-domain.com
git clone https://github.com/ShafiunNahin/sn-solution.git .
```

### Step 2: আপডেট পেতে (রুটিন)
```bash
cd /var/www/your-domain.com
git pull origin main
```

### Step 3: Laravel সেটআপ
```bash
cd laravel-backend
cp .env.example .env
# Edit .env with production values
composer install --no-dev
php artisan key:generate
php artisan migrate --force
php artisan cache:clear
```

### Step 4: React বিল্ড
```bash
cd ../frontend_backup
npm install
npm run build
cp -r dist/* /var/www/your-domain.com/public/
```

### Step 5: সার্ভার পারমিশন
```bash
chown -R www-data:www-data /var/www/your-domain.com
chmod -R 755 /var/www/your-domain.com
chmod -R 775 /var/www/your-domain.com/laravel-backend/storage
chmod -R 775 /var/www/your-domain.com/laravel-backend/bootstrap/cache
```

## স্বয়ংক্রিয় ডিপ্লয়মেন্ট স্ক্রিপ্ট

সার্ভারে `deploy.sh` তৈরি করুন:

```bash
#!/bin/bash
set -e

PROJECT_DIR="/var/www/your-domain.com"
cd $PROJECT_DIR

echo "🔄 Pulling latest changes..."
git pull origin main

echo "📦 Installing Laravel dependencies..."
cd laravel-backend
composer install --no-dev
php artisan migrate --force
php artisan cache:clear
php artisan config:clear
cd ..

echo "⚛️  Building React..."
cd frontend_backup
npm install
npm run build
cp -r dist/* ../public/
cd ..

echo "✅ Deployment complete!"
date >> $PROJECT_DIR/deploy.log
```

চালানোর জন্য:
```bash
chmod +x deploy.sh
./deploy.sh
```

## GitHub থেকে সরাসরি ডিপ্লয় (Webhook)

নিয়মিত updates এর জন্য GitHub Webhook সেটআপ করুন:

1. GitHub → Settings → Webhooks → Add webhook
2. Payload URL: `https://your-domain.com/deploy.php`
3. Content type: application/json
4. Events: Push events

`deploy.php` তৈরি করুন:
```php
<?php
if ($_SERVER['HTTP_X_HUB_SIGNATURE_256'] !== 'sha256=' . hash_hmac('sha256', file_get_contents('php://input'), 'your_webhook_secret')) {
    exit('Unauthorized');
}

shell_exec('cd /var/www/your-domain.com && ./deploy.sh >> /var/log/deploy.log 2>&1 &');
echo 'Deployment started';
?>
```

## সাধারণ Git কমান্ড

```powershell
# লোকাল ফাইল পরিবর্তন মাত্র add করা (সব নয়)
git add src/file.jsx
git commit -m "Update: file.jsx"

# শেষ commit বার্তা পরিবর্তন করা
git commit --amend -m "New message"

# সর্বশেষ commit undo করা
git reset --soft HEAD~1

# সব কমিট দেখা
git log --oneline

# Branch তৈরি করা
git checkout -b feature/new-feature

# Development branch এ switch করা
git checkout development

# Current branch দেখা
git branch
```

## সাহায্য দরকার?

- GitHub: https://github.com/ShafiunNahin/sn-solution
- Issues/Questions: GitHub Discussions ব্যবহার করুন
