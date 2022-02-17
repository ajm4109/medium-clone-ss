import Link from 'next/link'
import Image from 'next/image';

const Header = () => {
  return (
  <header className='flex items-center justify-between p-5 max-w-7xl mx-auto'>
      <div className='flex items-center space-x-5'>
        <Link href='/'>
          <a>
            <Image src='/med_logo.png' height={50} width={200} className='object-contain' />
          </a>
        </Link>
        <div className='hidden md:inline-flex items-center space-x-5'>
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className='text-white bg-green-400 px-4 py-1 rounded-full'>Follow</h3>
        </div>
      </div>

      <div className='flex items-center space-x-5 text-green-600'>
        <h3>Sign In</h3>
        <h3 className='border border-green-600 px-4 py-1 rounded-full'>Get Started</h3>
      </div>
  </header>
  );
};

export default Header;
