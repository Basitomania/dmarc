// components/NavigationMenu.tsx
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NavigationMenu = () => {
  const pathname = usePathname();

  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/questions', label: 'Questions' },
  ];

  return (
    <div className=" flex justify-center mb-2 mt-8">
      <ul className="flex space-x-4">
        {navigationLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>
              <p
                className={
                  pathname === link.href
                    ? 'text-blue-500 hover:text-blue-700 font-semibold'
                    : 'text-gray-500 hover:text-gray-700'
                }
              >
                {link.label}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavigationMenu;
