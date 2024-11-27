
import React, { useState, useEffect } from 'react';
import { Form, Empty, DatePicker, InputNumber, Select, message } from 'antd';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import BasicCard from '../Common/BasicCard';
import SelectCurrency from './SelectCurrency';
import image from "../../Assets/login.jpg";
import CustomButton from '../Common/CustomButton';
import { useCurrency } from './CurrencyContext';

const { Option } = Select;

const currencyRates = {
    AED: 3.6725 ,
  ARS: 1004.0114 ,
  AUD: 1.5348,
  BDT: 110.50,
  BHD: 0.3760,
  BND: 1.3456,
  BRL: 5.8149,
  CAD: 1.3971,
  CHF: 0.8865,
  CLP: 973.6481,
  CNY: 7.2462,
  COP: 4389.3228,
  CZK: 24.2096,
  DKK: 7.1221,
  EGP: 48.58,
  EUR: 0.9549,
  GBP: 0.7943,
  HKD: 7.7825,
  HUF: 392.6272,
  IDR: 15911.8070,
  ILS: 3.7184,
  INR: 84.5059,
  JPY: 154.4605,
  KRW: 1399.3230,
  KWD: 0.3077,
  LKR: 291.0263,
  MAD: 10.50,
  MXN: 20.4394,
  MYR: 4.4704,
  NOK: 11.0668,
  NZD: 1.7107,
  OMR: 0.3850,
  PHP: 58.9091,
  PKR: 279.0076,
  PLN: 4.1476,
  QAR: 3.6400,
  RUB: 101.2963,
  SAR: 3.7500,
  SEK: 11.0630,
  SGD: 1.3456,
  THB: 34.7565,
  TRY: 34.5345,
  TWD: 32.5602,
  UAH: 36.90,
  USD : 1,
  VND: 24000.00,
  ZAR: 18.0887,
  };

export const BookFlight = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currency, setCurrency } = useCurrency();

    const handleCurrencyChange = (newCurrency) => {
      setCurrency(newCurrency);
    };    const [touristId, setTouristId] = useState(null);
    const [wallet, setWallet] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode(token);
            const userDetails = decodedToken.userDetails;
            console.log(userDetails);
            setTouristId(userDetails._id);
        }
    }, []);
    const fetchTouristData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/tourist/touristReadProfile/${touristId}`);
            const { wallet } = response.data;
            setWallet(wallet);
        } catch (error) {
            message.error("Failed to fetch tourist data.");
        }
    };

    useEffect(() => {
        if (touristId) {
            fetchTouristData();
        }
    }, [touristId]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { origin, destination, departureDate, count } = values;
            const response = await axios.post('http://localhost:5000/tourist/flights/searchFlights', {
                origin,
                destination,
                departureDate: departureDate.format('YYYY-MM-DD'),
                count,
            });
    
            if (response.data.length === 0) {
                return <Empty description="API QUOTA FINISHED" style={{ marginTop: "20px" }} />;
            } else {
                setFlights(response.data);
            }
    
        } catch (error) {
            if (error.response && error.response.status === 429) {
                message.error("API quota limit has been reached. Please try again later.");
            } else {
                message.error("Error fetching flights. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };
    


    const handleBookFlight = async (flight) => {
      
            const bookingData = {
                departureAirport: flight.departureAirport,
                totalDuration: flight.totalDuration,
                currency: flight.currency,
                price: flight.price,
                departureTime: flight.departureTime,
                departureTerminal: flight.departureTerminal,
                arrivalAirport: flight.arrivalAirport,
                arrivalTime: flight.arrivalTime,
                arrivalTerminal: flight.arrivalTerminal,
                carrier: flight.carrier,
                flightNumber: flight.flightNumber,
                aircraft: flight.aircraft,
                stops: flight.stops,
            };
            if (wallet >= flight.price) {
                try {     
                    console.log("yarabbbb",flight);                              
                    const response = await axios.post(`http://localhost:5000/tourist/flights/bookFlight/${touristId}`, bookingData );
                    console.log("marieeeeem",response.data); 
                    message.success(`Flight booked successfully with Wallet: ${flight.carrier} ${flight.flightNumber}`);
                    fetchTouristData();
                } catch (error) {
                    message.error("Failed to book flight. Please try again.");
                }
            } else {
                message.error("Insufficient wallet balance.");
            }
        
    };

    const airportOptions = [
        { city: 'Aalborg', code: 'AAL' },
        { city: 'Aarhus', code: 'AAR' },
        { city: 'Abadan', code: 'ABD' },
        { city: 'Abakan', code: 'ABA' },
        { city: 'Aberdeen', code: 'ABR' },
        { city: 'Aberdeen (UK)', code: 'ABZ' },
        { city: 'Abha', code: 'AHB' },
        { city: 'Abu Dhabi', code: 'AUH' },
        { city: 'Abidjan', code: 'ABJ' },
        { city: 'Abilene', code: 'ABI' },
        { city: 'Abuja', code: 'ABV' },
        { city: 'Acapulco', code: 'ACA' },
        { city: 'Acarigua', code: 'AGV' },
        { city: 'Accra', code: 'ACC' },
        { city: 'Adak Island', code: 'ADK' },
        { city: 'Adana', code: 'ADA' },
        { city: 'Addis Ababa', code: 'ADD' },
        { city: 'Adelaide', code: 'ADL' },
        { city: 'Aden', code: 'ADE' },
        { city: 'Adler', code: 'AER' },
        { city: 'Agadir', code: 'AGA' },
        { city: 'Aguascaliente', code: 'AGU' },
        { city: 'Ahmedabad', code: 'AMD' },
        { city: 'Ajaccio', code: 'AJA' },
        { city: 'Akiachak', code: 'KKI' },
        { city: 'Akiak', code: 'AKI' },
        { city: 'Akita', code: 'AXT' },
        { city: 'Akron/Canton', code: 'CAK' },
        { city: 'Al-Baha', code: 'ABT' },
        { city: 'Al-Fujairah', code: 'FJR' },
        { city: 'Albany (GA)', code: 'ABY' },
        { city: 'Albany (NY)', code: 'ALB' },
        { city: 'Albert Bay', code: 'YAL' },
        { city: 'Albuquerque', code: 'ABQ' },
        { city: 'Aleandroupolis', code: 'AXD' },
        { city: 'Aleppo', code: 'ALP' },
        { city: 'Alexandria', code: 'ESF' },
        { city: 'Algiers', code: 'ALG' },
        { city: 'Alicante', code: 'ALC' },
        { city: 'Allakaket', code: 'AET' },
        { city: 'Allentown', code: 'ABE' },
        { city: 'Alma Ata', code: 'ALA' },
        { city: 'Alor Setar', code: 'AOR' },
        { city: 'Altoona', code: 'AOO' },
        { city: 'Amarillo', code: 'AMA' },
        { city: 'Amchitka', code: 'AHT' },
        { city: 'Amman', code: 'AMM' },
        { city: 'Amritsar', code: 'ATQ' },
        { city: 'Amsterdam', code: 'AMS' },
        { city: 'Amsterdam, Schiphol Airport', code: 'SPL' },
        { city: 'Baghdad, Al Muthana', code: 'BGW' },
        { city: 'Baghdad, Saddam International', code: 'SDA' },
        { city: 'Bahrain', code: 'BAH' },
        { city: 'Bakersfield', code: 'BFL' },
        { city: 'Bali Island, Denpasar', code: 'DPS' },
        { city: 'Balmaceda', code: 'BBA' },
        { city: 'Baltimore', code: 'BWI' },
        { city: 'Baltimore, Gl. Martin', code: 'MTN' },
        { city: 'Bamako', code: 'BKO' },
        { city: 'Bandar Abbas', code: 'BND' },
        { city: 'Bandar Seri Begawan', code: 'BWN' },
        { city: 'Bangalore', code: 'BLR' },
        { city: 'Bangkok', code: 'BKK' },
        { city: 'Bangor', code: 'BGR' },
        { city: 'Bangui', code: 'BGF' },
        { city: 'Banjul', code: 'BJL' },
        { city: 'Baotou', code: 'BAV' },
        { city: 'Barbados', code: 'BGI' },
        { city: 'Barcelona', code: 'BCN' },
        { city: 'Barcelona (Venezuela)', code: 'BLA' },
        { city: 'Bardufoss', code: 'BDU' },
        { city: 'Bari', code: 'BRI' },
        { city: 'Barinas', code: 'BNS' },
        { city: 'Barquisimeto', code: 'BRM' },
        { city: 'Barranquilla', code: 'BAQ' },
        { city: 'Barrow', code: 'BRW' },
        { city: 'Basle', code: 'BSL' },
        { city: 'Basra', code: 'BSR' },
        { city: 'Bastia', code: 'BIA' },
        { city: 'Baton Rouge', code: 'BTR' },
        { city: 'Battle Creek', code: 'BTL' },
        { city: 'Bay City/Saginaw', code: 'MBS' },
        { city: 'Beaumont', code: 'BPT' },
        { city: 'Beaver', code: 'WBQ' },
        { city: 'Beef Island, Tortola', code: 'EIS' },
        { city: 'Beijing', code: 'BJS' },
        { city: 'Beijing, Nanyuan Airport', code: 'NAY' },
        { city: 'Beira', code: 'BEW' },
        { city: 'Beirut', code: 'BEY' },
        { city: 'Belem', code: 'BEL' },
        { city: 'Belfast', code: 'BFS' },
        { city: 'Belfast, Belfast City', code: 'BHD' },
        { city: 'Belgrade', code: 'BEG' },
        { city: 'Belize', code: 'BZE' },
        { city: 'Belize, Municipal', code: 'TZA' },
        { city: 'Bellingham', code: 'BLI' },
        { city: 'Belo Horizonte', code: 'BHZ' },
        { city: 'Benghazi', code: 'BEN' },
        { city: 'Bergen', code: 'BGO' },
        { city: 'Berlin', code: 'BER' },
        { city: 'Berlin, Schonefeld', code: 'SXF' },
        { city: 'Berlin, Tegel', code: 'TXL' },
        { city: 'Berlin, Tempelhof', code: 'THF' },
        { city: 'Bermuda', code: 'BDA' },
        { city: 'Bern', code: 'BRN' },
        { city: 'Bethel', code: 'BET' },
        { city: 'Bettles', code: 'BTT' },
        { city: 'Cairns', code: 'CNS' },
        { city: 'Cairo', code: 'CAI' },
        { city: 'Cajamarca', code: 'CJA' },
        { city: 'Calama', code: 'CJC' },
        { city: 'Calcutta', code: 'CCU' },
        { city: 'Calgary', code: 'YYC' },
        { city: 'Cali', code: 'CLO' },
        { city: 'Calicut', code: 'CCJ' },
        { city: 'Calvi', code: 'CLY' },
        { city: 'Cambridge Bay', code: 'YCB' },
        { city: 'Campo Grande', code: 'CGR' },
        { city: 'Canaima', code: 'CAJ' },
        { city: 'Cancun', code: 'CUN' },
        { city: 'Cape Girardeau', code: 'CGI' },
        { city: 'Cape Town', code: 'CPT' },
        { city: 'Caracas', code: 'CCS' },
        { city: 'Cardiff', code: 'CWL' },
        { city: 'Carlsbad', code: 'CNM' },
        { city: 'Cartagena', code: 'CTG' },
        { city: 'Carupano', code: 'CUP' },
        { city: 'Casablanca', code: 'CAS' },
        { city: 'Casablanca, Mohamed V', code: 'CMN' },
        { city: 'Casper', code: 'CPR' },
        { city: 'Catania', code: 'CTA' },
        { city: 'Cayenne', code: 'CAY' },
        { city: 'Cebu', code: 'CEB' },
        { city: 'Cedar City', code: 'CDC' },
        { city: 'Cedar Rapids / Iowa City', code: 'CID' },
        { city: 'Chachapoyas', code: 'CHH' },
        { city: 'Chalkyitsik', code: 'CIK' },
        { city: 'Champaign', code: 'CMI' },
        { city: 'Changchun', code: 'CGQ' },
        { city: 'Changsha', code: 'CSX' },
        { city: 'Charleston', code: 'CHS' },
        { city: 'Charlotte', code: 'CLT' },
        { city: 'Chattanooga', code: 'CHA' },
        { city: 'Chefornak', code: 'CYF' },
        { city: 'Cheju', code: 'CJU' },
        { city: 'Chengdu', code: 'CTU' },
        { city: 'Chetumal', code: 'CTM' },
        { city: 'Chevak', code: 'VAK' },
        { city: 'Chiang Mai', code: 'CNX' },
        { city: 'Chicago', code: 'CHI' },
        { city: 'Chicago, Merill C. Meigs', code: 'CGX' },
        { city: 'Chicago, Midway', code: 'MDW' },
        { city: 'Chicago, O’Hare', code: 'ORD' },
        { city: 'Chichenitza', code: 'CZA' },
        { city: 'Chiclayo', code: 'CIX' },
        { city: 'Chico', code: 'CIC' },
        { city: 'Chignik', code: 'KCL' },
        { city: 'Chihuahua', code: 'CUU' },
        { city: 'Chisholm', code: 'HIB' },
        { city: 'Chittagong', code: 'CGP' },
        { city: 'Dakar', code: 'DKR' },
        { city: 'Dalaman', code: 'DLM' },
        { city: 'Dalian', code: 'DLC' },
        { city: 'Dallas/Ft. Worth', code: 'DFW' },
        { city: 'Dallas, Love Field', code: 'DAL' },
        { city: 'Damascus', code: 'DAM' },
        { city: 'Danville', code: 'DNV' },
        { city: 'Dar Es Salaam', code: 'DAR' },
        { city: 'Darwin', code: 'DRW' },
        { city: 'Davao', code: 'DVO' },
        { city: 'Dayton', code: 'DAY' },
        { city: 'Daytona Beach', code: 'DAB' },
        { city: 'Decatur', code: 'DEC' },
        { city: 'Deer Lake', code: 'YDF' },
        { city: 'Delhi', code: 'DEL' },
        { city: 'Delta', code: 'DTA' },
        { city: 'Denver', code: 'DEN' },
        { city: 'Des Moines', code: 'DSM' },
        { city: 'Detroit', code: 'DTT' },
        { city: 'Detroit City', code: 'DET' },
        { city: 'Detroit, Willow Run', code: 'YIP' },
        { city: 'Dhahran', code: 'DHA' },
        { city: 'East London', code: 'ELS' },
        { city: 'East Midlands', code: 'EMA' },
        { city: 'Easter Island', code: 'IPC' },
        { city: 'Edinburgh', code: 'EDI' },
        { city: 'Edmonton', code: 'YEA' },
        { city: 'Edmonton, Albert Int’l', code: 'YEG' },
        { city: 'Edmonton, Municipal', code: 'YXD' },
        { city: 'Edmonton, Namao Field', code: 'YED' },
        { city: 'Eek', code: 'EEK' },
        { city: 'Eglin Afb/Valparaiso', code: 'VPS' },
        { city: 'Eindhoven', code: 'EIN' },
        { city: 'El Paso', code: 'ELP' },
        { city: 'El Salvador', code: 'ESR' },
        { city: 'Elat', code: 'ETH' },
        { city: 'Elko', code: 'EKO' },
        { city: 'Ely', code: 'ELY' },
        { city: 'Fairbanks', code: 'FAI' },
        { city: 'Fall River, New Bedford', code: 'EWB' },
        { city: 'False Pass', code: 'KFP' },
        { city: 'Fargo', code: 'FAR' },
        { city: 'Faro', code: 'FAO' },
        { city: 'Fayetteville', code: 'FAY' },
        { city: 'Fez', code: 'FEZ' },
        { city: 'Fillmore', code: 'FIL' },
        { city: 'Flagstaff', code: 'FLG' },
        { city: 'Flamingo', code: 'FLM' },
        { city: 'Florence', code: 'FLO' },
        { city: 'Florence (Italy)', code: 'FLR' },
        { city: 'Florence (SC)', code: 'FLO' },
        { city: 'Fortaleza', code: 'FOR' },
        { city: 'Frankfurt', code: 'FRA' },
        { city: 'Frankfurt Hahn', code: 'HHN' },
        { city: 'Frederick', code: 'FDK' },
        { city: 'Freeport', code: 'FPO' },
        { city: 'Fremantle', code: 'FTE' },
        { city: 'Fresno', code: 'FAT' },
        { city: 'Friedrichshafen', code: 'FDH' },
        { city: 'Ft. Lauderdale', code: 'FLL' },
        { city: 'Ft. Myers', code: 'RSW' },
        { city: 'Ft. Walton Beach', code: 'VPS' },
        { city: 'Ft. Wayne', code: 'FWA' },
        { city: 'Fukue', code: 'FUJ' },
        { city: 'Fukuoka', code: 'FUK' },
        { city: 'Funchal', code: 'FNC' },
        { city: 'Fuyang', code: 'FUG' },
        { city: 'Gaborone', code: 'GBE' },
        { city: 'Gainesville', code: 'GNV' },
        { city: 'Galapagos', code: 'GPS' },
        { city: 'Galway', code: 'GWY' },
        { city: 'Gander', code: 'YQX' },
        { city: 'Garden City', code: 'GCK' },
        { city: 'Garoe', code: 'GGR' },
        { city: 'Gary', code: 'GYY' },
        { city: 'Gaya', code: 'GAY' },
        { city: 'Gaziantep', code: 'GZT' },
        { city: 'Geneva', code: 'GVA' },
        { city: 'Genoa', code: 'GOA' },
        { city: 'Georgetown', code: 'GEO' },
        { city: 'Gibraltar', code: 'GIB' },
        { city: 'Glasgow', code: 'GLA' },
        { city: 'Glen Falls', code: 'GFL' },
        { city: 'Glen Innes', code: 'GLI' },
        { city: 'Glenview', code: 'NBU' },
        { city: 'Gold Coast', code: 'OOL' },
        { city: 'Golmud', code: 'GOQ' },
        { city: 'Goose Bay', code: 'YYR' },
        { city: 'Grand Canyon', code: 'GCN' },
        { city: 'Grand Rapids', code: 'GRR' },
        { city: 'Grand Turk Island', code: 'GDT' },
        { city: 'Granite City', code: 'GRI' },
        { city: 'Graz', code: 'GRZ' },
        { city: 'Green Bay', code: 'GRB' },
        { city: 'Greenbrier', code: 'LWB' },
        { city: 'Greensboro', code: 'GSO' },
        { city: 'Greenville', code: 'GLH' },
        { city: 'Guadalajara', code: 'GDL' },
        { city: 'Guam', code: 'GUM' },
        { city: 'Guangzhou', code: 'CAN' },
        { city: 'Guarulhos', code: 'GRU' },
        { city: 'Gulfport/Biloxi', code: 'GPT' },
        { city: 'Gustavus', code: 'GST' },
        { city: 'Guatemala', code: 'GUA' },
        { city: 'Guayaquil', code: 'GYE' },
        { city: 'Gwangju', code: 'KWJ' },
        { city: 'Gwadar', code: 'GWD' },
        { city: 'Gyandzha', code: 'KVD' },
        { city: 'Gyor', code: 'QGY' },
        { city: 'Haifa', code: 'HFA' },
        { city: 'Haikou', code: 'HAK' },
        { city: 'Hail', code: 'HAS' },
        { city: 'Halifax', code: 'YHZ' },
        { city: 'Hamburg', code: 'HAM' },
        { city: 'Hamburg (Finkenwerder)', code: 'XFW' },
        { city: 'Hamilton', code: 'HLZ' },
        { city: 'Hana', code: 'HNM' },
        { city: 'Hanamaki', code: 'HNA' },
        { city: 'Hancock', code: 'CMX' },
        { city: 'Hangzhou', code: 'HGH' },
        { city: 'Hanover', code: 'HAJ' },
        { city: 'Harare', code: 'HRE' },
        { city: 'Harrisburg', code: 'MDT' },
        { city: 'Harrison', code: 'HRO' },
        { city: 'Hartford', code: 'BDL' },
        { city: 'Hastings', code: 'HSI' },
        { city: 'Hat Yai', code: 'HDY' },
        { city: 'Havana', code: 'HAV' },
        { city: 'Hayward', code: 'HWD' },
        { city: 'Healy Lake', code: 'HKB' },
        { city: 'Helsinki', code: 'HEL' },
        { city: 'Hermosillo', code: 'HMO' },
        { city: 'Hervey Bay', code: 'HVB' },
        { city: 'Hibbing', code: 'HIB' },
        { city: 'Hilton Head', code: 'HHH' },
        { city: 'Hiroshima', code: 'HIJ' },
        { city: 'Hobart', code: 'HBA' },
        { city: 'Holguin', code: 'HOG' },
        { city: 'Honiara', code: 'HIR' },
        { city: 'Hong Kong', code: 'HKG' },
        { city: 'Honolulu', code: 'HNL' },
        { city: 'Horta', code: 'HOR' },
        { city: 'Houston', code: 'IAH' },
        { city: 'Hualien', code: 'HUN' },
        { city: 'Huanuco', code: 'HUU' },
        { city: 'Huntsville', code: 'HSV' },
        { city: 'Hurghada', code: 'HRG' },
        { city: 'Hyannis', code: 'HYA' },
        { city: 'Iasi', code: 'IAS' },
        { city: 'Ibiza', code: 'IBZ' },
        { city: 'Iguassu Falls', code: 'IGU' },
        { city: 'Ilheus', code: 'IOS' },
        { city: 'Imperatriz', code: 'IMP' },
        { city: 'Indianapolis', code: 'IND' },
        { city: 'Innsbruck', code: 'INN' },
        { city: 'Iquitos', code: 'IQT' },
        { city: 'Irkutsk', code: 'IKT' },
        { city: 'Isfahan', code: 'IFN' },
        { city: 'Islamabad', code: 'ISB' },
        { city: 'Istanbul', code: 'IST' },
        { city: 'Ithaca', code: 'ITH' },
        { city: 'Ivano-Frankovsk', code: 'IFO' },
        { city: 'Izmir', code: 'ADB' },
        { city: 'Jackson', code: 'JAC' },
        { city: 'Jacksonville', code: 'JAX' },
        { city: 'Jakarta', code: 'JKT' },
        { city: 'Jamestown', code: 'JMS' },
        { city: 'Jeddah', code: 'JED' },
        { city: 'Jersey', code: 'JER' },
        { city: 'Jiangmen', code: 'JMJ' },
        { city: 'Jinan', code: 'TNA' },
        { city: 'Jinghong', code: 'JHG' },
        { city: 'Jodhpur', code: 'JDH' },
        { city: 'Johannesburg', code: 'JNB' },
        { city: 'Joinville', code: 'JOI' },
        { city: "Juba", code: "JUB" },
        { city: "Juneau", code: "JNU" },
        { city: "Kabul", code: "KBL" },
        { city: "Kahului", code: "OGG" },
        { city: "Kailua-Kona", code: "KOA" },
        { city: "Kalamazoo", code: "AZO" },
        { city: "Kalispell", code: "FCA" },
        { city: "Kampala", code: "KLA" },
        { city: "Kandy", code: "KDW" },
        { city: "Kano", code: "KAN" },
        { city: "Kapalua", code: "JHM" },
        { city: "Karachi", code: "KHI" },
        { city: "Kathmandu", code: "KTM" },
        { city: "Kaunas", code: "KUN" },
        { city: "Kefallinia", code: "EFL" },
        { city: "Kelowna", code: "YLW" },
        { city: "Kenai", code: "ENA" },
        { city: "Ketchikan", code: "KTN" },
        { city: "Khartoum", code: "KRT" },
        { city: "Kiev", code: "KBP" },
        { city: "Kingston", code: "KIN" },
        { city: "Kinshasa", code: "FIH" },
        { city: "Kona", code: "KOA" },
        { city: "Krakow", code: "KRK" },
        { city: "Kuala Lumpur", code: "KUL" },
        { city: "La Paz", code: "LAP" },
        { city: "Lagos", code: "LOS" },
        { city: "Lahore", code: "LHE" },
        { city: "Las Vegas", code: "LAS" },
        { city: "Leeds", code: "LBA" },
        { city: "Leon", code: "LEN" },
        { city: "Lima", code: "LIM" },
        { city: "Lisbon", code: "LIS" },
        { city: "London", code: "LON" },
        { city: "Los Angeles", code: "LAX" },
        { city: "Lusaka", code: "LUN" },
        { city: "Luxembourg", code: "LUX" },
        { city: "Madrid", code: "MAD" },
        { city: "Male", code: "MLE" },
        { city: "Managua", code: "MGA" },
        { city: "Manaus", code: "MAO" },
        { city: "Manchester", code: "MAN" },
        { city: "Manila", code: "MNL" },
        { city: "Maputo", code: "MPM" },
        { city: "Marseille", code: "MRS" },
        { city: "Melbourne", code: "MEL" },
        { city: "Mexico City", code: "MEX" },
        { city: "Miami", code: "MIA" },
        { city: "Milan", code: "MIL" },
        { city: "Minsk", code: "MSQ" },
        { city: "Monaco", code: "MCM" },
        { city: "Montevideo", code: "MVD" },
        { city: "Montreal", code: "YUL" },
        { city: "Moscow", code: "MOW" },
        { city: "Mumbai", code: "BOM" },
        { city: "Munich", code: "MUC" },
        { city: "Mykonos", code: "JMK" },
        { city: "Nairobi", code: "NBO" },
        { city: "Nashville", code: "BNA" },
        { city: "New Orleans", code: "MSY" },
        { city: "New York", code: "JFK" },
        { city: "Nice", code: "NCE" },
        { city: "Osaka", code: "OSA" },
        { city: "Oslo", code: "OSL" },
        { city: "Palermo", code: "PMO" },
        { city: "Paris", code: "PAR" },
        { city: "Perth", code: "PER" },
        { city: "Philadelphia", code: "PHL" },
        { city: "Phoenix", code: "PHX" },
        { city: "Pittsburgh", code: "PIT" },
        { city: "Portland", code: "PDX" },
        { city: "Prague", code: "PRG" },
        { city: "Reykjavik", code: "KEF" },
        { city: "Rome", code: "FCO" },
        { city: "San Diego", code: "SAN" },
        { city: "San Francisco", code: "SFO" },
        { city: "San Jose", code: "SJC" },
        { city: "San Juan", code: "SJU" },
        { city: "Santiago", code: "SCL" },
        { city: "Santo Domingo", code: "SDQ" },
        { city: "Sao Paulo", code: "GRU" },
        { city: "Seattle", code: "SEA" },
        { city: "Seoul", code: "ICN" },
        { city: "Shanghai", code: "PVG" },
        { city: "Singapore", code: "SIN" },
        { city: "Stockholm", code: "ARN" },
        { city: "Sydney", code: "SYD" },
        { city: "Tokyo", code: "HND" },
        { city: "Toronto", code: "YYZ" },
        { city: "Venice", code: "VCE" },
        { city: "Vienna", code: "VIE" },
        { city: "Warsaw", code: "WAW" },
        { city: "Washington", code: "IAD" },
        { city: "Zurich", code: "ZRH" }
        ];
    

    return (
        <div>
            <Form layout="inline" onFinish={onFinish}>
            <Form.Item
                label="Origin"
                name="origin"
                rules={[{ required: true }]}
            >
                <Select
                    placeholder="Select Origin Airport"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                        const childrenText = option.props.children.join(' ').toLowerCase(); 
                        return childrenText.includes(input.toLowerCase());
                    }}
                >
                    {airportOptions.map((airport) => (
                        <Option key={airport.code} value={airport.code}>
                            {airport.city} ({airport.code})
                        </Option>
                    ))}
                </Select>
            </Form.Item>

          
            <Form.Item
                label="Destination"
                name="destination"
                rules={[{ required: true }]}
            >
                <Select
                    placeholder="Select Destination Airport"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                        const childrenText = option.props.children.join(' ').toLowerCase(); 
                        return childrenText.includes(input.toLowerCase());
                    }}
                >
                    {airportOptions.map((airport) => (
                        <Option key={airport.code} value={airport.code}>
                            {airport.city} ({airport.code})
                        </Option>
                    ))}
                </Select>
            </Form.Item>
                <Form.Item label="Departure Date" name="departureDate" rules={[{ required: true }]}>
                    <DatePicker />
                </Form.Item>
                <Form.Item label="Count" name="count" rules={[{ required: true }]}>
                    <InputNumber min={1} max={9} />
                </Form.Item>
                <Form.Item>
                    <CustomButton size="s" value="Search Flights" htmlType="submit" loading={loading} />
                </Form.Item>
                <SelectCurrency currency={currency} onCurrencyChange={handleCurrencyChange} style={{top:15}}/>
            </Form>

            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {flights.length > 0 && flights.map((flight) => (
                    <BasicCard
                        key={flight.id}
                        title={`${flight.carrier} ${flight.flightNumber}`}
                        extra={parseFloat(flight.price)}
                        fields={{
                            "Departure Airport": flight.departureAirport,
                            "Arrival Airport": flight.arrivalAirport,
                            "Duration": flight.totalDuration,
                            "Departure Time": flight.departureTime,
                            "Arrival Time": flight.arrivalTime,
                        }}
                        hoverable
                        currency={currency}
                        currencyRates={currencyRates}
                        renderActions={() => (
                            // hasebha hena ashan lama nezawed el credit card

                            // <Select
                            //     allowClear
                            //     placeholder={<span style={{ color: 'green' }}>Book</span>}
                            //     style={{ width: 150, color: 'green', borderColor: 'green' }}
                            //     dropdownStyle={{ color: 'green', borderColor: 'green' }}
                            //     onChange={(value) => handleBookFlight(flight, value)}
                            // >
                            //     <Option style={{ color: 'green' }} value="Wallet">Pay by Wallet</Option>
                            //     <Option style={{ color: 'green' }} value="Credit Card">Pay by Credit Card</Option>
                            // </Select>
                            <CustomButton value = "Book" size = "s" onClick={() => handleBookFlight(flight)}/>
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

export default BookFlight;

