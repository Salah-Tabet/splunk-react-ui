import React, {useState} from 'react';
import Dashboard from '@splunk/react-icons/enterprise/Dashboard';
import Button from '@splunk/react-ui/Button';
import Card from '@splunk/react-ui/Card';
import Table from '@splunk/react-ui/Table';
import styled from 'styled-components';



const StyledPrivsTableContainer = styled.div`
    width: 50%;
    padding:10px;
    border:1px solid #ccc;`;

    

function PrivsTableComponent({ selectedDashboard }) {
    const [tableData, setTableData] = useState([
        { id: '1', dashboard: 'Dashboard 1', role: 'Role A', status: '', read: false, write: false },
        { id: '2', dashboard: 'Dashboard 1', role: 'Role B', status: '', read: true, write: false },
        { id: '3', dashboard: 'Dashboard 2', role: 'Role C', status: '', read: false, write: true },
        { id: '4', dashboard: 'Dashboard 2', role: 'Role D', status: '', read: true, write: true },
        { id: '5', dashboard: 'Dashboard 3', role: 'Role E', status: '', read: true, write: true },
      ]);
      const filteredData = tableData.filter((row) => !selectedDashboard || row.dashboard === selectedDashboard);
      const handleCheckboxChange = (roleId, permissionType) => {
        const updatedTableData = tableData.map((row) => {
          if (row.id === roleId) {
            if (permissionType === 'read') {
              row.read = !row.read;
              row.status = row.read ? 'Permission read added' : 'Permission read revoked';
            } else if (permissionType === 'write') {
              row.write = !row.write;
              row.status = row.write ? 'Permission write added' : 'Permission write revoked';
            }
          }
          return row;
        });
        setTableData(updatedTableData);
      };
return (
    <>
     <StyledPrivsTableContainer>
      <Table dockoffset={0} stripeRows headType="docked" dockscrollBar>
        <Table.Head>
          <Table.HeadCell width={200}>Roles</Table.HeadCell>
          <Table.HeadCell width={200}>Permission</Table.HeadCell>
          <Table.HeadCell width={200}>Status</Table.HeadCell>
        </Table.Head>
        <Table.Body>
        {tableData
            .filter((row) => !selectedDashboard || row.dashboard === selectedDashboard)
            .map((row) => (
              <Table.Row key={row.id}>
                <Table.Cell>{row.role}</Table.Cell>
                <Table.Cell>
                  {/* <Checkbox
                    checked={row.read}
                    onChange={() => handleCheckboxChange(row.id, 'read')}
                  >
                    Read
                  </Checkbox>
                  <Checkbox
                    checked={row.write}
                    onChange={() => handleCheckboxChange(row.id, 'write')}
                  >
                    Write
                  </Checkbox> */}
                </Table.Cell>
                <Table.Cell>{row.status}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </StyledPrivsTableContainer>
    </>
)
}
export default PrivsTableComponent;