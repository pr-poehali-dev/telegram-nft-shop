import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [balance, setBalance] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  const products = [
    {
      id: 1,
      title: 'Telegram Stars',
      description: 'Покупайте звёзды для Telegram и используйте их в боте',
      price: 100,
      originalPrice: 120,
      category: 'stars',
      icon: 'Star',
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
      gradient: 'from-orange to-red-500'
    }
  ];

  const menuItems = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'catalog', label: 'Каталог', icon: 'ShoppingBag' },
    { id: 'balance', label: 'Баланс', icon: 'Wallet' },
    { id: 'profile', label: 'Профиль', icon: 'User' },
    { id: 'history', label: 'История', icon: 'History' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div className="space-y-8">
            <div className="relative bg-gradient-to-r from-telegram via-blue-500 to-gold p-8 rounded-2xl text-white overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-4xl font-bold mb-4">Telegram Store</h1>
                <p className="text-xl mb-6">Лучшие товары для Telegram по выгодным ценам</p>
                <Button size="lg" variant="secondary" className="bg-white text-telegram hover:bg-gray-100">
                  Начать покупки
                </Button>
              </div>
              <div className="absolute top-4 right-4 opacity-20">
                <Icon name="Zap" size={120} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className={`h-32 bg-gradient-to-br ${product.gradient} p-4 flex items-center justify-center`}>
                    <Icon name={product.icon} size={48} className="text-white group-hover:scale-110 transition-transform" />
                  </div>
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
                        <span className="text-sm text-gray-500 line-through">{product.originalPrice}₽</span>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-telegram hover:bg-blue-600">
                          <Icon name="ShoppingCart" size={16} className="mr-2" />
                          Купить
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Покупка: {product.title}</DialogTitle>
                          <DialogDescription>
                            Подтвердите покупку товара за {product.price}₽
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <Icon name={product.icon} size={32} className="mx-auto mb-2" />
                            <p className="font-semibold">{product.title}</p>
                            <p className="text-2xl font-bold text-telegram">{product.price}₽</p>
                          </div>
                          <Button className="w-full bg-telegram hover:bg-blue-600" size="lg">
                            Подтвердить покупку
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
            <div className="flex space-x-4">
              <Badge variant="outline" className="cursor-pointer hover:bg-telegram hover:text-white">Все товары</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-telegram hover:text-white">Telegram Stars</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-telegram hover:text-white">Premium</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-telegram hover:text-white">NFT</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all">
                  <div className={`h-24 bg-gradient-to-r ${product.gradient}`}></div>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Icon name={product.icon} size={20} />
                      <span>{product.title}</span>
                    </CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-telegram">{product.price}₽</span>
                      <Button size="sm" className="bg-telegram hover:bg-blue-600">Купить</Button>
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
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Быстрое пополнение</h4>
                <div className="grid grid-cols-3 gap-4">
                  {[100, 500, 1000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      className="h-16 text-lg hover:bg-telegram hover:text-white"
                      onClick={() => setBalance(balance + amount)}
                    >
                      +{amount}₽
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Произвольная сумма</label>
                  <div className="flex space-x-2">
                    <Input placeholder="Введите сумму" type="number" />
                    <Button className="bg-telegram hover:bg-blue-600">
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                </div>
                <Button className="w-full bg-gold hover:bg-yellow-500 text-black" size="lg">
                  <Icon name="CreditCard" size={16} className="mr-2" />
                  Пополнить через карту
                </Button>
              </div>
            </Card>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Личный кабинет</h2>
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
                    <Badge className="bg-green-500">Активный</Badge>
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
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Потрачено:</span>
                    <span className="font-semibold">12,450₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Экономия:</span>
                    <span className="font-semibold text-green-500">2,100₽</span>
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
              {[
                { id: 1, title: 'Telegram Premium', date: '05.09.2024', price: 299, status: 'Выполнен' },
                { id: 2, title: 'Telegram Stars', date: '03.09.2024', price: 100, status: 'Выполнен' },
                { id: 3, title: 'NFT Подарок', date: '01.09.2024', price: 500, status: 'В обработке' }
              ].map((order) => (
                <Card key={order.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{order.title}</h4>
                      <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-telegram">{order.price}₽</p>
                      <Badge variant={order.status === 'Выполнен' ? 'default' : 'secondary'}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
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
              <Button size="sm" className="bg-gold hover:bg-yellow-500 text-black">
                <Icon name="Plus" size={14} className="mr-1" />
                Пополнить
              </Button>
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
              className={`flex-1 flex flex-col items-center py-2 px-1 transition-colors ${
                activeSection === item.id
                  ? 'text-telegram bg-blue-50'
                  : 'text-gray-600'
              }`}
            >
              <Icon name={item.icon} size={20} />
              <span className="text-xs mt-1">{item.label}</span>
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