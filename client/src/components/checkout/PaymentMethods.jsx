import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Building2, Truck, CreditCard, CheckCircle } from 'lucide-react';

// Payment method icons
const AirtelMoneyIcon = () => (
  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
    <span className="text-white font-bold text-xs">AM</span>
  </div>
);

const TNMMpambaIcon = () => (
  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
    <span className="text-white font-bold text-xs">TNM</span>
  </div>
);

const NationalBankIcon = () => (
  <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center">
    <span className="text-white font-bold text-xs">NBM</span>
  </div>
);

const StandardBankIcon = () => (
  <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center">
    <span className="text-white font-bold text-xs">SB</span>
  </div>
);

const FDHBankIcon = () => (
  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
    <span className="text-white font-bold text-xs">FDH</span>
  </div>
);

const PaymentMethods = ({ onSelectPayment, selectedMethod }) => {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');

  const paymentMethods = [
    {
      id: 'airtel_money',
      name: t('payment.airtelMoney'),
      icon: <AirtelMoneyIcon />,
      type: 'mobile',
      description: t('payment.instructions.airtel'),
      prefix: '099'
    },
    {
      id: 'tnm_mpamba',
      name: t('payment.tnmMpamba'),
      icon: <TNMMpambaIcon />,
      type: 'mobile',
      description: t('payment.instructions.tnm'),
      prefix: '088'
    },
    {
      id: 'national_bank',
      name: t('payment.nationalBank'),
      icon: <NationalBankIcon />,
      type: 'bank',
      description: t('payment.instructions.bank'),
      accountNumber: '1001234567890',
      accountName: 'Mugodi Limited'
    },
    {
      id: 'standard_bank',
      name: t('payment.standardBank'),
      icon: <StandardBankIcon />,
      type: 'bank',
      description: t('payment.instructions.bank'),
      accountNumber: '9100123456789',
      accountName: 'Mugodi Limited'
    },
    {
      id: 'fdh_bank',
      name: t('payment.fdhBank'),
      icon: <FDHBankIcon />,
      type: 'bank',
      description: t('payment.instructions.bank'),
      accountNumber: '1234567890123',
      accountName: 'Mugodi Limited'
    },
    {
      id: 'cash_on_delivery',
      name: t('payment.cashOnDelivery'),
      icon: <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center"><Truck className="w-5 h-5 text-white" /></div>,
      type: 'cod',
      description: t('payment.instructions.cod')
    }
  ];

  const handleSelectMethod = (method) => {
    onSelectPayment({
      ...method,
      phoneNumber: method.type === 'mobile' ? phoneNumber : undefined
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('payment.selectMethod')}</h3>

      {/* Mobile Money Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          {t('payment.mobileMoney')}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {paymentMethods.filter(m => m.type === 'mobile').map((method) => (
            <button
              key={method.id}
              onClick={() => handleSelectMethod(method)}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
                selectedMethod?.id === method.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {method.icon}
              <div className="flex-1">
                <p className="font-medium text-gray-900">{method.name}</p>
                <p className="text-xs text-gray-500">{method.prefix}XXXXXXX</p>
              </div>
              {selectedMethod?.id === method.id && (
                <CheckCircle className="w-5 h-5 text-primary-500" />
              )}
            </button>
          ))}
        </div>

        {/* Phone number input for mobile money */}
        {selectedMethod?.type === 'mobile' && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('payment.enterPhone')}
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={t('payment.phonePlaceholder')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              maxLength={10}
            />
            <p className="mt-2 text-xs text-gray-500">{selectedMethod.description}</p>
          </div>
        )}
      </div>

      {/* Bank Transfer Section */}
      <div className="space-y-3 mt-6">
        <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          {t('payment.bankTransfer')}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {paymentMethods.filter(m => m.type === 'bank').map((method) => (
            <button
              key={method.id}
              onClick={() => handleSelectMethod(method)}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                selectedMethod?.id === method.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {method.icon}
              <p className="font-medium text-gray-900 text-sm text-center">{method.name}</p>
              {selectedMethod?.id === method.id && (
                <CheckCircle className="w-5 h-5 text-primary-500" />
              )}
            </button>
          ))}
        </div>

        {/* Bank details for bank transfer */}
        {selectedMethod?.type === 'bank' && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-3">{selectedMethod.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Bank:</span>
                <span className="text-sm font-medium">{selectedMethod.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Account Name:</span>
                <span className="text-sm font-medium">{selectedMethod.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Account Number:</span>
                <span className="text-sm font-medium font-mono">{selectedMethod.accountNumber}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cash on Delivery */}
      <div className="space-y-3 mt-6">
        <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2">
          <Truck className="w-4 h-4" />
          {t('payment.cashOnDelivery')}
        </h4>
        {paymentMethods.filter(m => m.type === 'cod').map((method) => (
          <button
            key={method.id}
            onClick={() => handleSelectMethod(method)}
            className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${
              selectedMethod?.id === method.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {method.icon}
            <div className="flex-1">
              <p className="font-medium text-gray-900">{method.name}</p>
              <p className="text-xs text-gray-500">{method.description}</p>
            </div>
            {selectedMethod?.id === method.id && (
              <CheckCircle className="w-5 h-5 text-primary-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
