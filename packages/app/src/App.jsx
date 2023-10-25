import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button  from '@splunk/react-ui/Button';
import Search  from '@splunk/react-ui/Search';
import { SplunkThemeProvider, variables } from '@splunk/themes';
import Loading from './components/RolesInputComponent';
import TabLayout from '@splunk/react-ui/TabLayout';
import PrivsTableComponent from './components/PrivsTableComponent';
//import './styles.css';
//import Box from "@components/Box.js";

import { StyledContainer, StyledGreeting } from './AppStyles';
import { createGlobalStyle } from 'styled-components';

const propTypes = {
    name: PropTypes.string,
};

const App = ({ name = 'User' }) => {
    const [counter, setCounter] = useState(0);
    const [activePanelId, setActivePanelId] = useState('one');
    const [searchValue, setSearchValue] = useState('');
    const [selectedDashboard, setSelectedDashboard] = useState('');
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
    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
      };
    
      const handleNext = () => {
        setSelectedDashboard(searchValue);
      };
      const handleCancel = () => {
        console.log("Cance button clicked");
      };
    
   const [data, setData] = useState([]);
    
    return (
        <>
        <SplunkThemeProvider family="enterprise" colorScheme="light" density="comfortable">
            <GlobalStyles/>
            <TabLayout activePanelId={activePanelId} onChange={handleChange}>
            <TabLayout.Panel label="Dashboards" panelId="one" style={{margin: 20 }}>
            
            <div className="centered-container">
                <Loading onSearchChange={handleSearchChange} />
                <Button label="Cancel" appearance="secondary" onClick={() => handleCancel()} />
                <Button label="Next>>" appearance="primary" onClick={handleNext} />
               
            </div>
            <div>
                 <PrivsTableComponent  selectedDashboard={selectedDashboard}/>
            </div>
            </TabLayout.Panel>
            <TabLayout.Panel label="Alerts" panelId="two" style={{ margin: 20 }}>
            <p>
                Here goes the Alerts, this blank for now and TBD
            </p>
            </TabLayout.Panel>
            </TabLayout> 
        </SplunkThemeProvider>
        </>
        );
};

App.propTypes = propTypes;

export default App;
