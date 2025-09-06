import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const Index = () => {
  const { toast } = useToast();
  const [balance, setBalance] = useState(() => parseFloat(localStorage.getItem('balance') || '0'));
  const [activeSection, setActiveSection] = useState('home');
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('orders') || '[]'));
  const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem('notifications') || '[]'));
  const [customAmount, setCustomAmount] = useState('');
  const [username, setUsername] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: 'Telegram Stars',
        description: 'Покупайте звёзды для Telegram и используйте их в боте',
        price: 100,
        originalPrice: 120,
        category: 'stars',
        icon: 'Star',
        image: null,
        gradient: 'from-telegram to-blue-600'
      },
      {
        id: 2,
        title: 'Telegram Premium',
        description: 'Месячная подписка на Telegram Premium со всеми функциями',
        price: 299,
        originalPrice: 349,
        category: 'premium',
        icon: 'Crown',
        image: null,
        gradient: 'from-gold to-yellow-500'
      },
      {
        id: 3,
        title: 'NFT Подарки',
        description: 'Эксклюзивные NFT подарки для коллекционеров',
        price: 500,
        originalPrice: 650,
        category: 'nft',
        icon: 'Gift',
        image: null,
        gradient: 'from-orange to-red-500'
      }
    ];
  });

  // Новый товар
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'custom',
    icon: 'Package',
    image: null
  });

  useEffect(() => {
    localStorage.setItem('balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const menuItems = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'catalog', label: 'Каталог', icon: 'ShoppingBag' },
    { id: 'balance', label: 'Баланс', icon: 'Wallet' },
    { id: 'profile', label: 'Профиль', icon: 'User' },
    { id: 'history', label: 'История', icon: 'History' },
    ...(isAdmin ? [{ id: 'admin', label: 'Админ', icon: 'Settings' }] : [])
  ];

  const handleTopUp = (amount, method = 'card') => {
    // Симуляция пополнения
    setTimeout(() => {
      setBalance(prev => prev + amount);
      toast({
        title: "Баланс пополнен!",
        description: `+${amount}₽ через ${method === 'sbp' ? 'СБП' : 'карту'}`
      });
    }, 2000);

    toast({
      title: "Обработка платежа...",
      description: "Подождите, идет перевод средств"
    });
  };

  const handleCustomTopUp = () => {
    const amount = parseFloat(customAmount);
    if (amount > 0) {
      handleTopUp(amount);
      setCustomAmount('');
    }
  };

  const handlePurchase = (product) => {
    if (balance >= product.price && username.trim()) {
      setBalance(prev => prev - product.price);
      const newOrder = {
        id: Date.now(),
        productId: product.id,
        productTitle: product.title,
        price: product.price,
        username: username,
        status: 'pending',
        date: new Date().toLocaleDateString('ru-RU')
      };
      setOrders(prev => [...prev, newOrder]);
      
      toast({
        title: "Заказ оформлен!",
        description: `${product.title} для @${username}`
      });
      
      setUsername('');
      setSelectedProduct(null);
    } else if (!username.trim()) {
      toast({
        title: "Ошибка",
        description: "Укажите ваш username в Telegram",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Недостаточно средств",
        description: "Пополните баланс",
        variant: "destructive"
      });
    }
  };

  const handleAddProduct = () => {
    if (newProduct.title && newProduct.price) {
      const product = {
        ...newProduct,
        id: Date.now(),
        price: parseFloat(newProduct.price),
        originalPrice: parseFloat(newProduct.originalPrice) || parseFloat(newProduct.price),
        gradient: 'from-purple-500 to-pink-500'
      };
      setProducts(prev => [...prev, product]);
      setNewProduct({
        title: '',
        description: '',
        price: '',
        originalPrice: '',
        category: 'custom',
        icon: 'Package',
        image: null
      });
      
      toast({
        title: "Товар добавлен!",
        description: product.title
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewProduct(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOrderComplete = (orderId) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: 'completed' }
        : order
    ));
    
    const order = orders.find(o => o.id === orderId);
    const notification = {
      id: Date.now(),
      username: order.username,
      message: `Ваш заказ "${order.productTitle}" был доставлен!`,
      date: new Date().toLocaleDateString('ru-RU')
    };
    
    setNotifications(prev => [...prev, notification]);
    
    toast({
      title: "Заказ выполнен!",
      description: `Уведомление отправлено @${order.username}`
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div className="space-y-8">
            {notifications.length > 0 && (
              <Alert className="bg-green-50 border-green-200">
                <Icon name="CheckCircle" className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {notifications[notifications.length - 1].message}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="relative bg-gradient-to-r from-telegram via-blue-500 to-gold p-8 rounded-2xl text-white overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-4xl font-bold mb-4">Telegram Store</h1>
                <p className="text-xl mb-6">Лучшие товары для Telegram по выгодным ценам</p>
                <Button size="lg" variant="secondary" className="bg-white text-telegram hover:bg-gray-100"
                  onClick={() => setActiveSection('catalog')}>
                  Начать покупки
                </Button>
              </div>
              <div className="absolute top-4 right-4 opacity-20">
                <Icon name="Zap" size={120} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.slice(0, 3).map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  {product.image ? (
                    <div className="h-32 overflow-hidden">
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  ) : (
                    <div className={`h-32 bg-gradient-to-br ${product.gradient} p-4 flex items-center justify-center`}>
                      <Icon name={product.icon} size={48} className="text-white group-hover:scale-110 transition-transform" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{product.title}</CardTitle>
                      <Badge variant="secondary">Хит</Badge>
                    </div>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-telegram">{product.price}₽</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">{product.originalPrice}₽</span>
                        )}
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-telegram hover:bg-blue-600" onClick={() => setSelectedProduct(product)}>
                          <Icon name="ShoppingCart" size={16} className="mr-2" />
                          Купить
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Покупка: {selectedProduct?.title}</DialogTitle>
                          <DialogDescription>
                            Подтвердите покупку товара за {selectedProduct?.price}₽
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            {selectedProduct?.image ? (
                              <img src={selectedProduct.image} alt={selectedProduct.title} className="w-16 h-16 mx-auto mb-2 rounded-lg object-cover" />
                            ) : (
                              <Icon name={selectedProduct?.icon} size={32} className="mx-auto mb-2" />
                            )}
                            <p className="font-semibold">{selectedProduct?.title}</p>
                            <p className="text-2xl font-bold text-telegram">{selectedProduct?.price}₽</p>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Ваш username в Telegram (без @)</label>
                            <Input 
                              placeholder="telegram_user"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                            />
                          </div>
                          
                          <Alert>
                            <Icon name="Info" className="h-4 w-4" />
                            <AlertDescription>
                              Баланс: {balance}₽ | Нужно: {selectedProduct?.price}₽
                            </AlertDescription>
                          </Alert>
                          
                          <Button 
                            className="w-full bg-telegram hover:bg-blue-600" 
                            size="lg"
                            onClick={() => handlePurchase(selectedProduct)}
                            disabled={balance < (selectedProduct?.price || 0)}
                          >
                            {balance >= (selectedProduct?.price || 0) ? 'Подтвердить покупку' : 'Недостаточно средств'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'catalog':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Каталог товаров</h2>
            <div className="flex space-x-4 flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-telegram hover:text-white">Все товары</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-telegram hover:text-white">Telegram Stars</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-telegram hover:text-white">Premium</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-telegram hover:text-white">NFT</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all">
                  {product.image ? (
                    <div className="h-48 overflow-hidden">
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  ) : (
                    <div className={`h-24 bg-gradient-to-r ${product.gradient}`}></div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Icon name={product.icon} size={20} />
                      <span>{product.title}</span>
                    </CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-telegram">{product.price}₽</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">{product.originalPrice}₽</span>
                        )}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-telegram hover:bg-blue-600" onClick={() => setSelectedProduct(product)}>
                            Купить
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Покупка: {selectedProduct?.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Ваш username в Telegram (без @)</label>
                              <Input 
                                placeholder="telegram_user"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                              />
                            </div>
                            <Button 
                              className="w-full bg-telegram hover:bg-blue-600" 
                              onClick={() => handlePurchase(selectedProduct)}
                              disabled={balance < (selectedProduct?.price || 0)}
                            >
                              Купить за {selectedProduct?.price}₽
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'balance':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Пополнение баланса</h2>
            <Card className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold mb-2">Текущий баланс</h3>
                <div className="text-4xl font-bold text-telegram">{balance}₽</div>
              </div>
              <Separator className="my-6" />
              
              <Tabs defaultValue="quick" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="quick">Быстрое пополнение</TabsTrigger>
                  <TabsTrigger value="custom">Произвольная сумма</TabsTrigger>
                </TabsList>
                
                <TabsContent value="quick" className="space-y-4">
                  <h4 className="text-lg font-semibold">Выберите сумму</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[100, 500, 1000].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        className="h-16 text-lg hover:bg-telegram hover:text-white"
                        onClick={() => handleTopUp(amount)}
                      >
                        +{amount}₽
                      </Button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      className="bg-telegram hover:bg-blue-600 h-12" 
                      size="lg"
                      onClick={() => handleTopUp(1000, 'card')}
                    >
                      <Icon name="CreditCard" size={16} className="mr-2" />
                      Картой (+1000₽)
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 h-12" 
                      size="lg"
                      onClick={() => handleTopUp(1000, 'sbp')}
                    >
                      <Icon name="Smartphone" size={16} className="mr-2" />
                      СБП (+1000₽)
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="custom" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Введите сумму пополнения</label>
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Введите сумму" 
                        type="number" 
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                      />
                      <Button 
                        className="bg-telegram hover:bg-blue-600"
                        onClick={handleCustomTopUp}
                        disabled={!customAmount || parseFloat(customAmount) <= 0}
                      >
                        <Icon name="Plus" size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      className="bg-telegram hover:bg-blue-600" 
                      size="lg"
                      onClick={() => customAmount && handleTopUp(parseFloat(customAmount), 'card')}
                      disabled={!customAmount}
                    >
                      <Icon name="CreditCard" size={16} className="mr-2" />
                      Пополнить картой
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700" 
                      size="lg"
                      onClick={() => customAmount && handleTopUp(parseFloat(customAmount), 'sbp')}
                      disabled={!customAmount}
                    >
                      <Icon name="Smartphone" size={16} className="mr-2" />
                      Пополнить через СБП
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Личный кабинет</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Админ режим</span>
                <Switch checked={isAdmin} onCheckedChange={(checked) => {
                  setIsAdmin(checked);
                  localStorage.setItem('isAdmin', checked.toString());
                }} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Информация о профиле</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Пользователь:</span>
                    <span className="font-semibold">@telegram_user</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Баланс:</span>
                    <span className="font-semibold text-telegram">{balance}₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Статус:</span>
                    <Badge className={isAdmin ? "bg-purple-500" : "bg-green-500"}>
                      {isAdmin ? 'Администратор' : 'Активный'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Дата регистрации:</span>
                    <span>01.01.2024</span>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Статистика покупок</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Всего покупок:</span>
                    <span className="font-semibold">{orders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Потрачено:</span>
                    <span className="font-semibold">{orders.reduce((sum, order) => sum + order.price, 0)}₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span>В обработке:</span>
                    <span className="font-semibold text-orange-500">{orders.filter(o => o.status === 'pending').length}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">История покупок</h2>
            <div className="space-y-4">
              {orders.length === 0 ? (
                <Card className="p-8 text-center">
                  <Icon name="ShoppingBag" size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">У вас пока нет покупок</p>
                  <Button className="mt-4 bg-telegram hover:bg-blue-600" onClick={() => setActiveSection('catalog')}>
                    Перейти к покупкам
                  </Button>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{order.productTitle}</h4>
                        <p className="text-sm text-gray-500">@{order.username} • {order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-telegram">{order.price}₽</p>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                          {order.status === 'completed' ? 'Доставлен' : 'В обработке'}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        );

      case 'admin':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Админ панель</h2>
            
            <Tabs defaultValue="orders" className="space-y-4">
              <TabsList>
                <TabsTrigger value="orders">Заказы</TabsTrigger>
                <TabsTrigger value="products">Добавить товар</TabsTrigger>
                <TabsTrigger value="stats">Статистика</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders" className="space-y-4">
                <h3 className="text-xl font-semibold">Активные заказы</h3>
                {orders.filter(order => order.status === 'pending').length === 0 ? (
                  <Card className="p-8 text-center">
                    <Icon name="CheckCircle" size={48} className="mx-auto mb-4 text-green-500" />
                    <p className="text-gray-500">Все заказы выполнены!</p>
                  </Card>
                ) : (
                  orders.filter(order => order.status === 'pending').map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-lg">{order.productTitle}</h4>
                          <p className="text-telegram font-medium">@{order.username}</p>
                          <p className="text-sm text-gray-500">{order.date} • {order.price}₽</p>
                        </div>
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleOrderComplete(order.id)}
                        >
                          <Icon name="Check" size={16} className="mr-2" />
                          Подтвердить доставку
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="products" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Добавить новый товар</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Название товара</label>
                        <Input 
                          placeholder="Название товара"
                          value={newProduct.title}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Категория</label>
                        <Select value={newProduct.category} onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="stars">Telegram Stars</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="nft">NFT</SelectItem>
                            <SelectItem value="custom">Другое</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Описание</label>
                      <Textarea 
                        placeholder="Описание товара"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Цена (₽)</label>
                        <Input 
                          type="number"
                          placeholder="100"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Старая цена (₽)</label>
                        <Input 
                          type="number"
                          placeholder="120"
                          value={newProduct.originalPrice}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, originalPrice: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Изображение товара</label>
                      <Input 
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      {newProduct.image && (
                        <div className="mt-2">
                          <img src={newProduct.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full bg-telegram hover:bg-blue-600"
                      onClick={handleAddProduct}
                      disabled={!newProduct.title || !newProduct.price}
                    >
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить товар
                    </Button>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="stats" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 text-center">
                    <Icon name="ShoppingBag" size={32} className="mx-auto mb-2 text-telegram" />
                    <h4 className="text-2xl font-bold">{orders.length}</h4>
                    <p className="text-gray-600">Всего заказов</p>
                  </Card>
                  <Card className="p-6 text-center">
                    <Icon name="DollarSign" size={32} className="mx-auto mb-2 text-green-500" />
                    <h4 className="text-2xl font-bold">{orders.reduce((sum, order) => sum + order.price, 0)}₽</h4>
                    <p className="text-gray-600">Общая выручка</p>
                  </Card>
                  <Card className="p-6 text-center">
                    <Icon name="Package" size={32} className="mx-auto mb-2 text-orange-500" />
                    <h4 className="text-2xl font-bold">{products.length}</h4>
                    <p className="text-gray-600">Товаров в каталоге</p>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-telegram rounded-lg flex items-center justify-center">
                  <Icon name="Send" size={16} className="text-white" />
                </div>
                <span className="text-xl font-bold">Telegram Store</span>
                {isAdmin && <Badge className="bg-purple-500">Admin</Badge>}
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-telegram text-white'
                      : 'text-gray-600 hover:text-telegram hover:bg-blue-50'
                  }`}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-lg">
                <Icon name="Wallet" size={16} />
                <span className="font-semibold">{balance}₽</span>
              </div>
              <Button size="sm" className="bg-gold hover:bg-yellow-500 text-black" onClick={() => setActiveSection('balance')}>
                <Icon name="Plus" size={14} className="mr-1" />
                Пополнить
              </Button>
              {orders.filter(o => o.status === 'pending').length > 0 && isAdmin && (
                <div className="relative">
                  <Button size="sm" variant="outline" onClick={() => setActiveSection('admin')}>
                    <Icon name="Bell" size={14} />
                  </Button>
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {orders.filter(o => o.status === 'pending').length}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="md:hidden bg-white border-t fixed bottom-0 left-0 right-0 z-50">
        <div className="flex">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex-1 flex flex-col items-center py-2 px-1 transition-colors relative ${
                activeSection === item.id
                  ? 'text-telegram bg-blue-50'
                  : 'text-gray-600'
              }`}
            >
              <Icon name={item.icon} size={20} />
              <span className="text-xs mt-1">{item.label}</span>
              {item.id === 'admin' && orders.filter(o => o.status === 'pending').length > 0 && isAdmin && (
                <div className="absolute -top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {orders.filter(o => o.status === 'pending').length}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;