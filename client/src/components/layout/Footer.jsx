import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';

// Social media icons as SVG components
const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success(t('success.addedToWishlist').replace('wishlist', 'newsletter'));
      setEmail('');
    }
  };

  return (
    <footer className="bg-white border-t dark:bg-gray-800 dark:border-gray-700">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Newsletter */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link to="/" className="flex items-center mb-6">
              <img
                src="/logo.jpg"
                alt="Mugodi"
                className="h-24 w-auto object-contain"
              />
            </Link>

            {/* Newsletter */}
            <h4 className="text-lg font-semibold text-gray-900 mb-3 dark:text-white">{t('footer.newsletter')}</h4>
            <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
              {t('footer.newsletterText')}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-primary-500 text-white font-medium rounded-r-lg hover:bg-primary-600 transition-colors text-sm"
              >
                {t('footer.subscribe')}
              </button>
            </form>
          </div>

          {/* Download Our App */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">{t('footer.downloadApp')}</h4>
            <div className="space-y-3">
              {/* Google Play Button */}
              <a
                href="#"
                className="flex items-center space-x-3 bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors w-fit"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.99l-2.302 2.302-8.634-8.634z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] opacity-80">GET IT ON</div>
                  <div className="text-sm font-semibold -mt-0.5">Google Play</div>
                </div>
              </a>

              {/* App Store Button */}
              <a
                href="#"
                className="flex items-center space-x-3 bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors w-fit"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] opacity-80">Download on the</div>
                  <div className="text-sm font-semibold -mt-0.5">App Store</div>
                </div>
              </a>
            </div>
          </div>

          {/* My Account */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">{t('footer.myAccount')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-primary-500 transition-colors text-sm dark:text-gray-400 dark:hover:text-primary-400">
                  {t('common.profile')}
                </Link>
              </li>
              <li>
                <Link to="/addresses" className="text-gray-600 hover:text-primary-500 transition-colors text-sm dark:text-gray-400 dark:hover:text-primary-400">
                  {t('profile.addresses')}
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-600 hover:text-primary-500 transition-colors text-sm dark:text-gray-400 dark:hover:text-primary-400">
                  {t('footer.customerSupport')}
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-600 hover:text-primary-500 transition-colors text-sm dark:text-gray-400 dark:hover:text-primary-400">
                  {t('profile.orders')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary-500 transition-colors text-sm dark:text-gray-400 dark:hover:text-primary-400">
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary-500 transition-colors text-sm dark:text-gray-400 dark:hover:text-primary-400">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary-500 transition-colors text-sm dark:text-gray-400 dark:hover:text-primary-400">
                  {t('footer.termsConditions')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary-500 transition-colors text-sm dark:text-gray-400 dark:hover:text-primary-400">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary-500 transition-colors text-sm dark:text-gray-400 dark:hover:text-primary-400">
                  {t('footer.faq')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t dark:border-gray-700">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('footer.followUs')}</span>
              <div className="flex items-center gap-3">
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:text-white">
                  <TwitterIcon />
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:text-white">
                  <InstagramIcon />
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:text-white">
                  <FacebookIcon />
                </a>
                <a href="#" className="text-gray-500 hover:text-green-600 transition-colors dark:text-gray-400 dark:hover:text-green-400">
                  <WhatsAppIcon />
                </a>
              </div>
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('footer.copyright')} &copy; {new Date().getFullYear()}, <span className="text-primary-500 font-medium">Mugodi</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
