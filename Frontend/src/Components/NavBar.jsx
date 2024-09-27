import './NavBar.css'
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, BellFilled } from '@ant-design/icons'; 
import IconFloatButton from './IconButton';
import {IconButton} from '../Components';
import { Colors } from './Constants'; 


function NavBar() {
    const navigate = useNavigate();

  return (
    <div>
      <div className="navbar">
        <div id="logo">Ajaza</div>
        <div id="right-col">
          <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/contact">Contact Us</Link>
          </li>
          <li>
          <IconButton
              icon={BellFilled}
              backgroundColor={Colors.primary.default}
              badge={{ count: "5" }}
              // onClick={() => testFunction(1, 2)}
              style={{ marginLeft: "20px" }}
            />
          </li>
          <li>
            <IconFloatButton
              icon={UserOutlined}
              backgroundColor={Colors.primary.default}
              onClick={() => navigate('/profile')} 
              style={{ marginLeft: "20px" }}
            />
          </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
