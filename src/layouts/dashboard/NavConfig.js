// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    visibility: ['guest', 'admin'],
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    visibility: ['guest', 'admin'],
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'tickets',
    path: '/dashboard/tickets',
    visibility: ['guest', 'admin'],
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'product',
    path: '/dashboard/products',
    visibility: ['guest', 'admin'],
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'blog',
    path: '/dashboard/blog',
    visibility: ['guest', 'admin'],
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: 'login',
    path: '/login',
    visibility: ['guest', 'admin'],
    icon: getIcon('eva:lock-fill'),
  },
  {
    title: 'register',
    path: '/register',
    visibility: ['guest', 'admin'],
    icon: getIcon('eva:person-add-fill'),
  },
  {
    title: 'Not found',
    path: '/404',
    visibility: ['guest', 'admin'],
    icon: getIcon('eva:alert-triangle-fill'),
  },
];

export default navConfig;
