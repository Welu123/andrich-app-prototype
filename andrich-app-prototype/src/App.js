import React, { useState, useMemo, useEffect } from 'react';
import { Bus, ArrowRight, User, Users, Calendar, Smartphone, QrCode, CreditCard, CheckCircle, ChevronLeft, Minus, Plus, Ticket, Clock } from 'lucide-react';

// --- MOCK DATA ---
const routes = [
  { from: 'Lusaka', to: 'Chipata', price: 350 },
  { from: 'Lusaka', to: 'Ndola', price: 280 },
  { from: 'Lusaka', to: 'Livingstone', price: 400 },
  { from: 'Ndola', to: 'Kitwe', price: 50 },
  { from: 'Chipata', to: 'Lundazi', price: 150 },
  { from: 'Chipata', to: 'Lusaka', price: 350 },
];

const generateSeats = () => {
    const seats = [];
    const rows = 12;
    const layout = ['A', 'B', 'C', 'D'];
    let occupiedCount = 0;
    const maxOccupied = 15;

    for (let i = 1; i <= rows; i++) {
        for (const col of layout) {
            const isOccupied = Math.random() < 0.3 && occupiedCount < maxOccupied;
            if (isOccupied) occupiedCount++;
            seats.push({ id: `${col}${i}`, isOccupied });
        }
    }
    return seats;
};

// --- HELPER COMPONENTS ---
const Header = ({ title, onBack }) => (
  <div className="bg-black text-white p-4 flex items-center relative shadow-md">
    {onBack && (
      <button onClick={onBack} className="absolute left-4 p-2">
        <ChevronLeft size={24} />
      </button>
    )}
    <div className="flex-1 flex justify-center items-center">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-M6nx6dfj_C25ob2i2Y1b4x9rF-SI-g2Bg&s" alt="Andrich Logo" className="h-8 w-8 mr-2 rounded-full" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display='block'; }}/>
        <div style={{display: 'none'}} className="h-8 w-8 mr-2 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-lg">A</div>
        <h1 className="text-xl font-bold">{title}</h1>
    </div>
  </div>
);

const LargeButton = ({ onClick, children, className = '', disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full bg-orange-500 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:bg-orange-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

const InputField = ({ icon, children }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
        {icon}
        <div className="w-full">{children}</div>
    </div>
);


// --- SCREEN COMPONENTS (MOVED OUTSIDE) ---
const WelcomeScreen = ({ onBookNowClick }) => (
    <div className="bg-black text-white h-full flex flex-col justify-between p-8">
        <div className="flex-grow flex flex-col items-center justify-center text-center">
            <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-M6nx6dfj_C25ob2i2Y1b4x9rF-SI-g2Bg&s" 
                alt="Andrich Logo" 
                className="h-24 w-24 mb-6 rounded-full shadow-lg" 
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display='flex'; }}
            />
            <div style={{display: 'none'}} className="h-24 w-24 mb-6 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-5xl shadow-lg">A</div>

            <h1 className="text-4xl font-extrabold text-white">Welcome to</h1>
            <h2 className="text-3xl font-bold text-yellow-400">Andrich Coach Services</h2>
            <p className="mt-4 text-gray-300 max-w-sm">Your reliable partner for luxury and comfortable travel across Zambia.</p>
        </div>
        <LargeButton onClick={onBookNowClick} className="bg-yellow-400 text-black flex items-center justify-center gap-2">
            <Ticket size={24}/>
            Book Your Ticket Now
        </LargeButton>
    </div>
);

const HomeScreen = ({ onBack, passengerName, setPassengerName, departure, setDeparture, arrival, setArrival, travelDate, setTravelDate, passengers, setPassengers, onProceedToSeats, departureTime, setDepartureTime }) => {
    const uniqueFromTowns = routes.map(r => r.from).filter((v, i, a) => a.indexOf(v) === i);
    const availableRoutesTo = routes.filter(r => r.from === departure);

    const isChipataLusakaRoute = (departure === 'Lusaka' && arrival === 'Chipata') || (departure === 'Chipata' && arrival === 'Lusaka');

    return (
    <div>
        <Header title="Book a Ticket" onBack={onBack} />
        <div className="p-6 space-y-5 bg-gray-50">
            <InputField icon={<User size={24} className="text-gray-500" />}>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <input 
                    type="text" 
                    placeholder="Enter your full name"
                    value={passengerName} 
                    onChange={(e) => setPassengerName(e.target.value)} 
                    className="w-full bg-transparent text-lg font-semibold focus:outline-none" 
                />
            </InputField>
            <InputField icon={<Bus size={24} className="text-gray-500" />}>
                <label className="text-sm font-medium text-gray-600">Leaving from</label>
                <select value={departure} onChange={(e) => setDeparture(e.target.value)} className="w-full bg-transparent text-lg font-semibold focus:outline-none">
                    {uniqueFromTowns.map(town => <option key={town} value={town}>{town}</option>)}
                </select>
            </InputField>
            <InputField icon={<ArrowRight size={24} className="text-gray-500" />}>
                <label className="text-sm font-medium text-gray-600">Going to</label>
                 <select value={arrival} onChange={(e) => setArrival(e.target.value)} className="w-full bg-transparent text-lg font-semibold focus:outline-none">
                    {availableRoutesTo.map(route => (
                        <option key={route.to} value={route.to}>
                            {`${route.to} - ZMW ${route.price.toFixed(2)}`}
                        </option>
                    ))}
                </select>
            </InputField>
            {isChipataLusakaRoute && (
                 <InputField icon={<Clock size={24} className="text-gray-500" />}>
                    <label className="text-sm font-medium text-gray-600">Departure Time</label>
                    <select value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className="w-full bg-transparent text-lg font-semibold focus:outline-none">
                        <option value="04:00">04:00 HRS</option>
                        <option value="08:00">08:00 HRS</option>
                    </select>
                </InputField>
            )}
            <InputField icon={<Calendar size={24} className="text-gray-500" />}>
                <label className="text-sm font-medium text-gray-600">Travel Date</label>
                <input type="date" value={travelDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setTravelDate(e.target.value)} className="w-full bg-transparent text-lg font-semibold focus:outline-none" />
            </InputField>
            <InputField icon={<Users size={24} className="text-gray-500" />}>
                <div className="flex justify-between items-center w-full">
                    <div>
                        <label className="text-sm font-medium text-gray-600">Passengers</label>
                        <p className="text-lg font-semibold">{passengers}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setPassengers(p => Math.max(1, p - 1))} className="bg-gray-200 rounded-full p-2"><Minus size={20} /></button>
                        <button onClick={() => setPassengers(p => Math.min(10, p + 1))} className="bg-gray-200 rounded-full p-2"><Plus size={20} /></button>
                    </div>
                </div>
            </InputField>
            <div className="pt-4">
              <LargeButton onClick={onProceedToSeats}>Find Bus</LargeButton>
            </div>
        </div>
    </div>
    );
};

const SeatSelectionScreen = ({ onBack, departure, arrival, travelDate, departureTime, busSeats, selectedSeats, handleSeatSelect, passengers, totalPrice, onProceedToPayment }) => {
    const isChipataLusakaRoute = (departure === 'Lusaka' && arrival === 'Chipata') || (departure === 'Chipata' && arrival === 'Lusaka');
    return (
        <div>
          <Header title="Select Seats" onBack={onBack} />
          <div className="p-4 bg-gray-50 pb-40">
            <div className="bg-white p-3 rounded-lg shadow-sm mb-4 text-center">
                <p className="font-semibold text-lg">{departure} to {arrival}</p>
                <p className="text-sm text-gray-600">
                    {new Date(travelDate).toDateString()} 
                    {isChipataLusakaRoute && ` at ${departureTime} HRS`}
                </p>
            </div>
            <div className="flex justify-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-200 rounded-sm border"></div>Available</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-400 rounded-sm border"></div>Selected</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-500 rounded-sm border"></div>Occupied</div>
            </div>
            <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                 <div className="relative grid grid-cols-5 gap-2 justify-items-center">
                    <div className="col-span-5 mb-2 text-center font-bold text-gray-500">DRIVER</div>
                    <div className="col-span-5 h-1 bg-gray-200 w-full mb-2"></div>
                    {busSeats.map((seat, index) => (
                        <React.Fragment key={seat.id}>
                            {index % 4 === 2 && <div className="col-start-3"></div>}
                            <button
                                onClick={() => !seat.isOccupied && handleSeatSelect(seat.id)}
                                disabled={seat.isOccupied}
                                className={`w-12 h-12 flex items-center justify-center font-semibold rounded-lg border-2 transition-transform duration-200
                                    ${seat.isOccupied ? 'bg-gray-500 text-white cursor-not-allowed' : 
                                    selectedSeats.includes(seat.id) ? 'bg-yellow-400 border-yellow-600 scale-110' : 
                                    'bg-gray-200 border-gray-300 hover:bg-orange-200'}`}
                            >
                                {seat.id}
                            </button>
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
                <div className="flex justify-between items-center mb-3">
                    <div>
                        <p className="text-sm text-gray-600">Seats Selected</p>
                        <p className="font-bold text-lg">{selectedSeats.join(', ') || 'None'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Total Price</p>
                        <p className="font-bold text-lg text-orange-600">ZMW {totalPrice.toFixed(2)}</p>
                    </div>
                </div>
                <LargeButton 
                    onClick={onProceedToPayment}
                    disabled={selectedSeats.length !== passengers || selectedSeats.length === 0}
                >
                    Proceed to Payment
                </LargeButton>
            </div>
          </div>
        </div>
    );
};
  
const PaymentScreen = ({ onBack, passengerName, departure, arrival, selectedSeats, totalPrice, phoneNumber, setPhoneNumber, isVerified, handleVerifyPhone, paymentMethod, setPaymentMethod, onConfirmBooking, departureTime }) => {
    const isChipataLusakaRoute = (departure === 'Lusaka' && arrival === 'Chipata') || (departure === 'Chipata' && arrival === 'Lusaka');
    return (
        <div>
            <Header title="Payment" onBack={onBack} />
            <div className="p-6 bg-gray-50 space-y-5">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-lg mb-2">Order Summary</h3>
                    <div className="text-gray-700 space-y-1">
                        <p><strong>Passenger:</strong> {passengerName}</p>
                        <p><strong>Route:</strong> {departure} to {arrival}</p>
                        {isChipataLusakaRoute && <p><strong>Time:</strong> {departureTime} HRS</p>}
                        <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
                        <p className="text-xl font-bold text-orange-600">Total: ZMW {totalPrice.toFixed(2)}</p>
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2">1. Verify Your Number</h3>
                     <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                        <Smartphone size={24} className="text-gray-500"/>
                        <input 
                            type="tel"
                            placeholder="09... Mobile Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full bg-transparent text-lg font-semibold focus:outline-none"
                        />
                        <button onClick={handleVerifyPhone} disabled={isVerified} className={`text-sm font-bold ${isVerified ? 'text-green-500' : 'text-orange-500'}`}>
                            {isVerified ? <CheckCircle /> : 'Verify'}
                        </button>
                     </div>
                </div>
                 <div>
                    <h3 className="font-bold text-lg mb-2">2. Select Payment Method</h3>
                    <div className="space-y-3">
                        {['mtn', 'airtel', 'zamtel', 'card'].map(method => {
                            const logos = {
                                mtn: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/New-mtn-logo.jpg/800px-New-mtn-logo.jpg",
                                airtel: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Airtel_logo.svg/2560px-Airtel_logo.svg.png",
                                zamtel: "https://www.zamtel.zm/wp-content/uploads/2022/10/Zamtel_logo-1.png",
                                card: null,
                            };
                            const names = { mtn: 'MTN Mobile Money', airtel: 'Airtel Money', zamtel: 'Zamtel Kwacha', card: 'Bank Card' };
                            return (
                                <button key={method} onClick={() => setPaymentMethod(method)} className={`w-full p-4 bg-white rounded-xl shadow-sm border-2 flex items-center gap-4 text-left transition-all ${paymentMethod === method ? 'border-orange-500 ring-2 ring-orange-300' : 'border-gray-200'}`}>
                                    {logos[method] ? 
                                      <img src={logos[method]} alt={names[method]} className="h-8 w-12 object-contain" /> : 
                                      <CreditCard size={32} className="text-gray-600" /> 
                                    }
                                    <span className="font-semibold text-lg flex-1">{names[method]}</span>
                                    {paymentMethod === method && <CheckCircle className="text-orange-500" />}
                                </button>
                            )
                        })}
                    </div>
                 </div>
                 <div className="pt-4">
                    <LargeButton onClick={onConfirmBooking} disabled={!isVerified || !paymentMethod}>
                        Pay ZMW {totalPrice.toFixed(2)}
                    </LargeButton>
                </div>
            </div>
        </div>
    );
};

const ConfirmationScreen = ({ departure, arrival, passengerName, travelDate, selectedSeats, phoneNumber, totalPrice, onNewBooking, departureTime }) => {
    const isChipataLusakaRoute = (departure === 'Lusaka' && arrival === 'Chipata') || (departure === 'Chipata' && arrival === 'Lusaka');
    return (
        <div className="bg-black h-full">
            <Header title="Booking Confirmed" />
            <div className="p-6 text-center text-white">
                <CheckCircle size={64} className="mx-auto text-green-400 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Success!</h2>
                <p className="text-gray-300 mb-6">Your ticket is ready. Show this QR code to the officer at the station.</p>
            </div>
            <div className="mx-6 p-1 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl shadow-2xl">
                <div className="bg-white rounded-xl p-6 text-black">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-xl">{departure} to {arrival}</h3>
                            <p className="text-gray-600">Andrich Coach Services</p>
                        </div>
                         <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz-M6nx6dfj_C25ob2i2Y1b4x9rF-SI-g2Bg&s" alt="Logo" className="h-12 w-12 rounded-full" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display='block'; }}/>
                         <div style={{display: 'none'}} className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-2xl">A</div>
                    </div>
                    <div className="flex justify-between gap-4">
                        <div className="bg-gray-100 p-2 rounded-lg"><QrCode size={120} /></div>
                        <div className="text-left space-y-2 flex-1">
                            <div><p className="text-xs text-gray-500">PASSENGER</p><p className="font-semibold">{passengerName}</p></div>
                            <div className="flex gap-4">
                                <div><p className="text-xs text-gray-500">DATE</p><p className="font-semibold">{new Date(travelDate).toDateString()}</p></div>
                                {isChipataLusakaRoute && <div><p className="text-xs text-gray-500">TIME</p><p className="font-semibold">{departureTime} HRS</p></div>}
                            </div>
                            <div><p className="text-xs text-gray-500">SEATS</p><p className="font-bold text-lg">{selectedSeats.join(', ')}</p></div>
                            <div><p className="text-xs text-gray-500">MOBILE</p><p className="font-semibold">{phoneNumber}</p></div>
                            <div><p className="text-xs text-gray-500">AMOUNT PAID</p><p className="font-bold text-orange-600">ZMW {totalPrice.toFixed(2)}</p></div>
                        </div>
                    </div>
                    <div className="mt-4 text-center text-xs text-gray-500 border-t pt-2">Booking ID: {(Math.random() + 1).toString(36).substring(2).toUpperCase()}</div>
                </div>
            </div>
            <div className="p-6 mt-4">
                <LargeButton onClick={onNewBooking} className="bg-yellow-400 text-black">
                    Book Another Ticket
                </LargeButton>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
export default function App() {
  const [screen, setScreen] = useState('welcome'); // 'welcome', 'home', 'seats', 'payment', 'confirmation'
  
  // Booking State
  const [passengerName, setPassengerName] = useState('');
  const [departure, setDeparture] = useState('Lusaka');
  const [arrival, setArrival] = useState('Chipata');
  const [departureTime, setDepartureTime] = useState('04:00');
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
  const [passengers, setPassengers] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Payment State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const busSeats = useMemo(() => generateSeats(), []);
  const selectedRoute = routes.find(r => r.from === departure && r.to === arrival);
  const totalPrice = selectedRoute ? selectedRoute.price * passengers : 0; // Price calculation changed to passengers

  // Effect to update arrival town when departure town changes
  useEffect(() => {
    const availableDestinations = routes.filter(r => r.from === departure);
    if (availableDestinations.length > 0) {
      // If current arrival is not valid for new departure, set to the first available one
      if (!availableDestinations.some(d => d.to === arrival)) {
        setArrival(availableDestinations[0].to);
      }
    }
  }, [departure]); // Rerun when departure changes

  const handleSeatSelect = (seatId) => {
    setSelectedSeats(currentSeats => {
      if (currentSeats.includes(seatId)) {
        return currentSeats.filter(s => s !== seatId);
      }
      if (currentSeats.length < passengers) {
        return [...currentSeats, seatId];
      }
      console.warn(`You can only select ${passengers} seat(s).`);
      return currentSeats;
    });
  };
  
  const handleProceedToSeats = () => {
      if (!passengerName || !departure || !arrival || !travelDate || passengers < 1) {
          console.error('Please fill in all the details.');
          return;
      }
      if (departure === arrival) {
          console.error('Departure and arrival towns cannot be the same.');
          return;
      }
      setSelectedSeats([]);
      setScreen('seats');
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length !== passengers) {
        console.error(`Please select exactly ${passengers} seat(s).`);
        return;
    }
    setScreen('payment');
  };
    
  const handleVerifyPhone = () => {
    if (phoneNumber.match(/^(0(9[567]))\d{7}$/)) {
        console.log('An OTP has been sent to your phone. (For demo, enter any 4 digits)');
        setTimeout(() => setIsVerified(true), 1000);
    } else {
        console.error('Please enter a valid Zambian mobile number (e.g., 097..., 096..., 095...).');
    }
  };

  const handleConfirmBooking = () => {
      if (!isVerified || !paymentMethod) {
          console.error('Please verify your phone number or select a payment method.');
          return;
      }
      console.log('Processing payment...');
      setScreen('confirmation');
  };
  
  const handleNewBooking = () => {
    setPassengerName('');
    setDeparture('Lusaka');
    setArrival('Chipata');
    setDepartureTime('04:00');
    setTravelDate(new Date().toISOString().split('T')[0]);
    setPassengers(1);
    setSelectedSeats([]);
    setPhoneNumber('');
    setIsVerified(false);
    setPaymentMethod(null);
    setScreen('home');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen 
            onBack={() => setScreen('welcome')}
            passengerName={passengerName} setPassengerName={setPassengerName}
            departure={departure} setDeparture={setDeparture}
            arrival={arrival} setArrival={setArrival}
            travelDate={travelDate} setTravelDate={setTravelDate}
            passengers={passengers} setPassengers={setPassengers}
            onProceedToSeats={handleProceedToSeats}
            departureTime={departureTime} setDepartureTime={setDepartureTime}
        />;
      case 'seats':
        // NOTE: The total price on this screen reflects selected seats, not total passengers yet.
        const seatSelectPrice = selectedRoute ? selectedRoute.price * selectedSeats.length : 0;
        return <SeatSelectionScreen 
            onBack={() => setScreen('home')}
            departure={departure} arrival={arrival} travelDate={travelDate} departureTime={departureTime}
            busSeats={busSeats}
            selectedSeats={selectedSeats} handleSeatSelect={handleSeatSelect}
            passengers={passengers}
            totalPrice={seatSelectPrice}
            onProceedToPayment={handleProceedToPayment}
        />;
      case 'payment':
        return <PaymentScreen 
            onBack={() => setScreen('seats')}
            passengerName={passengerName} departure={departure} arrival={arrival} selectedSeats={selectedSeats} totalPrice={totalPrice}
            phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
            isVerified={isVerified} handleVerifyPhone={handleVerifyPhone}
            paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
            onConfirmBooking={handleConfirmBooking}
            departureTime={departureTime}
        />;
      case 'confirmation':
        return <ConfirmationScreen
            departure={departure} arrival={arrival} passengerName={passengerName}
            travelDate={travelDate} selectedSeats={selectedSeats} phoneNumber={phoneNumber}
            totalPrice={totalPrice} onNewBooking={handleNewBooking}
            departureTime={departureTime}
        />;
      default:
        return <WelcomeScreen onBookNowClick={() => setScreen('home')} />;
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50 font-sans antialiased" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="max-w-md mx-auto h-full bg-white shadow-2xl overflow-y-auto">
            {renderScreen()}
        </div>
    </div>
  );
}
