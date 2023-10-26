import React, {useState, useEffect} from 'react';
import Dashboard from '@splunk/react-icons/enterprise/Dashboard';
import Button from '@splunk/react-ui/Button';
import Card from '@splunk/react-ui/Card';
import Table from '@splunk/react-ui/Table';
import styled from 'styled-components';
import ControlGroup from "@splunk/react-ui/ControlGroup";
import Switch from "@splunk/react-ui/Switch";



  
  const CheckboxContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-right: 10px; // Remove the extra space to the right of checkboxes
  `;
  
 
    

function PrivsTableComponent({ selectedDashboard }) {
    const [checkboxValues, setCheckboxValues] = useState([]); 
    const [tableData, setTableData] = useState([
        { id: '1', dashboard: 'Dashboard 1', role: 'Role A', status: '', read: false, write: true },
        { id: '2', dashboard: 'Dashboard 1', role: 'Role B', status: '', read: false, write: false },
        { id: '3', dashboard: 'Dashboard 2', role: 'Role C', status: '', read: false, write: true },
        { id: '4', dashboard: 'Dashboard 2', role: 'Role D', status: '', read: true, write: true },
        { id: '5', dashboard: 'Dashboard 3', role: 'Role E', status: '', read: true, write: true },
      ]);
      const filteredData = tableData.filter((row) => row.dashboard === selectedDashboard);
    //   const handleCheckboxChange = (roleId, permissionType) => {
    //     const updatedTableData = tableData.map((row) => {
    //       if (row.id === roleId) {
    //         if (permissionType === 'read') {
    //           row.read = !row.read;
    //           row.status = row.read ? 'Permission read added' : 'Permission read revoked';
    //         } else if (permissionType === 'write') {
    //           row.write = !row.write;
    //           row.status = row.write ? 'Permission write added' : 'Permission write revoked';
    //         }
    //       }
    //       return row;
    //     });
    //     setTableData(updatedTableData);
    //   };
    
      
    const [readChecked, setReadChecked] = useState(false);
    const [writeChecked, setWriteChecked] = useState(false);

    useEffect(() => {
        // Initialize readChecked and writeChecked based on filteredData
        const initialReadChecked = {};
        const initialWriteChecked = {};
    
        filteredData.forEach((row) => {
          initialReadChecked[row.role] = row.read;
          initialWriteChecked[row.role] = row.write;
        });
    
        setReadChecked(initialReadChecked);
        setWriteChecked(initialWriteChecked);
      }, [selectedDashboard]);
    
  
    const handleReadCheckboxClick = (role) => {
        setReadChecked({
          ...readChecked,
          [role]: !readChecked[role],
        });
      };
    
      const handleWriteCheckboxClick = (role) => {
        setWriteChecked({
          ...writeChecked,
          [role]: !writeChecked[role],
        });
      };
return (
    <>
     {/* <StyledPrivsTableContainer> */}
      <Table dockoffset={0} stripeRows headType="docked" dockscrollBar>
        <Table.Head>
          <Table.HeadCell width={200}>Roles</Table.HeadCell>
          <Table.HeadCell width={200}>Permission</Table.HeadCell>
          {/* <Table.HeadCell width={200}>Status</Table.HeadCell> */}
        </Table.Head>
        <Table.Body>
        {selectedDashboard &&
            filteredData.map((row, index) => (
              <Table.Row key={index}>
                <Table.Cell>{row.role}</Table.Cell>
                <Table.Cell>
                  <CheckboxContainer>
                    <Switch
                      value="Read"
                      onClick={() => handleReadCheckboxClick(row.role)}
                      selected={readChecked[row.role]}
                      appearance="checkbox"
                    >
                      Read
                    </Switch>
                    <Switch
                      value="Write"
                      onClick={() => handleWriteCheckboxClick(row.role)}
                      selected={writeChecked[row.role]}
                      appearance="checkbox"
                    >
                      Write
                    </Switch>
                  </CheckboxContainer>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    {/* </StyledPrivsTableContainer> */}
    </>
)
}
export default PrivsTableComponent;