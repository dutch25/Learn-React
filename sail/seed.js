const { MongoClient } = require('mongodb');

async function seed() {
  const url = 'mongodb://localhost:27017';
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('product');

    const categoryImageMap = {
      'Mouse': [
        '/images/products/chuot-choi-game-co-day-logitech-g502-hero.webp',
        '/images/products/chuot-gaming-khong-day-logitech-pro-x2-superstrike-lightspeed_4_ed024c14667549e08d303595794dce75_large.jpg',
        '/images/products/razer-deathadder-v3-pro-wireless-true-8000hz-danh-gia-gaming-gear-10.jpg',
        '/images/products/razer-viper-v4-pro-danh-gia-gaming-gear-8.jpg'
      ],
      'Keyboard': [
        '/images/products/ban-phim-apple-magic-with-numeric-keypad-its-mq052za-a-trang-1.webp',
        '/images/products/ban-phim-do.webp',
        '/images/products/ban-phim-pauroty.jpg',
        '/images/products/ban-phim-technet.jpg'
      ],
      'Chair': [
        '/images/products/84219_ghe_game_e_dra_dignity_gaming_chair_egc234_051.jpg',
        '/images/products/chair-edra-rockstar-rgb.jpg',
        '/images/products/chair-ergo.jpg'
      ],
      'Headphone': [
        '/images/products/tai-nghe-bose-quiet.jpg',
        '/images/products/tai-nghe-den.jpg',
        '/images/products/tai-nghe-gaming-asus-tuf-h3-3_1_1.webp',
        '/images/products/tai-nghe-tim.jpg',
        '/images/products/tai-nghe-xanh.jpg'
      ],
      'Gamepad': [
        '/images/products/tay-cam-choi-game-ps5-dualsense.webp',
        '/images/products/tay-cam-machenike.jpg',
        '/images/products/tay-cam-xbox.webp'
      ]
    };

    const categories = Object.keys(categoryImageMap);

    // Delete previously seeded products (those with "Pro X" in the name)
    await collection.deleteMany({ name: { $regex: /Pro X/ } });

    const products = [];
    for (let i = 1; i <= 1000; i++) {
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const categoryImages = categoryImageMap[cat];
      const img = categoryImages[Math.floor(Math.random() * categoryImages.length)];
      const price = Math.floor(Math.random() * 5000) * 1000 + 100000;

      products.push({
        name: `${cat} Pro X${Math.floor(Math.random() * 9000) + 1000}`,
        price: price,
        category: cat,
        image: img,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }

    await collection.insertMany(products);
    console.log(`Đã tạo thành công ${products.length} sản phẩm ngẫu nhiên với hình ảnh đúng chuẩn.`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

seed();
