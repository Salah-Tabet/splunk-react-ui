import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button  from '@splunk/react-ui/Button';
import Search  from '@splunk/react-ui/Search';
import { SplunkThemeProvider, variables } from '@splunk/themes';
import RolesInputComponent from './components/RolesInputComponent';
import TabLayout from '@splunk/react-ui/TabLayout';
import PrivsTableComponent from './components/PrivsTableComponent';
import styled from 'styled-components';
//import Box from "@components/Box.js";

//import { StyledContainer, StyledGreeting } from './AppStyles';
import { createGlobalStyle } from 'styled-components';

const propTypes = {
    name: PropTypes.string,
};
const StyledPrivsTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 60%;
  padding: 20px;
`;

const StyledTopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  max-width: 50px; /* Limit the button width to a maximum of 50px */
`;


const App = ({ name = 'User' }) => {
    const [counter, setCounter] = useState(0);
    const [activePanelId, setActivePanelId] = useState('one');
    const [searchValue, setSearchValue] = useState('');
    const [selectedDashboard, setSelectedDashboard] = useState('');
    const [showTable, setShowTable] = useState(false);
    const GlobalStyles = createGlobalStyle`
    body: {
        backgroundColor: $(variable.gray96);
    }`;
    const dummyDashboardData = [
        'Dashboard 1',
        'Dashboard 2',
        'Dashboard 3',
        // Add more dashboard options as needed
    ];

    const handleChange = (e, {activePanelId: panelId}) => {
        setActivePanelId(panelId);
    }
    const handleSearchChange = (searchValue) => {
        setSelectedDashboard(searchValue);
      };
      
    
      const handleNext = () => {
        if (selectedDashboard) {
            setShowTable(true);
        // if (searchValue) {
        //     setSelectedDashboard(searchValue);
          } else {
            console.log("Please select a dashboard.");
          }
      };
      
      const handleCancel = () => {
        console.log("Cance button clicked");
      };
    
   const [data, setData] = useState([]);
    
    return (
        <>
         <SplunkThemeProvider family="enterprise" colorScheme="light" density="comfortable">
            <GlobalStyles />
            <TabLayout activePanelId={activePanelId} onChange={handleChange}>
            <TabLayout.Panel label="Dashboards" panelId="one" style={{ margin: 20 }}>
                <StyledPrivsTableContainer>
                <StyledTopContainer>
                    <RolesInputComponent onSearchChange={handleSearchChange} />
                    <StyledButton
                    label="Cancel"
                    appearance="secondary"
                    onClick={() => handleCancel()}
                    />
                    <StyledButton
                    label="Next>>"
                    appearance="primary"
                    onClick={handleNext}
                    />
                </StyledTopContainer>
                
                    {showTable && selectedDashboard ? (
                    <PrivsTableComponent selectedDashboard={selectedDashboard} />
                    ) : null}
                
                </StyledPrivsTableContainer>
            </TabLayout.Panel>
            <TabLayout.Panel label="Alerts" panelId="two" style={{ margin: 20 }}>
                <p>Here goes the Alerts, this is blank for now and TBD</p>
            </TabLayout.Panel>
            </TabLayout>
        </SplunkThemeProvider>
        </>
        );
};

App.propTypes = propTypes;

export default App;
