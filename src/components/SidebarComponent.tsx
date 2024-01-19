import { Property } from '../types';

interface SidebarComponentProps {
    selectedProperty: Property | undefined;
    handleCloseSidebar: () => void;
}

const SidebarComponent = ({ selectedProperty, handleCloseSidebar }:SidebarComponentProps) => {
  return (
    <div className="sidebar">
        {selectedProperty && 
          <>
            <a data-test="close-button" href="#" onClick={handleCloseSidebar} className='close-button'>x</a>
            <table className="content">
              <tbody>
                <tr>
                  <td className='label'>Address</td>
                  <td>{selectedProperty.full_address}</td>
                </tr>
                <tr>
                  <td className='label'>Council</td>
                  <td>{selectedProperty.council}</td>
                </tr>
                <tr>
                  <td className='label'>Post Code</td>
                  <td>{selectedProperty.postcode}</td>
                </tr>
              </tbody>
            </table>
          </>
        }
      </div>
  );
};

export default SidebarComponent;
